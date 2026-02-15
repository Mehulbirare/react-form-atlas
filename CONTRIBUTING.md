# Contributing to NeuraForm

Thank you for your interest in contributing to NeuraForm! 🎉

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/neuraform.git
   cd neuraform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build all packages**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Project Structure

```
neuraform/
├── packages/
│   ├── core/           # Framework-agnostic engine
│   ├── react/          # React hooks and components
│   └── visualizer/     # Schema visualization tool
├── examples/           # Example implementations
└── docs/              # Documentation
```

## Making Changes

1. Create a new branch for your feature/fix
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## Code Style

- We use TypeScript for all packages
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

## Testing

- Write unit tests for new features
- Ensure existing tests pass
- Aim for high code coverage

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the CHANGELOG.md with your changes
3. The PR will be merged once you have approval from maintainers

## Questions?

Feel free to open an issue for any questions or concerns!
