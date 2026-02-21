# Core Concepts

## What is React Form?

React Form is a **graph-based form engine** that treats your form as a Directed Acyclic Graph (DAG) instead of a linear array of steps. This fundamental shift eliminates "condition hell" and makes complex branching logic declarative and maintainable.

## Traditional Forms vs. React Form

### Traditional Approach
```javascript
// Traditional form with condition hell
const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
let currentStep = 0;

function nextStep() {
  if (currentStep === 0 && userType === 'business') {
    currentStep = 1; // Go to business details
  } else if (currentStep === 0 && userType === 'individual') {
    currentStep = 3; // Skip business details
  } else if (currentStep === 1 && hasEmployees) {
    currentStep = 2; // Show employee form
  } else if (currentStep === 1 && !hasEmployees) {
    currentStep = 3; // Skip employee form
  }
  // ... dozens more conditions
}
```

### React Form Approach
```javascript
// Declarative graph schema
const schema = {
  initial: 'welcome',
  states: {
    welcome: { on: { NEXT: 'userType' } },
    userType: {
      on: {
        SELECT_BUSINESS: 'businessDetails',
        SELECT_INDIVIDUAL: 'personalDetails'
      }
    },
    businessDetails: {
      on: {
        HAS_EMPLOYEES: 'employeeForm',
        NO_EMPLOYEES: 'complete'
      }
    }
  }
};
```

## Key Concepts

### 1. States
Each step in your form is a **state**. States can have:
- **Transitions**: Paths to other states
- **Metadata**: Weight, validation rules, custom data
- **Conditions**: Logic for conditional transitions

```typescript
{
  "userType": {
    "id": "userType",
    "meta": {
      "weight": 2,
      "validation": [
        { "type": "required", "message": "Please select a type" }
      ]
    },
    "on": {
      "SELECT_BUSINESS": "businessDetails",
      "SELECT_INDIVIDUAL": "personalDetails"
    }
  }
}
```

### 2. Transitions
Transitions define how users move between states. They can be:

**Simple (string)**:
```typescript
"on": {
  "NEXT": "nextStep"
}
```

**Conditional (object)**:
```typescript
"on": {
  "NEXT": {
    "target": "nextStep",
    "cond": (context) => context.age >= 18
  }
}
```

### 3. Context
The **context** is the shared data store for your form. It accumulates data as users progress:

```typescript
{
  userType: 'business',
  businessDetails: {
    companyName: 'Acme Corp',
    industry: 'Technology'
  },
  taxInfo: {
    taxId: '12-3456789'
  }
}
```

### 4. Dynamic Pathing
Unlike traditional forms where all steps are predetermined, React Form calculates the path **dynamically** based on user input.

**Example**: If a user selects "Individual" instead of "Business", the "Tax Info" step is automatically removed from their journey.

### 5. Weighted Progress
Each state can have a **weight** that represents its complexity or importance. The progress bar calculates based on the **remaining weight** of the chosen path.

```typescript
{
  "welcome": { "meta": { "weight": 1 } },
  "businessDetails": { "meta": { "weight": 3 } },  // More complex
  "personalDetails": { "meta": { "weight": 2 } }
}
```

If a user chooses the "Individual" path (weight 2) instead of "Business" (weight 3), the progress bar adjusts to show they're closer to completion.

### 6. Draft-Lock (Auto-Save)
React Form automatically persists state to **IndexedDB** (with localStorage fallback). Users can:
- Close the browser and resume later
- Refresh the page without losing progress
- Switch devices (if you sync to a backend)

### 7. Predictive Validation
Instead of validating only on submit, React Form validates the **entire path**. If a user enters data that makes a future step impossible, they're alerted immediately.

**Example**: If a user enters a birth date that makes them under 18, and a future step requires 18+, they're warned before wasting time on intermediate steps.

## Architecture

```
┌─────────────────────────────────────────┐
│         Your Application                │
│  (React, Vue, Vanilla JS, etc.)         │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       react-form-bridge (optional)       │
│         useReactForm() hook             │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│          react-form-engine                │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   FormEngine               │   │
│  │   (State Machine)               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────┐  │
│  │ Storage  │  │Validator │  │ Path │  │
│  │ Adapter  │  │          │  │ Calc │  │
│  └──────────┘  └──────────┘  └──────┘  │
└─────────────────────────────────────────┘
```

## When to Use React Form

✅ **Perfect for:**
- Multi-step onboarding flows
- Medical intake forms with branching logic
- Financial applications (loan applications, tax forms)
- Surveys with conditional questions
- Wizards with complex dependencies

❌ **Not ideal for:**
- Simple single-page forms
- Forms with no conditional logic
- Forms that don't need state persistence

## Next Steps

- [API Reference](./api-reference.md)
- [React Guide](../packages/react/README.md)
- [Examples](../examples)


