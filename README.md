# cognitive-debt

[![npm version](https://img.shields.io/npm/v/cognitive-debt.svg)](https://www.npmjs.com/package/cognitive-debt)
[![npm downloads](https://img.shields.io/npm/dm/cognitive-debt.svg)](https://www.npmjs.com/package/cognitive-debt)
[![license](https://img.shields.io/npm/l/cognitive-debt.svg)](https://github.com/motiram944/cognitive-debt/blob/main/LICENSE)

**A CLI tool that measures cognitive debt in JavaScript and TypeScript codebases.**

Analyzes your code and gives you a score based on how hard it is to understand - not how correct it is, not how pretty it is, but how much mental effort it takes to read.

---

## 📦 Quick Start

```bash
# Install globally
npm install -g cognitive-debt

# Analyze your code
cognitive-debt src/

# Get detailed JSON output
cognitive-debt src/ --format json
```

---

## 🎯 What It Measures

1. **Function Length** - Long functions require more context switching
2. **Nesting Depth** - Deep nesting exceeds working memory (Miller's Law: 7±2 items)
3. **Parameter Count** - Many parameters increase cognitive load exponentially
4. **Naming Clarity** - Unclear names force readers to hold mental mappings
5. **Dependencies** - High coupling requires understanding multiple files simultaneously

**Score**: 0-100 (higher = better code, easier to understand)

---

## 📚 Documentation

- **[Installation Guide](#installation)** - npm, GitHub, or npx
- **[Usage Examples](#usage)** - Basic commands and common use cases
- **[Configuration](#configuration)** - Customize thresholds for your team
- **[Scoring Details](SCORING_DESIGN.md)** - How the algorithm works
- **[Contributing](CONTRIBUTING.md)** - Add new analyzers or improve scoring

---

## Installation

### Option 1: npm (Recommended)

**Global Installation:**
```bash
npm install -g cognitive-debt
cognitive-debt src/
```

**Local Installation:**
```bash
npm install --save-dev cognitive-debt
npx cognitive-debt src/
```

### Option 2: GitHub

```bash
git clone https://github.com/motiram944/cognitive-debt.git
cd cognitive-debt
npm install
npm link
```

### Option 3: Try Without Installing

```bash
npx cognitive-debt src/
```

---

## Usage

### Basic Commands

```bash
# Analyze a file
cognitive-debt src/index.js

# Analyze a directory
cognitive-debt src/

# JSON output
cognitive-debt src/ --format json

# Custom config
cognitive-debt src/ --config .cognitivedebtrc.json
```

### Common Use Cases

**CI/CD Integration:**
```bash
npm install -g cognitive-debt
cognitive-debt src/ --format json > report.json
cognitive-debt src/ || exit 1  # Fail build if score is low
```

**Pre-commit Hook:**
```bash
cognitive-debt src/ || echo "Warning: High cognitive debt detected"
```

**npm Scripts:**
```json
{
  "scripts": {
    "analyze": "cognitive-debt src/",
    "analyze:json": "cognitive-debt src/ --format json"
  }
}
```

---

## Example Output

```
═══════════════════════════════════════════
    Cognitive Debt Analysis Report
═══════════════════════════════════════════

File: src/handlers/request.js

Overall Score: 23/100 (Poor)

Metrics Summary:

  ⚠ Function Length:
    Average: 67 lines
    Maximum: 142 lines
    ⚠ 3 function(s) exceed 50 lines

  ⚠ Nesting Depth:
    Average: 3.2 levels
    Maximum: 7 levels
    ⚠ 2 function(s) exceed 3 levels

  ⚠ Parameter Count:
    Average: 5.1 parameters
    Maximum: 9 parameters
    ⚠ 4 function(s) exceed 4 parameters

  ⚠ Naming Clarity:
    Unclear names: 42%
    Total identifiers: 89

Top Issues:

  1. Function 'handleRequest' is too long (142 lines) (line 23)
  2. Function 'validateData' has deep nesting (7 levels) (line 89)
  3. Function 'processUser' has too many parameters (9) (line 156)

═══════════════════════════════════════════
```

---

## Configuration

Create `.cognitivedebtrc.json` in your project root:

```json
{
  "thresholds": {
    "functionLength": 50,
    "nestingDepth": 3,
    "parameterCount": 4,
    "maxLocalImports": 10
  },
  "weights": {
    "functionLength": 0.5,
    "nestingDepth": 10,
    "parameterCount": 5,
    "namingClarity": 30,
    "dependencies": 2
  }
}
```

---

## Why This Tool Exists

Most code quality tools focus on **correctness** (does it work?) or **style** (does it look consistent?).

This tool focuses on **comprehension** (can a human understand it?).

Because:
- Developers spend 70% of their time reading code, not writing it
- Cognitive load is the #1 barrier to onboarding new contributors
- "Technical debt" is often really "cognitive debt"

---

## What Makes This Different

✅ **Transparent** - No black-box ML. Simple math you can audit  
✅ **Local-Only** - No API keys, no cloud services, your code never leaves your machine  
✅ **Configurable** - Adjust thresholds for your team's standards  
✅ **Educational** - Explains *why* code is hard to read, not just that it is  

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- How to add new analyzers
- How to improve scoring
- Code standards
- Development setup

---

## License

MIT - Use it however you want.

---

## Links

- **npm**: [cognitive-debt](https://www.npmjs.com/package/cognitive-debt)
- **GitHub**: [motiram944/cognitive-debt](https://github.com/motiram944/cognitive-debt)
- **Issues**: [Report bugs or request features](https://github.com/motiram944/cognitive-debt/issues)

---

*"The best code is code that doesn't need to be read. The second-best code is code that's easy to read."*
