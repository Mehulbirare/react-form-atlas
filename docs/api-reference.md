# API Reference

## react-form-atlas-engine

### FormEngine

The main engine class that manages form state and transitions.

#### Constructor

```typescript
new FormEngine(options: FormEngineOptions)
```

**Options:**
- `schema: FormSchema` - The form schema (required)
- `autoSave?: boolean` - Enable auto-save (default: false)
- `storageKey?: string` - Custom storage key (default: 'React Form Atlas-state')
- `onStepChange?: (event: StepChangeEvent) => void` - Step change callback
- `onComplete?: (context: FormContext) => void` - Completion callback
- `onError?: (error: Error) => void` - Error callback

#### Methods

##### `start(): Promise<void>`
Start the engine and load saved state if available.

```typescript
const engine = new FormEngine({ schema });
await engine.start();
```

##### `transition(event: string, data?: any): Promise<void>`
Transition to the next state based on an event.

```typescript
await engine.transition('NEXT', { userType: 'business' });
```

##### `back(): Promise<void>`
Go back to the previous state.

```typescript
await engine.back();
```

##### `updateContext(data: Partial<FormContext>): Promise<void>`
Update context without transitioning.

```typescript
await engine.updateContext({ email: 'user@example.com' });
```

##### `getProgress(): number`
Get current progress percentage (0-100).

```typescript
const progress = engine.getProgress(); // 45.5
```

##### `getCurrentState(): string`
Get the current state ID.

```typescript
const state = engine.getCurrentState(); // 'userType'
```

##### `getContext(): FormContext`
Get a copy of the current context.

```typescript
const context = engine.getContext();
```

##### `getPossibleNextStates(): string[]`
Get all possible next states from current state.

```typescript
const nextStates = engine.getPossibleNextStates(); // ['businessDetails', 'personalDetails']
```

##### `getPossiblePaths(): string[][]`
Get all possible paths from current state to completion.

```typescript
const paths = engine.getPossiblePaths();
// [
//   ['userType', 'businessDetails', 'taxInfo', 'complete'],
//   ['userType', 'personalDetails', 'complete']
// ]
```

##### `canGoBack(): boolean`
Check if back navigation is available.

```typescript
if (engine.canGoBack()) {
  await engine.back();
}
```

##### `reset(): Promise<void>`
Reset the form to initial state.

```typescript
await engine.reset();
```

##### `on(event: string, callback: Function): void`
Subscribe to events.

**Events:**
- `started` - Engine started
- `resumed` - State resumed from storage
- `stepChange` - State changed
- `contextUpdate` - Context updated
- `validationError` - Validation failed
- `complete` - Form completed
- `reset` - Form reset

```typescript
engine.on('stepChange', (event) => {
  console.log(`Moved from ${event.from} to ${event.to}`);
});
```

##### `off(event: string, callback: Function): void`
Unsubscribe from events.

```typescript
engine.off('stepChange', myCallback);
```

---

### Types

#### FormSchema

```typescript
interface FormSchema {
  id: string;
  initial: string;
  states: Record<string, FormState>;
  context?: Record<string, any>;
}
```

#### FormState

```typescript
interface FormState {
  id: string;
  on?: Record<string, string | ConditionalTransition>;
  meta?: {
    weight?: number;
    validation?: ValidationRule[];
    [key: string]: any;
  };
}
```

#### ConditionalTransition

```typescript
interface ConditionalTransition {
  target: string;
  cond?: (context: FormContext) => boolean;
}
```

#### ValidationRule

```typescript
interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  message: string;
  value?: any;
  validator?: (value: any, context: FormContext) => boolean;
}
```

---

## react-form-atlas

### useReactForm

React hook for React Form Atlas.

```typescript
function useReactForm(options: useReactFormOptions): useReactFormReturn
```

**Options:** Same as `FormEngineOptions` plus:
- `resume?: boolean` - Resume from saved state (default: true)

**Returns:**
```typescript
interface useReactFormReturn {
  currentState: string;
  context: FormContext;
  progress: number;
  canGoBack: boolean;
  possibleNextStates: string[];
  transition: (event: string, data?: any) => Promise<void>;
  back: () => Promise<void>;
  updateContext: (data: Partial<FormContext>) => Promise<void>;
  reset: () => Promise<void>;
  engine: FormEngine;
  isReady: boolean;
}
```

**Example:**
```typescript
const {
  currentState,
  context,
  progress,
  transition,
  back,
  isReady
} = useReactForm({
  schema: mySchema,
  autoSave: true,
  onComplete: (data) => submitForm(data)
});
```

---

## react-form-atlas-visualizer

### SchemaVisualizer

Static class for visualizing schemas.

#### Methods

##### `toMermaid(schema: FormSchema): string`
Convert schema to Mermaid diagram syntax.

```typescript
const mermaid = SchemaVisualizer.toMermaid(schema);
```

##### `toHTML(schema: FormSchema): string`
Generate interactive HTML visualization.

```typescript
const html = SchemaVisualizer.toHTML(schema);
```

##### `getStats(schema: FormSchema): object`
Get schema statistics.

```typescript
const stats = SchemaVisualizer.getStats(schema);
// {
//   totalStates: 7,
//   totalTransitions: 8,
//   finalStates: 1,
//   averageBranchingFactor: 1.33
// }
```

### CLI

```bash
react-form-atlas-visualizer <schema-file> [options]

Options:
  -o, --output <file>    Output HTML file
  -h, --help            Show help
```

**Example:**
```bash
react-form-atlas-visualizer schema.json -o visualization.html
```


