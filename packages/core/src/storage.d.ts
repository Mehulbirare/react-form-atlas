import type { FormEngineState } from './types';
/**
 * Storage adapter for persisting form state
 */
export declare class StorageAdapter {
    private storageKey;
    private useIndexedDB;
    constructor(storageKey?: string);
    save(state: FormEngineState): Promise<void>;
    load(): Promise<FormEngineState | null>;
    clear(): Promise<void>;
}
//# sourceMappingURL=storage.d.ts.map