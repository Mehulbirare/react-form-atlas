# @neuraform/visualizer

[![npm version](https://img.shields.io/npm/v/@neuraform/visualizer.svg?style=flat-square)](https://www.npmjs.com/package/@neuraform/visualizer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**See Your Form Logic.** Generate beautiful flowcharts and insightful statistics from your NeuraForm schemas.

## 📦 Installation

```bash
# Install globally
npm install -g @neuraform/visualizer

# Or run directly with npx
npx @neuraform/visualizer my-schema.json
```

## ⚡ Quick Start

1.  **Paste your schema** into our live playground (Coming Soon) or use the CLI:

    ```bash
    npx @neuraform/visualizer ./examples/onboarding-schema.json -o flow.html
    ```

2.  **Open `flow.html`** in your browser. You'll see an interactive graph like this:

    [![Mermaid Chart](https://mermaid.ink/img/pako:eNpVkMtqw0AMRX9FaNW2QJ5tCiEkL9qQhSy6q7E9Y8-I5ZGUhgT_vXJcAi3W4s49V9KdkNEKqchflfK64Slg67hvebo8PcyfT_Onh_n2-vYyX82f5-v59jJ_u5jP91c4o8t9w51SyrH8P6_4-YF_j7j8x-uGz4xWfFzxtuIjo4K_V_zKSMX3O64Yqfi-4oqRim8rrrR6h1Lo8229q1d-U-9YCtW09a5e1Wv1jqVQ9VvvanWv1TuWQjW19a5ed6_VO5ZCVbX1rl6r1-odS6GKWu_q9eZaq3cshSpqvavXzav1jqVQXeter943r9U7lkJ13npXrzdv1TuWQlXNetcf2Vb7_QHaumc3?type=png)](https://mermaid.live/edit#pako:eNpVkMtqw0AMRX9FaNW2QJ5tCiEkL9qQhSy6q7E9Y8-I5ZGUhgT_vXJcAi3W4s49V9KdkNEKqchflfK64Slg67hvebo8PcyfT_Onh_n2-vYyX82f5-v59jJ_u5jP91c4o8t9w51SyrH8P6_4-YF_j7j8x-uGz4xWfFzxtuIjo4K_V_zKSMX3O64Yqfi-4oqRim8rrrR6h1Lo8229q1d-U-9YCtW09a5e1Wv1jqVQ9VvvanWv1TuWQjW19a5ed6_VO5ZCVbX1rl6r1-odS6GKWu_q9eZaq3cshSpqvavXzav1jqVQXeter943r9U7lkJ13npXrzdv1TuWQlXNetcf2Vb7_QHaumc3)

## 🖥️ CLI Usage

```bash
neuraform-visualizer <schema-file> [options]

# Options:
# -o, --output <file>    Output HTML file (Default: schema-visualization.html)
# -h, --help            Show help
```

## 🛠️ Programmatic API

```javascript
import { SchemaVisualizer } from '@neuraform/visualizer';
import schema from './onboarding.json';

// Get Mermaid Diagram String
const diagram = SchemaVisualizer.toMermaid(schema);
console.log(diagram);
// Output: graph TD; A-->B; ...

// Get Complexity Stats
const stats = SchemaVisualizer.getStats(schema);
console.log(stats);
/*
{
  totalStates: 15,
  maxBranching: 4,
  cyclomaticComplexity: 3
}
*/
```

## 📄 License

MIT © [Mehul Birare](https://github.com/Mehulbirare)
