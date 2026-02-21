import type { FormSchema } from './types';

/**
 * Calculate the total weight of a path through the form graph
 */
export class PathCalculator {
    /**
     * Calculate the total possible weight from current state to completion
     */
    static calculateRemainingWeight(
        currentState: string,
        schema: FormSchema,
        visited: Set<string> = new Set()
    ): number {
        if (visited.has(currentState)) {
            return 0; // Prevent infinite loops in cyclic graphs
        }

        visited.add(currentState);
        const state = schema.states[currentState];

        if (!state || !state.on) {
            return state?.meta?.weight || 1;
        }

        const currentWeight = state.meta?.weight || 1;
        const transitions = Object.values(state.on);

        if (transitions.length === 0) {
            return currentWeight;
        }

        // Calculate the maximum possible weight from this point
        const maxFutureWeight = Math.max(
            ...transitions.map(transition => {
                const target = typeof transition === 'string' ? transition : transition.target;
                return this.calculateRemainingWeight(target, schema, new Set(visited));
            })
        );

        return currentWeight + maxFutureWeight;
    }

    /**
     * Calculate progress percentage based on completed path weight
     */
    static calculateProgress(
        currentState: string,
        completedSteps: Set<string>,
        schema: FormSchema
    ): number {
        const totalWeight = this.calculateRemainingWeight(schema.initial, schema);

        let completedWeight = 0;
        for (const step of completedSteps) {
            const state = schema.states[step];
            completedWeight += state?.meta?.weight || 1;
        }

        return totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
    }

    /**
     * Get all possible paths from current state
     */
    static getPossiblePaths(
        currentState: string,
        schema: FormSchema,
        context: any = {}
    ): string[][] {
        const paths: string[][] = [];
        const visited = new Set<string>();

        const traverse = (state: string, currentPath: string[]) => {
            if (visited.has(state)) return;

            const stateConfig = schema.states[state];
            if (!stateConfig) return;

            const newPath = [...currentPath, state];

            if (!stateConfig.on || Object.keys(stateConfig.on).length === 0) {
                paths.push(newPath);
                return;
            }

            visited.add(state);

            for (const transition of Object.values(stateConfig.on)) {
                const target = typeof transition === 'string' ? transition : transition.target;

                // Check condition if it exists
                if (typeof transition === 'object' && transition.cond) {
                    if (!transition.cond(context)) continue;
                }

                traverse(target, newPath);
            }

            visited.delete(state);
        };

        traverse(currentState, []);
        return paths;
    }
}




