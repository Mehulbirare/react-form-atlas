import type { FormContext, ValidationRule, ValidationResult } from './types';

/**
 * Validator for form fields and paths
 */
export class Validator {
    /**
     * Validate a single field value
     */
    static validateField(value: any, rules: ValidationRule[], context: FormContext): ValidationResult {
        const errors: string[] = [];

        for (const rule of rules) {
            switch (rule.type) {
                case 'required':
                    if (value === undefined || value === null || value === '') {
                        errors.push(rule.message);
                    }
                    break;

                case 'email':
                    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        errors.push(rule.message);
                    }
                    break;

                case 'min':
                    if (typeof value === 'number' && value < rule.value) {
                        errors.push(rule.message);
                    } else if (typeof value === 'string' && value.length < rule.value) {
                        errors.push(rule.message);
                    }
                    break;

                case 'max':
                    if (typeof value === 'number' && value > rule.value) {
                        errors.push(rule.message);
                    } else if (typeof value === 'string' && value.length > rule.value) {
                        errors.push(rule.message);
                    }
                    break;

                case 'pattern':
                    if (value && !new RegExp(rule.value).test(value)) {
                        errors.push(rule.message);
                    }
                    break;

                case 'custom':
                    if (rule.validator && !rule.validator(value, context)) {
                        errors.push(rule.message);
                    }
                    break;
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Predictive validation: Check if the current path is still valid
     * This prevents users from entering data that makes future steps impossible
     */
    static validatePath(
        currentState: string,
        context: FormContext,
        schema: any
    ): ValidationResult {
        const errors: string[] = [];

        // Check if any future required fields are now impossible to satisfy
        // This is a simplified version - real implementation would traverse the graph
        const state = schema.states[currentState];

        if (state?.meta?.validation) {
            const result = this.validateField(
                context[currentState],
                state.meta.validation,
                context
            );
            errors.push(...result.errors);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
