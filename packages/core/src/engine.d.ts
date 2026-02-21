import type { FormContext, FormEngineOptions, FormEngineState } from './types';
/**
 * Form Engine - The core state machine for graph-based forms
 */
export declare class FormEngine {
    private schema;
    private state;
    private storage;
    private listeners;
    private options;
    constructor(options: FormEngineOptions);
    /**
     * Start the form engine
     */
    start(): Promise<void>;
    /**
     * Transition to the next state based on an event
     */
    transition(event: string, data?: any): Promise<void>;
    /**
     * Go back to the previous state
     */
    back(): Promise<void>;
    /**
     * Update context without transitioning
     */
    updateContext(data: Partial<FormContext>): Promise<void>;
    /**
     * Get current progress percentage
     */
    getProgress(): number;
    /**
     * Get current state
     */
    getCurrentState(): string;
    /**
     * Get current context
     */
    getContext(): FormContext;
    /**
     * Get possible next states
     */
    getPossibleNextStates(): string[];
    /**
     * Reset the form
     */
    reset(): Promise<void>;
    /**
     * Event emitter
     */
    on(event: string, callback: Function): void;
    /**
     * Remove event listener
     */
    off(event: string, callback: Function): void;
    /**
     * Emit event
     */
    private emit;
    /**
     * Get all possible paths from current state
     */
    getPossiblePaths(): string[][];
    /**
     * Check if we can go back
     */
    canGoBack(): boolean;
    /**
     * Get the full state (for debugging)
     */
    getState(): FormEngineState;
}
//# sourceMappingURL=engine.d.ts.map