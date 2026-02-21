import type {
    FormSchema,
    FormContext,
    FormEngineOptions,
    FormEngineState,
    StepChangeEvent,
    ConditionalTransition
} from './types';
import { StorageAdapter } from './storage';
import { Validator } from './validator';
import { PathCalculator } from './path-calculator';

/**
 * Form Engine - The core state machine for graph-based forms
 */
export class FormEngine {
    private schema: FormSchema;
    private state: FormEngineState;
    private storage: StorageAdapter | null = null;
    private listeners: Map<string, Set<Function>> = new Map();
    private options: FormEngineOptions;

    constructor(options: FormEngineOptions) {
        this.options = options;
        this.schema = options.schema;

        this.state = {
            currentState: this.schema.initial,
            context: this.schema.context || {},
            history: [],
            completedSteps: new Set()
        };

        if (options.autoSave) {
            this.storage = new StorageAdapter(options.storageKey);
        }
    }

    /**
     * Start the form engine
     */
    async start(): Promise<void> {
        // Try to resume from saved state
        if (this.storage) {
            const savedState = await this.storage.load();
            if (savedState) {
                this.state = savedState;
                this.emit('resumed', { state: this.state });
            }
        }

        this.emit('started', { state: this.state });
    }

    /**
     * Transition to the next state based on an event
     */
    async transition(event: string, data?: any): Promise<void> {
        const currentStateConfig = this.schema.states[this.state.currentState];

        if (!currentStateConfig?.on) {
            throw new Error(`No transitions defined for state: ${this.state.currentState}`);
        }

        const transition = currentStateConfig.on[event];

        if (!transition) {
            throw new Error(`No transition found for event: ${event} in state: ${this.state.currentState}`);
        }

        // Update context with new data
        if (data) {
            this.state.context = { ...this.state.context, ...data };
        }

        // Determine target state
        let targetState: string;

        if (typeof transition === 'string') {
            targetState = transition;
        } else {
            const conditionalTransition = transition as ConditionalTransition;

            // Check condition if it exists
            if (conditionalTransition.cond && !conditionalTransition.cond(this.state.context)) {
                throw new Error(`Condition not met for transition to: ${conditionalTransition.target}`);
            }

            targetState = conditionalTransition.target;
        }

        // Validate before transitioning
        const validation = Validator.validatePath(
            this.state.currentState,
            this.state.context,
            this.schema
        );

        if (!validation.valid) {
            this.emit('validationError', { errors: validation.errors });
            if (this.options.onError) {
                this.options.onError(new Error(validation.errors.join(', ')));
            }
            return;
        }

        // Perform transition
        const previousState = this.state.currentState;
        this.state.completedSteps.add(previousState);
        this.state.history.push(previousState);
        this.state.currentState = targetState;

        // Auto-save if enabled
        if (this.storage) {
            await this.storage.save(this.state);
        }

        // Emit events
        const stepChangeEvent: StepChangeEvent = {
            from: previousState,
            to: targetState,
            context: this.state.context
        };

        this.emit('stepChange', stepChangeEvent);

        if (this.options.onStepChange) {
            this.options.onStepChange(stepChangeEvent);
        }

        // Check if we've reached a final state
        const targetStateConfig = this.schema.states[targetState];
        if (!targetStateConfig?.on || Object.keys(targetStateConfig.on).length === 0) {
            this.emit('complete', { context: this.state.context });
            if (this.options.onComplete) {
                this.options.onComplete(this.state.context);
            }
        }
    }

    /**
     * Go back to the previous state
     */
    async back(): Promise<void> {
        if (this.state.history.length === 0) {
            throw new Error('Cannot go back: no history available');
        }

        const previousState = this.state.history.pop()!;
        this.state.completedSteps.delete(this.state.currentState);

        const currentState = this.state.currentState;
        this.state.currentState = previousState;

        // Auto-save if enabled
        if (this.storage) {
            await this.storage.save(this.state);
        }

        this.emit('stepChange', {
            from: currentState,
            to: previousState,
            context: this.state.context
        });
    }

    /**
     * Update context without transitioning
     */
    async updateContext(data: Partial<FormContext>): Promise<void> {
        this.state.context = { ...this.state.context, ...data };

        // Auto-save if enabled
        if (this.storage) {
            await this.storage.save(this.state);
        }

        this.emit('contextUpdate', { context: this.state.context });
    }

    /**
     * Get current progress percentage
     */
    getProgress(): number {
        return PathCalculator.calculateProgress(
            this.state.currentState,
            this.state.completedSteps,
            this.schema
        );
    }

    /**
     * Get current state
     */
    getCurrentState(): string {
        return this.state.currentState;
    }

    /**
     * Get current context
     */
    getContext(): FormContext {
        return { ...this.state.context };
    }

    /**
     * Get possible next states
     */
    getPossibleNextStates(): string[] {
        const currentStateConfig = this.schema.states[this.state.currentState];

        if (!currentStateConfig?.on) {
            return [];
        }

        return Object.values(currentStateConfig.on).map(transition =>
            typeof transition === 'string' ? transition : transition.target
        );
    }

    /**
     * Reset the form
     */
    async reset(): Promise<void> {
        this.state = {
            currentState: this.schema.initial,
            context: this.schema.context || {},
            history: [],
            completedSteps: new Set()
        };

        if (this.storage) {
            await this.storage.clear();
        }

        this.emit('reset', {});
    }

    /**
     * Event emitter
     */
    on(event: string, callback: Function): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);
    }

    /**
     * Remove event listener
     */
    off(event: string, callback: Function): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.delete(callback);
        }
    }

    /**
     * Emit event
     */
    private emit(event: string, data: any): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    /**
     * Get all possible paths from current state
     */
    getPossiblePaths(): string[][] {
        return PathCalculator.getPossiblePaths(
            this.state.currentState,
            this.schema,
            this.state.context
        );
    }

    /**
     * Check if we can go back
     */
    canGoBack(): boolean {
        return this.state.history.length > 0;
    }

    /**
     * Get the full state (for debugging)
     */
    getState(): FormEngineState {
        return {
            ...this.state,
            completedSteps: new Set(this.state.completedSteps)
        };
    }
}




