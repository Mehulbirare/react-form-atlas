/**
 * Core types for React Form
 */
export type TransitionEvent = string;
export interface FormState {
    id: string;
    on?: Record<TransitionEvent, string | ConditionalTransition>;
    meta?: {
        weight?: number;
        validation?: ValidationRule[];
        [key: string]: any;
    };
}
export interface ConditionalTransition {
    target: string;
    cond?: (context: FormContext) => boolean;
}
export interface FormSchema {
    id: string;
    initial: string;
    states: Record<string, FormState>;
    context?: Record<string, any>;
}
export interface FormContext {
    [key: string]: any;
}
export interface ValidationRule {
    type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
    message: string;
    value?: any;
    validator?: (value: any, context: FormContext) => boolean;
}
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}
export interface StepChangeEvent {
    from: string;
    to: string;
    context: FormContext;
}
export interface FormEngineOptions {
    schema: FormSchema;
    autoSave?: boolean;
    storageKey?: string;
    onStepChange?: (event: StepChangeEvent) => void;
    onComplete?: (context: FormContext) => void;
    onError?: (error: Error) => void;
}
export interface FormEngineState {
    currentState: string;
    context: FormContext;
    history: string[];
    completedSteps: Set<string>;
}
//# sourceMappingURL=types.d.ts.map