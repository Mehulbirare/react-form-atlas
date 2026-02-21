# react-form-bridge

[![npm version](https://img.shields.io/npm/v/react-form-bridge.svg?style=flat-square)](https://www.npmjs.com/package/react-form-bridge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Official React Hooks for React Form.** Build complex branching forms with simple hooks.

## 📦 Installation

```bash
npm install react-form-engine react-form-bridge
```

## ⚡ Quick Start

[![Try on StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vitejs-vite-react-ts?file=src%2FApp.tsx&dependencies=react-form-bridge,react-form-engine)

```tsx
import { useReactForm } from 'react-form-bridge';

// Define your map
const schema = {
  initial: 'welcome',
  states: {
    welcome: { on: { NEXT: 'details' } },
    details: { on: { SUBMIT: 'success' } },
    success: { type: 'final' }
  }
};

export default function MyForm() {
  const { 
    currentStep, // Current node ID (e.g., 'welcome')
    transition,  // Function to move to next node
    back,        // Function to go back
    progress,    // 0-100%
    isReady      // true when engine is initialized
  } = useReactForm({
    schema,
    autoSave: true
  });

  if (!isReady) return <p>Loading...</p>;

  return (
    <div className="p-4">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded">
        <div 
          className="h-full bg-blue-500 transition-all duration-300" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Render Steps */}
      {currentStep === 'welcome' && (
        <StepOne onNext={() => transition('NEXT')} />
      )}
      
      {currentStep === 'details' && (
        <StepTwo onSubmit={() => transition('SUBMIT')} />
      )}

      {currentStep === 'success' && <h1>🎉 Done!</h1>}

      {/* Back Button */}
      <button onClick={back} disabled={progress === 0}>
        Back
      </button>
    </div>
  );
}
```

## 📚 API Reference

### `useReactForm(options)`

#### Options
| Option | Type | Description |
| :--- | :--- | :--- |
| `schema` | `object` | **Required.** The graph definition. |
| `autoSave` | `boolean` | Enable IndexedDB persistence (Default: `false`). |
| `storageKey` | `string` | Unique key for storage (Default: `'React Form'`). |
| `onComplete` | `func` | Callback when a final state is reached. |

#### Returns
| Value | Type | Description |
| :--- | :--- | :--- |
| `currentStep` | `string` | ID of the current active node. |
| `transition` | `func` | `(event: string, payload?: any) => void` |
| `back` | `func` | Go to the previous step. |
| `progress` | `number` | Calculated completion (0-100). |
| `context` | `object` | The collected form data so far. |
| `updateContext` | `func` | Manually update form data. |

## 📄 License

MIT © [Mehul Birare](https://github.com/Mehulbirare)
```tsx
import { useReactForm } from 'react-form-bridge';
import type { FormSchema } from 'react-form-engine';

const schema: FormSchema = {
  id: 'onboarding',
  initial: 'welcome',
  states: {
    welcome: { id: 'welcome', on: { NEXT: 'userType' } },
    userType: {
      id: 'userType',
      on: {
        SELECT_BUSINESS: 'businessDetails',
        SELECT_INDIVIDUAL: 'personalDetails'
      }
    },
    businessDetails: { id: 'businessDetails', on: { NEXT: 'complete' } },
    personalDetails: { id: 'personalDetails', on: { NEXT: 'complete' } },
    complete: { id: 'complete' }
  }
};

function MyForm() {
  const {
    currentState,
    context,
    progress,
    canGoBack,
    transition,
    back,
    updateContext,
    isReady
  } = useReactForm({
    schema,
    autoSave: true,
    onComplete: (data) => {
      console.log('Form completed!', data);
    }
  });

  if (!isReady) return <div>Loading...</div>;

  return (
    <div>
      {/* Progress Bar */}
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} />
      </div>

      {/* Step Content */}
      {currentState === 'welcome' && (
        <div>
          <h1>Welcome!</h1>
          <button onClick={() => transition('NEXT')}>
            Get Started
          </button>
        </div>
      )}

      {currentState === 'userType' && (
        <div>
          <h2>Select Account Type</h2>
          <button onClick={() => transition('SELECT_BUSINESS')}>
            Business
          </button>
          <button onClick={() => transition('SELECT_INDIVIDUAL')}>
            Individual
          </button>
        </div>
      )}

      {/* Navigation */}
      {canGoBack && (
        <button onClick={back}>Back</button>
      )}
    </div>
  );
}
```

## Features

- ⚛️ **React Hooks**: Clean, idiomatic React API
- 🔄 **Auto-Updates**: Component re-renders on state changes
- 💾 **Auto-Save**: Built-in state persistence
- 📊 **Progress Tracking**: Real-time progress updates
- 🎯 **TypeScript**: Full type safety

## API

### useReactForm(options)

**Options:**
- `schema: FormSchema` - Form schema (required)
- `autoSave?: boolean` - Enable auto-save
- `storageKey?: string` - Custom storage key
- `onStepChange?: (event) => void` - Step change callback
- `onComplete?: (context) => void` - Completion callback
- `onError?: (error) => void` - Error callback

**Returns:**
- `currentState: string` - Current state ID
- `context: FormContext` - Current form data
- `progress: number` - Progress percentage (0-100)
- `canGoBack: boolean` - Whether back navigation is available
- `possibleNextStates: string[]` - Possible next states
- `transition: (event, data?) => Promise<void>` - Transition function
- `back: () => Promise<void>` - Go back function
- `updateContext: (data) => Promise<void>` - Update context
- `reset: () => Promise<void>` - Reset form
- `engine: FormEngine` - Access to engine instance
- `isReady: boolean` - Whether engine is initialized

## Examples

See the [examples directory](../../examples) for complete implementations.

## License

MIT




