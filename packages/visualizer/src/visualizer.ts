import type { FormSchema } from '@neuraform/core';

/**
 * Generate a Mermaid flowchart from a NeuraForm schema
 */
export class SchemaVisualizer {
    /**
     * Convert schema to Mermaid diagram syntax
     */
    static toMermaid(schema: FormSchema): string {
        const lines: string[] = ['graph TD'];

        // Add initial state marker
        lines.push(`    Start([Start]) --> ${schema.initial}`);

        // Process each state
        for (const [stateId, stateConfig] of Object.entries(schema.states)) {
            const state = stateConfig as typeof schema.states[string];
            // Determine node shape based on whether it's a final state
            const isFinal = !state.on || Object.keys(state.on).length === 0;
            const nodeShape = isFinal
                ? `${stateId}([${stateId}])`
                : `${stateId}[${stateId}]`;

            if (!state.on) continue;

            // Add transitions
            for (const [event, transitionConfig] of Object.entries(state.on)) {
                const transition = transitionConfig as string | { target: string; cond?: any };
                const target = typeof transition === 'string' ? transition : transition.target;
                const label = event.replace(/_/g, ' ');
                lines.push(`    ${stateId} -->|${label}| ${target}`);
            }
        }

        return lines.join('\n');
    }

    /**
     * Generate an HTML page with the visualized schema
     */
    static toHTML(schema: FormSchema): string {
        const mermaid = this.toMermaid(schema);

        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeuraForm Schema Visualizer</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }

    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 2rem;
      max-width: 1200px;
      width: 100%;
    }

    h1 {
      color: #667eea;
      margin-bottom: 1rem;
      font-size: 2rem;
    }

    .schema-info {
      background: #f7fafc;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border-left: 4px solid #667eea;
    }

    .schema-info h2 {
      font-size: 1rem;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .schema-info p {
      color: #4a5568;
      font-size: 0.875rem;
    }

    #diagram {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      overflow-x: auto;
    }

    .legend {
      margin-top: 2rem;
      padding: 1rem;
      background: #f7fafc;
      border-radius: 8px;
    }

    .legend h3 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      color: #2d3748;
    }

    .legend-item {
      display: flex;
      align-items: center;
      margin: 0.5rem 0;
      font-size: 0.875rem;
      color: #4a5568;
    }

    .legend-icon {
      width: 40px;
      height: 24px;
      margin-right: 0.5rem;
      border: 2px solid #667eea;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }

    .legend-icon.rounded {
      border-radius: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧠 NeuraForm Schema Visualizer</h1>
    
    <div class="schema-info">
      <h2>Schema: ${schema.id}</h2>
      <p>Initial State: <strong>${schema.initial}</strong></p>
      <p>Total States: <strong>${Object.keys(schema.states).length}</strong></p>
    </div>

    <div id="diagram">
      <pre class="mermaid">
${mermaid}
      </pre>
    </div>

    <div class="legend">
      <h3>Legend</h3>
      <div class="legend-item">
        <div class="legend-icon">□</div>
        <span>Intermediate State</span>
      </div>
      <div class="legend-item">
        <div class="legend-icon rounded">()</div>
        <span>Final State</span>
      </div>
    </div>
  </div>

  <script>
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      flowchart: {
        curve: 'basis',
        padding: 20
      }
    });
  </script>
</body>
</html>`;
    }

    /**
     * Generate statistics about the schema
     */
    static getStats(schema: FormSchema): {
        totalStates: number;
        totalTransitions: number;
        finalStates: number;
        averageBranchingFactor: number;
    } {
        const states = Object.values(schema.states);
        const totalStates = states.length;

        let totalTransitions = 0;
        let finalStates = 0;

        for (const stateConfig of states) {
            const state = stateConfig as typeof schema.states[string];
            if (!state.on || Object.keys(state.on).length === 0) {
                finalStates++;
            } else {
                totalTransitions += Object.keys(state.on).length;
            }
        }

        const averageBranchingFactor = totalStates > 0
            ? totalTransitions / (totalStates - finalStates || 1)
            : 0;

        return {
            totalStates,
            totalTransitions,
            finalStates,
            averageBranchingFactor: Math.round(averageBranchingFactor * 100) / 100
        };
    }
}
