# Contributing to Cognitive Debt

Thank you for your interest in making code easier to read! We believe that **empathy for the reader** is the highest virtue in software engineering.

## 🤝 How to Contribute

### 1. Report Bugs
If the tool gives a score that feels "wrong" (too high or too low), open an issue!
*   Provide the code snippet.
*   Explain *why* you think the score is inaccurate.
*   We use these edge cases to tune our algorithm.

### 2. Add New Analyzers
We want to measure more aspects of readability.
*   **Location**: `src/analyzers/`
*   **Structure**: Each analyzer exports a function that takes an AST and returns a metric.
*   **Ideas**:
    *   Comment density (too few? too many?)
    *   Inconsistent return types
    *   "Yoda conditions"

### 3. Improve Documentation
Clear synonyms and simple explanations help us reach more developers.
*   Fix typos.
*   Add examples.
*   Translate docs.

## 🛠 Development Setup

```bash
# Clone the repo
git clone https://github.com/motiram944/cognitive-debt.git

# Install dependencies
npm install

# Run tests
npm test

# Link locally to test on your own projects
npm link
cognitive-debt test-file.js
```

## 🧪 Testing
We use **Jest** for testing.
*   Run `npm test` to verify changes.
*   Add a test case in `__tests__/` for any new logic.

## 📜 Style Guide
*   **No AI-generated code** without review. We want to understand every line.
*   **Keep it simple.** If the code for `cognitive-debt` has high cognitive debt, we have failed.
*   **Be kind.** Code reviews are for learning, not shaming.

Thank you for helping us reduce developer suffering! 🚀
