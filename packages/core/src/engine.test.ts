import { describe, it, expect, beforeEach } from 'vitest';
import { FormEngine } from '../src/engine';
import type { FormSchema } from '../src/types';

describe('FormEngine', () => {
    let schema: FormSchema;
    let engine: FormEngine;

    beforeEach(() => {
        schema = {
            id: 'test-form',
            initial: 'step1',
            states: {
                step1: {
                    id: 'step1',
                    meta: { weight: 1 },
                    on: {
                        NEXT: 'step2',
                        SKIP: 'step3'
                    }
                },
                step2: {
                    id: 'step2',
                    meta: { weight: 2 },
                    on: { NEXT: 'step3' }
                },
                step3: {
                    id: 'step3',
                    meta: { weight: 1 }
                }
            }
        };

        engine = new FormEngine({ schema });
    });

    describe('initialization', () => {
        it('should initialize with the initial state', async () => {
            await engine.start();
            expect(engine.getCurrentState()).toBe('step1');
        });

        it('should initialize with empty context', async () => {
            await engine.start();
            expect(engine.getContext()).toEqual({});
        });
    });

    describe('transitions', () => {
        it('should transition to next state', async () => {
            await engine.start();
            await engine.transition('NEXT');
            expect(engine.getCurrentState()).toBe('step2');
        });

        it('should update context during transition', async () => {
            await engine.start();
            await engine.transition('NEXT', { name: 'John' });
            expect(engine.getContext()).toEqual({ name: 'John' });
        });

        it('should handle conditional transitions', async () => {
            await engine.start();
            await engine.transition('SKIP');
            expect(engine.getCurrentState()).toBe('step3');
        });

        it('should throw error for invalid transition', async () => {
            await engine.start();
            await expect(engine.transition('INVALID')).rejects.toThrow();
        });
    });

    describe('back navigation', () => {
        it('should go back to previous state', async () => {
            await engine.start();
            await engine.transition('NEXT');
            await engine.back();
            expect(engine.getCurrentState()).toBe('step1');
        });

        it('should throw error when no history', async () => {
            await engine.start();
            await expect(engine.back()).rejects.toThrow();
        });

        it('should report canGoBack correctly', async () => {
            await engine.start();
            expect(engine.canGoBack()).toBe(false);
            await engine.transition('NEXT');
            expect(engine.canGoBack()).toBe(true);
        });
    });

    describe('progress calculation', () => {
        it('should calculate progress correctly', async () => {
            await engine.start();
            expect(engine.getProgress()).toBe(0);

            await engine.transition('NEXT');
            expect(engine.getProgress()).toBeGreaterThan(0);

            await engine.transition('NEXT');
            expect(engine.getProgress()).toBeGreaterThan(25);
        });
    });

    describe('context management', () => {
        it('should update context without transitioning', async () => {
            await engine.start();
            await engine.updateContext({ email: 'test@example.com' });
            expect(engine.getContext()).toEqual({ email: 'test@example.com' });
            expect(engine.getCurrentState()).toBe('step1');
        });

        it('should merge context updates', async () => {
            await engine.start();
            await engine.updateContext({ name: 'John' });
            await engine.updateContext({ email: 'john@example.com' });
            expect(engine.getContext()).toEqual({
                name: 'John',
                email: 'john@example.com'
            });
        });
    });

    describe('events', () => {
        it('should emit stepChange event', async () => {
            await engine.start();

            let eventData: any;
            engine.on('stepChange', (data: any) => {
                eventData = data;
            });

            await engine.transition('NEXT');

            expect(eventData).toEqual({
                from: 'step1',
                to: 'step2',
                context: expect.any(Object)
            });
        });

        it('should emit complete event on final state', async () => {
            await engine.start();

            let completed = false;
            engine.on('complete', (data: any) => {
                completed = true;
            });

            await engine.transition('SKIP');
            expect(completed).toBe(true);
        });
    });

    describe('reset', () => {
        it('should reset to initial state', async () => {
            await engine.start();
            await engine.transition('NEXT', { name: 'John' });
            await engine.reset();

            expect(engine.getCurrentState()).toBe('step1');
            expect(engine.getContext()).toEqual({});
            expect(engine.canGoBack()).toBe(false);
        });
    });

    describe('possible paths', () => {
        it('should return possible next states', async () => {
            await engine.start();
            const nextStates = engine.getPossibleNextStates();
            expect(nextStates).toContain('step2');
            expect(nextStates).toContain('step3');
        });

        it('should return all possible paths', async () => {
            await engine.start();
            const paths = engine.getPossiblePaths();
            expect(paths.length).toBeGreaterThan(0);
            expect(paths[0]).toContain('step1');
        });
    });
});




