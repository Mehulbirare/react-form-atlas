# @neuraform/visualizer

Visual form flow designer for NeuraForm schemas. Generate beautiful flowcharts from your form schemas.

## Installation

```bash
npm install -g @neuraform/visualizer
```

Or use with npx:

```bash
npx @neuraform/visualizer schema.json
```

## CLI Usage

```bash
neuraform-visualizer <schema-file> [options]

Options:
  -o, --output <file>    Output HTML file (default: schema-visualization.html)
  -h, --help            Show help message

Examples:
  neuraform-visualizer schema.json
  neuraform-visualizer schema.json -o my-form.html
```

## Programmatic Usage

```javascript
import { SchemaVisualizer } from '@neuraform/visualizer';
import schema from './my-schema.json';

// Generate Mermaid diagram
const mermaid = SchemaVisualizer.toMermaid(schema);
console.log(mermaid);

// Generate HTML visualization
const html = SchemaVisualizer.toHTML(schema);

// Get statistics
const stats = SchemaVisualizer.getStats(schema);
console.log(stats);
// {
//   totalStates: 7,
//   totalTransitions: 8,
//   finalStates: 1,
//   averageBranchingFactor: 1.33
// }
```

## Output Example

The visualizer generates an interactive HTML page with:
- 📊 **Flowchart**: Visual representation of your form flow
- 📈 **Statistics**: Total states, transitions, and branching factor
- 🎨 **Beautiful Design**: Premium, modern UI
- 🔍 **Interactive**: Pan and zoom the diagram

## Features

- 🎨 **Beautiful Visualizations**: Premium design with gradients and shadows
- 📊 **Mermaid Diagrams**: Industry-standard flowchart syntax
- 📈 **Statistics**: Analyze your form complexity
- 🌐 **Standalone HTML**: No external dependencies needed
- 🎯 **Type-Safe**: Full TypeScript support

## License

MIT
