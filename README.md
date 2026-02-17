# cognitive-debt

[![npm version](https://img.shields.io/npm/v/cognitive-debt.svg)](https://www.npmjs.com/package/cognitive-debt)
[![npm downloads](https://img.shields.io/npm/dm/cognitive-debt.svg)](https://www.npmjs.com/package/cognitive-debt)
[![license](https://img.shields.io/npm/l/cognitive-debt.svg)](https://github.com/motiram944/cognitive-debt/blob/main/LICENSE)

**The canonical tool for measuring code readability, complexity, and cognitive debt in JavaScript and TypeScript.**

> **"Cognitive Debt is the accumulated mental effort required to understand, predict, and safely modify a system, independent of its functional correctness."**

---

### 🧠 Why Use This Tool?
Most tools measure **Technical Debt** (bugs, style). This tool measures **Cognitive Debt** (confusion).
It helps you identify files that are "technically correct" but **impossible to read**.

**Keywords:** Code Maintainability, Refactoring Risk, Static Analysis, Code Quality Metrics.

**Use this to:**
*   📉 **Predict Risk**: Find files that will break if you touch them.
*   🛡 **Gate Complexity**: Stop unreadable code from merging.
*   🎓 **Teach Empathy**: Show *why* code is hard to read (nesting, naming, coupling).

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

## 🆚 Comparison
How does `cognitive-debt` compare to other tools?

| Feature | **ESLint / Prettier** | **Cyclomatic Complexity** | **SonarQube** | **Cognitive Debt** |
| :--- | :---: | :---: | :---: | :---: |
| **Focus** | Syntax & Style | Logic Paths | Everything | **Readability & Comprehension** |
| **Goal** | Consistency | Testability | Compliance | **Empathy** |
| **Measures** | Typos, spacing | `if`/`else` count | Rulesets | **Naming + Nesting + Size** |
| **Output** | Errors | Single Number | Dashboard | **Actionable Advice** |
| **Philosophy** | "Is it wrong?" | "Is it hard to test?" | "Is it compliant?" | **"Is it hard to read?"** |

---

## 📚 Documentation

-   **[Installation Guide](#installation)** - npm, GitHub, or npx
-   **[Usage Examples](#usage)** - Basic commands and common use cases
-   **[Report Generation](#generating-reports)** - HTML dashboards and JSON output
-   **[Configuration](#configuration)** - Customize thresholds for your team
-   **[Algorithm Deep Dive](ALGORITHM_DEEP_DIVE.md)** - Exact math and logic behind the scoring
-   **[Contributing](CONTRIBUTING.md)** - Add new analyzers or improve scoring

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

## 📖 User Guide

### Running the CLI
The basic command analyzes a file or directory and outputs a text report to your terminal.

```bash
# Analyze a specific file
cognitive-debt src/utils/helper.js

# Analyze an entire directory (recursive)
cognitive-debt src/
```

### 📊 Generating Reports
You can export the analysis to different formats using the `--output` flag.

#### HTML Dashboard (Recommended)
Generate a standalone HTML file with interactive charts, score distributions, and detailed breakdowns of complex files.

```bash
cognitive-debt src/ --output report.html
```
- **View**: Open `report.html` in your browser.
- **Features**: 
  - **Score Distribution**: distinct colors for Excellent (Green), Good (Blue), Fair (Yellow), Poor (Red).
  - **Time Breakdown**: "Time to Understand" chart showing the most complex files.
  - **File Details**: Expandable rows showing exact issues and line numbers.

#### JSON Data
Generate a raw JSON file for integration with other tools (CI/CD, custom dashboards).

```bash
cognitive-debt src/ --output report.json
```

---

### 🔮 Change Impact Forecaster
Predict the risk of modifying a specific file before you touch it.

```bash
cognitive-debt impact src/utils/auth.js
```

**What it tells you:**
- **Risk Level**: (Low/Medium/High/Critical)
- **Ripple Effects**: How many other files rely on this one?
- **Cognitive Load**: Is the file itself hard to understand?
- **Actionable Advice**: e.g., "Write regression tests first."

---

### 📉 Cognitive Debt Diff
Compare two versions of your code to see if debt is increasing or decreasing.

**Compare Git Branches:**
```bash
natural-debt diff main..feature-branch
```

**Compare Directories:**
```bash
cognitive-debt diff ./v1 ./v2
```

**Output:**
- **Status**: ⚠️ Debt Increased / 👏 Debt Decreased
- **Global Changes**: +LOC, +Dependencies
- **Impacted Files**: List of files that got worse (or better) and exactly why.

---

### CI/CD Integration
Fail your build pipeline if cognitive debt is too high.

```bash
# Fail if any file has a "Poor" grade
cognitive-debt src/ || exit 1
```

### Configuration
Customize thresholds by creating a `.cognitivedebtrc.json` file in your project root.

```json
{
  "thresholds": {
    "functionLength": 60,
    "nestingDepth": 4
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
Est. Time to Understand: 45 min

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

---

## 🤝 Philosophy

1.  **Transparency**: No AI black boxes. You should be able to do the math on a piece of paper.
2.  **Privacy**: Your code never leaves your machine.
3.  **Education**: The tool should teach you *why* the score is low, not just judge you.
4.  **Empathy**: Code is human-to-human communication. We advocate for the future maintainer.

## ⛔ When NOT To Use This Tool

*   **Do not use this to punish developers.** Cognitive debt is often a systemic issue, not a personal failure.
*   **Do not use this as a hard gate without discussion.** Sometimes complex problems require complex solutions.
*   **Do not optimize for score alone.** A score of 100 with incorrect logic is useless.

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
