# 🧠 NeuraForm

**Eliminate "Condition Hell" in Complex Forms**

NeuraForm is a graph-based form engine that treats your form like a map (Directed Acyclic Graph), where the user is a traveler and NeuraForm is the GPS. Say goodbye to dozens of if/else statements in your onboarding flows, medical intake forms, or financial applications.

[![npm version](https://img.shields.io/npm/v/@neuraform/core.svg)](https://www.npmjs.com/package/@neuraform/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## 🎯 The Problem

Building branching multi-step forms requires massive amounts of boilerplate code to handle:
- ❌ Conditional routing (spaghetti if/else statements)
- ❌ State persistence across sessions
- ❌ Dynamic progress calculation
- ❌ Complex validation logic
- ❌ Accessibility concerns
- ❌ Analytics integration

**Result:** Unmaintainable "spaghetti code" that's impossible to test or modify.

## ✨ The Solution

NeuraForm decouples form logic from UI using a **Schema-First Graph** approach:

```typescript
const formGraph = {
  initial: 'welcome',
  states: {
    welcome: { on: { NEXT: 'userType' } },
    userType: {
      on: {
        SELECT_BUSINESS: 'businessDetails',
        SELECT_INDIVIDUAL: 'personalDetails'
      }
    },
    businessDetails: { on: { NEXT: 'taxInfo' } },
    personalDetails: { on: { NEXT: 'complete' } }
  }
}
```

**What happens:** If the user selects "Individual" instead of "Business", the "Tax Info" step is instantly removed from the timeline, and the progress bar adjusts automatically.

## 🚀 Key Features

### 1. **Dynamic Pathing**
Traditional forms use arrays: `[Step1, Step2, Step3]`  
NeuraForm uses a **Graph**: Steps adapt based on user input in real-time.

### 2. **Draft-Lock (Auto-Save)**
- Automatically syncs form state to IndexedDB/localStorage
- Users can close the browser and resume exactly where they left off
- Zero configuration required

### 3. **Predictive Validation**
Validates the entire path, not just individual fields. If a user enters data that makes a future step impossible, they're alerted immediately.

### 4. **Smart Progress Calculation**
Progress bar calculates based on the **remaining weight** of the path. If the user chooses a shorter path, the progress bar "jumps" forward visually.

### 5. **Accessibility Built-In**
- ARIA labels and focus management
- Keyboard navigation
- Screen reader optimized

### 6. **Analytics Ready**
Built-in hooks for tracking user drop-off points:
```typescript
onStepComplete: (step) => {
  analytics.track('Form Step Completed', { step });
}
```

## 📦 Packages

This is a monorepo containing:

| Package | Description | Version |
|---------|-------------|---------|
| [@neuraform/core](./packages/core) | Framework-agnostic form engine | ![npm](https://img.shields.io/npm/v/@neuraform/core) |
| [@neuraform/react](./packages/react) | React hooks and components | ![npm](https://img.shields.io/npm/v/@neuraform/react) |
| [@neuraform/visualizer](./packages/visualizer) | Visual form flow designer | ![npm](https://img.shields.io/npm/v/@neuraform/visualizer) |

## 🏁 Quick Start

### Installation

```bash
# For React projects
npm install @neuraform/core @neuraform/react

# For vanilla JS
npm install @neuraform/core
```

### Basic Usage (React)

```tsx
import { useNeuraForm } from '@neuraform/react';

function OnboardingFlow() {
  const { currentStep, next, back, progress } = useNeuraForm({
    schema: formGraph,
    autoSave: true,
    onComplete: (data) => console.log('Form completed!', data)
  });

  return (
    <div>
      <ProgressBar value={progress} />
      <StepRenderer step={currentStep} />
      <button onClick={back}>Back</button>
      <button onClick={next}>Next</button>
    </div>
  );
}
```

### Basic Usage (Vanilla JS)

```javascript
import { NeuraFormEngine } from '@neuraform/core';

const engine = new NeuraFormEngine({
  schema: formGraph,
  autoSave: true
});

engine.start();
engine.on('stepChange', (step) => {
  console.log('Current step:', step);
});
```

## 🎨 Visualizer

Paste your JSON schema and see a flowchart of your form:

```bash
npx @neuraform/visualizer
```

![Visualizer Demo](./assets/visualizer-demo.png)

## 📚 Documentation

- [Core Concepts](./docs/core-concepts.md)
- [API Reference](./docs/api-reference.md)
- [React Guide](./packages/react/README.md)
- [Examples](./examples)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md).

## 📄 License

MIT © [Your Name](https://github.com/yourusername)

## 🌟 Why NeuraForm?

| Traditional Forms | NeuraForm |
|-------------------|-----------|
| Array-based steps | Graph-based navigation |
| Manual if/else logic | Declarative schema |
| No auto-save | Built-in draft-lock |
| Manual progress calculation | Weighted path progress |
| Accessibility afterthought | A11y built-in |
| Custom analytics integration | Analytics hooks included |

---

**Built with ❤️ for developers who hate "condition hell"**
