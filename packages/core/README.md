# @neuraform/core

Framework-agnostic graph-based form engine that eliminates "condition hell" in complex multi-step forms.

## Installation

```bash
npm install @neuraform/core
```

## Quick Start

```javascript
import { NeuraFormEngine } from '@neuraform/core';

const schema = {
  id: 'my-form',
  initial: 'welcome',
  states: {
    welcome: {
      id: 'welcome',
      on: { NEXT: 'userType' }
    },
    userType: {
      id: 'userType',
      on: {
        SELECT_BUSINESS: 'businessDetails',
        SELECT_INDIVIDUAL: 'personalDetails'
      }
    },
    businessDetails: {
      id: 'businessDetails',
      on: { NEXT: 'complete' }
    },
    personalDetails: {
      id: 'personalDetails',
      on: { NEXT: 'complete' }
    },
    complete: {
      id: 'complete'
    }
  }
};

const engine = new NeuraFormEngine({
  schema,
  autoSave: true,
  onComplete: (data) => {
    console.log('Form completed!', data);
  }
});

await engine.start();

// Transition between states
await engine.transition('NEXT');
await engine.transition('SELECT_BUSINESS', { userType: 'business' });

// Get progress
const progress = engine.getProgress(); // 0-100

// Go back
await engine.back();
```

## Features

- 🧠 **Graph-Based Navigation**: Define your form as a DAG, not a linear array
- 💾 **Auto-Save**: Automatic state persistence with IndexedDB/localStorage
- ✅ **Predictive Validation**: Validate entire paths, not just individual fields
- 📊 **Smart Progress**: Weight-based progress calculation
- 🎯 **Type-Safe**: Full TypeScript support
- 🔌 **Framework-Agnostic**: Works with any JavaScript framework

## Documentation

- [Core Concepts](../../docs/core-concepts.md)
- [API Reference](../../docs/api-reference.md)
- [Examples](../../examples)

## License

MIT
