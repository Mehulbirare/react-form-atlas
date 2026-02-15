import { get, set, del } from 'idb-keyval';
import type { FormEngineState } from './types';

/**
 * Storage adapter for persisting form state
 */
export class StorageAdapter {
    private storageKey: string;
    private useIndexedDB: boolean;

    constructor(storageKey: string = 'neuraform-state') {
        this.storageKey = storageKey;
        this.useIndexedDB = typeof indexedDB !== 'undefined';
    }

    async save(state: FormEngineState): Promise<void> {
        try {
            const serialized = JSON.stringify({
                ...state,
                completedSteps: Array.from(state.completedSteps)
            });

            if (this.useIndexedDB) {
                await set(this.storageKey, serialized);
            } else {
                localStorage.setItem(this.storageKey, serialized);
            }
        } catch (error) {
            console.error('Failed to save form state:', error);
            throw error;
        }
    }

    async load(): Promise<FormEngineState | null> {
        try {
            let serialized: string | undefined | null = null;

            if (this.useIndexedDB) {
                const result = await get<string>(this.storageKey);
                serialized = result;
            } else {
                serialized = localStorage.getItem(this.storageKey);
            }

            if (!serialized) return null;

            const parsed = JSON.parse(serialized);
            return {
                ...parsed,
                completedSteps: new Set(parsed.completedSteps)
            };
        } catch (error) {
            console.error('Failed to load form state:', error);
            return null;
        }
    }

    async clear(): Promise<void> {
        try {
            if (this.useIndexedDB) {
                await del(this.storageKey);
            } else {
                localStorage.removeItem(this.storageKey);
            }
        } catch (error) {
            console.error('Failed to clear form state:', error);
            throw error;
        }
    }
}
