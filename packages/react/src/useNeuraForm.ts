import { useState, useEffect, useCallback, useRef } from 'react';
import { NeuraFormEngine } from '@neuraform/core';
import type { FormEngineOptions, FormContext, StepChangeEvent } from '@neuraform/core';

export interface UseNeuraFormOptions extends FormEngineOptions {
    resume?: boolean;
}

export interface UseNeuraFormReturn {
    currentState: string;
    context: FormContext;
    progress: number;
    canGoBack: boolean;
    possibleNextStates: string[];
    transition: (event: string, data?: any) => Promise<void>;
    back: () => Promise<void>;
    updateContext: (data: Partial<FormContext>) => Promise<void>;
    reset: () => Promise<void>;
    engine: NeuraFormEngine;
    isReady: boolean;
}

/**
 * React hook for NeuraForm
 * 
 * @example
 * ```tsx
 * const { currentState, next, back, progress } = useNeuraForm({
 *   schema: formGraph,
 *   autoSave: true,
 *   onComplete: (data) => console.log('Done!', data)
 * });
 * ```
 */
export function useNeuraForm(options: UseNeuraFormOptions): UseNeuraFormReturn {
    const engineRef = useRef<NeuraFormEngine | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [currentState, setCurrentState] = useState('');
    const [context, setContext] = useState<FormContext>({});
    const [progress, setProgress] = useState(0);
    const [canGoBack, setCanGoBack] = useState(false);
    const [possibleNextStates, setPossibleNextStates] = useState<string[]>([]);

    // Extract schema ID for dependency tracking
    const schemaId = options.schema.id;

    // Initialize engine
    useEffect(() => {
        const engine = new NeuraFormEngine(options);
        engineRef.current = engine;

        // Set up event listeners
        const handleStepChange = (event: StepChangeEvent) => {
            setCurrentState(event.to);
            setContext(engine.getContext());
            setProgress(engine.getProgress());
            setCanGoBack(engine.canGoBack());
            setPossibleNextStates(engine.getPossibleNextStates());
        };

        const handleContextUpdate = () => {
            setContext(engine.getContext());
        };

        const handleReset = () => {
            setCurrentState(engine.getCurrentState());
            setContext(engine.getContext());
            setProgress(0);
            setCanGoBack(false);
            setPossibleNextStates(engine.getPossibleNextStates());
        };

        engine.on('stepChange', handleStepChange);
        engine.on('contextUpdate', handleContextUpdate);
        engine.on('reset', handleReset);

        // Start the engine
        engine.start().then(() => {
            setCurrentState(engine.getCurrentState());
            setContext(engine.getContext());
            setProgress(engine.getProgress());
            setCanGoBack(engine.canGoBack());
            setPossibleNextStates(engine.getPossibleNextStates());
            setIsReady(true);
        });

        return () => {
            engine.off('stepChange', handleStepChange);
            engine.off('contextUpdate', handleContextUpdate);
            engine.off('reset', handleReset);
        };
    }, [schemaId]); // Only recreate if schema ID changes

    const transition = useCallback(async (event: string, data?: any) => {
        if (engineRef.current) {
            await engineRef.current.transition(event, data);
        }
    }, []);

    const back = useCallback(async () => {
        if (engineRef.current) {
            await engineRef.current.back();
        }
    }, []);

    const updateContext = useCallback(async (data: Partial<FormContext>) => {
        if (engineRef.current) {
            await engineRef.current.updateContext(data);
        }
    }, []);

    const reset = useCallback(async () => {
        if (engineRef.current) {
            await engineRef.current.reset();
        }
    }, []);

    return {
        currentState,
        context,
        progress,
        canGoBack,
        possibleNextStates,
        transition,
        back,
        updateContext,
        reset,
        engine: engineRef.current!,
        isReady
    };
}
