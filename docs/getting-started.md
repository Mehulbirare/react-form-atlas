# Getting Started with React Form

Welcome to React Form! This guide will help you get started with building graph-based forms that eliminate "condition hell."

## What You'll Build

By the end of this guide, you'll have a working multi-step form with:
- ✅ Branching logic based on user input
- ✅ Auto-save functionality
- ✅ Smart progress calculation
- ✅ Back navigation

## Installation

### For React Projects

```bash
npm install react-form-engine react-form-bridge
```

### For Vanilla JavaScript

```bash
npm install react-form-engine
```

## Your First Form

Let's build a simple onboarding flow with two paths: one for businesses and one for individuals.

### Step 1: Define Your Schema

Create a file called `schema.js`:

```javascript
export const onboardingSchema = {
  id: 'onboarding',
  initial: 'welcome',
  states: {
    welcome: {
      id: 'welcome',
      meta: { weight: 1 },
      on: { NEXT: 'userType' }
    },
    userType: {
      id: 'userType',
      meta: { weight: 2 },
      on: {
        SELECT_BUSINESS: 'businessDetails',
        SELECT_INDIVIDUAL: 'personalDetails'
      }
    },
    businessDetails: {
      id: 'businessDetails',
      meta: { weight: 3 },
      on: { NEXT: 'complete' }
    },
    personalDetails: {
      id: 'personalDetails',
      meta: { weight: 2 },
      on: { NEXT: 'complete' }
    },
    complete: {
      id: 'complete',
      meta: { weight: 1 }
    }
  }
};
```

### Step 2: Build Your Form (React)

```tsx
import { useReactForm } from 'react-form-bridge';
import { onboardingSchema } from './schema';

function OnboardingForm() {
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
    schema: onboardingSchema,
    autoSave: true,
    onComplete: (data) => {
      console.log('Form completed!', data);
      // Submit to your backend
    }
  });

  if (!isReady) return <div>Loading...</div>;

  return (
    <div className="form-container">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
        <span>{Math.round(progress)}% Complete</span>
      </div>

      {/* Step Content */}
      {currentState === 'welcome' && (
        <div>
          <h1>Welcome!</h1>
          <p>Let's get you set up in just a few steps.</p>
          <button onClick={() => transition('NEXT')}>
            Get Started
          </button>
        </div>
      )}

      {currentState === 'userType' && (
        <div>
          <h2>What type of account do you need?</h2>
          <button onClick={() => transition('SELECT_BUSINESS')}>
            Business Account
          </button>
          <button onClick={() => transition('SELECT_INDIVIDUAL')}>
            Individual Account
          </button>
        </div>
      )}

      {currentState === 'businessDetails' && (
        <div>
          <h2>Business Details</h2>
          <input
            type="text"
            placeholder="Company Name"
            onChange={(e) => updateContext({ companyName: e.target.value })}
          />
          <button onClick={() => transition('NEXT')}>
            Continue
          </button>
        </div>
      )}

      {currentState === 'personalDetails' && (
        <div>
          <h2>Personal Details</h2>
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => updateContext({ fullName: e.target.value })}
          />
          <button onClick={() => transition('NEXT')}>
            Continue
          </button>
        </div>
      )}

      {currentState === 'complete' && (
        <div>
          <h2>All Done! 🎉</h2>
          <p>Your account has been created.</p>
        </div>
      )}

      {/* Back Button */}
      {canGoBack && (
        <button onClick={back}>← Back</button>
      )}
    </div>
  );
}
```

### Step 3: Add Styling

```css
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 2rem;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

button {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin: 0.5rem;
}

button:hover {
  background: #5568d3;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 1rem;
}
```

## Understanding the Flow

1. **User starts at "welcome"** → Clicks "Get Started"
2. **Transitions to "userType"** → Selects account type
3. **Branches based on selection:**
   - Business → Goes to "businessDetails" (3 weight units)
   - Individual → Goes to "personalDetails" (2 weight units)
4. **Progress bar adjusts** based on chosen path
5. **Completes at "complete"** → Form data is submitted

## Key Concepts

### States
Each step in your form. Can have transitions, metadata, and validation.

### Transitions
Events that move users between states. Can be conditional.

### Context
Shared data store that accumulates as users progress.

### Weights
Determine progress calculation. Higher weight = more complex step.

## Next Steps

### Add Validation

```javascript
businessDetails: {
  id: 'businessDetails',
  meta: {
    weight: 3,
    validation: [
      { type: 'required', message: 'Company name is required' },
      { type: 'min', value: 3, message: 'Minimum 3 characters' }
    ]
  },
  on: { NEXT: 'complete' }
}
```

### Add Conditional Transitions

```javascript
ageCheck: {
  id: 'ageCheck',
  on: {
    NEXT: {
      target: 'adultForm',
      cond: (context) => context.age >= 18
    },
    NEXT_MINOR: {
      target: 'minorForm',
      cond: (context) => context.age < 18
    }
  }
}
```

### Visualize Your Schema

```bash
npx react-form-visualizer schema.json -o visualization.html
```

## Resources

- [Core Concepts](./core-concepts.md)
- [API Reference](./api-reference.md)
- [Examples](../examples)
- [Publishing Guide](./publishing.md)

## Need Help?

- 📖 [Documentation](../README.md)
- 💬 [GitHub Issues](https://github.com/yourusername/React Form/issues)
- 🐦 [Twitter](https://twitter.com/yourusername)

---

**Happy form building! 🎉**


