import type { FormContext, ValidationRule, ValidationResult } from './types';
/**
 * Validator for form fields and paths
 */
export declare class Validator {
    /**
     * Validate a single field value
     */
    static validateField(value: any, rules: ValidationRule[], context: FormContext): ValidationResult;
    /**
     * Predictive validation: Check if the current path is still valid
     * This prevents users from entering data that makes future steps impossible
     */
    static validatePath(currentState: string, context: FormContext, schema: any): ValidationResult;
}
//# sourceMappingURL=validator.d.ts.map