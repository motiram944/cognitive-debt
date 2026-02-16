# Contributing to Code Karma

Thank you for your interest in contributing to Code Karma! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Code sample that demonstrates the issue
- Your environment (Node version, OS)

### Suggesting Features

We welcome feature suggestions! Please open an issue with:
- Clear description of the feature
- Use case (why is it needed?)
- Proposed implementation (if you have ideas)

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test your changes**: Run the tool on example files
5. **Commit with clear messages**: `git commit -m "Add feature: description"`
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/CodeKarma.git
cd CodeKarma

# Install dependencies
npm install

# Link for local testing
npm link

# Test on examples
cognitive-debt examples/good-code.js
cognitive-debt examples/bad-code.js
```

## Code Standards

Since this tool measures cognitive debt, our code should have low cognitive debt:

- ✅ Functions under 50 lines
- ✅ Nesting under 3 levels
- ✅ Clear, descriptive names
- ✅ Comments explaining *why*, not *what*
- ✅ Maximum 4 parameters per function

**Test your code**: Run `cognitive-debt src/` to check your changes!

## Adding a New Analyzer

To add a new code metric analyzer:

1. **Create analyzer file**: `src/analyzers/yourAnalyzer.js`

```javascript
const traverse = require('@babel/traverse').default;

function analyze(ast, filePath) {
  // Your analysis logic here
  
  return {
    // Your metrics
  };
}

module.exports = { analyze };
```

2. **Add to main orchestrator**: `src/index.js`

```javascript
const yourAnalyzer = require('./analyzers/yourAnalyzer');

// In analyzeFile function:
const metrics = {
  // ... existing analyzers
  yourMetric: yourAnalyzer.analyze(ast, filePath),
};
```

3. **Update scoring**: `src/scoring/calculator.js`
   - Add penalty calculation
   - Update weights in `config/defaults.json`

4. **Update formatter**: `src/reporter/formatter.js`
   - Add metric to output

5. **Test it**: Create test cases and verify output

## Project Structure

```
src/
├── analyzers/      # Code analysis modules
├── parser/         # AST parsing
├── scoring/        # Score calculation
└── reporter/       # Output formatting

config/             # Configuration files
examples/           # Test files
bin/                # CLI entry point
```

## Commit Message Guidelines

- Use present tense: "Add feature" not "Added feature"
- Be descriptive: "Add cyclomatic complexity analyzer" not "Add analyzer"
- Reference issues: "Fix #123: Handle TypeScript decorators"

## Questions?

Open an issue or discussion on GitHub!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
