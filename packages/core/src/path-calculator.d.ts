import type { FormSchema } from './types';
/**
 * Calculate the total weight of a path through the form graph
 */
export declare class PathCalculator {
    /**
     * Calculate the total possible weight from current state to completion
     */
    static calculateRemainingWeight(currentState: string, schema: FormSchema, visited?: Set<string>): number;
    /**
     * Calculate progress percentage based on completed path weight
     */
    static calculateProgress(currentState: string, completedSteps: Set<string>, schema: FormSchema): number;
    /**
     * Get all possible paths from current state
     */
    static getPossiblePaths(currentState: string, schema: FormSchema, context?: any): string[][];
}
//# sourceMappingURL=path-calculator.d.ts.map