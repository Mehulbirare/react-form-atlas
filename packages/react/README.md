# @neuraform/react

React hooks and components for NeuraForm.

## Installation

```bash
npm install @neuraform/core @neuraform/react
```

## Quick Start

```tsx
import { useNeuraForm } from '@neuraform/react';
import type { FormSchema } from '@neuraform/core';

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
  } = useNeuraForm({
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

### useNeuraForm(options)

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
- `engine: NeuraFormEngine` - Access to engine instance
- `isReady: boolean` - Whether engine is initialized

## Examples

See the [examples directory](../../examples) for complete implementations.

## License

MIT
