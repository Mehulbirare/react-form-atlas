import { describe, it, expect } from 'vitest';
import { SchemaVisualizer } from './visualizer';
import type { FormSchema } from 'react-form-atlas-engine';

describe('SchemaVisualizer.toHTML', () => {
    it('should escape HTML in schema values to prevent injection', () => {
        const malicious = '</pre><script>window.__pwned=1</script>';
        const schema: FormSchema = {
            id: malicious,
            initial: malicious,
            states: {
                [malicious]: {
                    id: malicious,
                    on: { NEXT: 'done' }
                },
                done: { id: 'done' }
            }
        };

        const html = SchemaVisualizer.toHTML(schema);

        // The raw, unescaped payload must never appear in the output.
        expect(html).not.toContain('<script>window.__pwned=1</script>');
        // It should be present in escaped form instead.
        expect(html).toContain('&lt;script&gt;');
    });

    it('should still render normal schema content', () => {
        const schema: FormSchema = {
            id: 'checkout',
            initial: 'cart',
            states: {
                cart: { id: 'cart', on: { NEXT: 'payment' } },
                payment: { id: 'payment' }
            }
        };

        const html = SchemaVisualizer.toHTML(schema);
        expect(html).toContain('Schema: checkout');
        expect(html).toContain('cart');
        expect(html).toContain('payment');
    });
});
