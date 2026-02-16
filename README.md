# Code Karma

[![npm version](https://img.shields.io/npm/v/cognitive-debt.svg)](https://www.npmjs.com/package/cognitive-debt)
[![npm downloads](https://img.shields.io/npm/dm/cognitive-debt.svg)](https://www.npmjs.com/package/cognitive-debt)
[![license](https://img.shields.io/npm/l/cognitive-debt.svg)](https://github.com/motiramshinde/CodeKarma/blob/main/LICENSE)

A CLI tool that measures cognitive debt in JavaScript and TypeScript codebases.

## The Problem

You inherit a codebase. You open a file. You see:
- A 200-line function
- 8 levels of nested if-statements  
- Variables named `tmp`, `data`, `x`
- A function with 10 parameters

You think: "This is going to be hard to maintain."

**Code Karma quantifies that feeling.**

## What It Does

Analyzes your code and calculates a **Cognitive Debt** score based on:

1. **Function Length** - How many lines per function
2. **Nesting Depth** - How deeply control flow is nested
3. **Parameter Count** - How many parameters functions take
4. **Naming Clarity** - How clear variable/function names are
5. **Dependencies** - How many local imports each file has

It gives you a score (0-100) and tells you exactly what's making your code hard to read.

## What It Does NOT Do

- ❌ Enforce style (use Prettier for that)
- ❌ Find bugs (use ESLint for that)
- ❌ Measure performance (use profilers for that)
- ❌ Replace code review (use humans for that)

**It measures one thing: how hard your code is to understand.**

## Installation

### Global Installation (Recommended)

```bash
npm install -g cognitive-debt
```

### Local Installation (Per Project)

```bash
npm install --save-dev cognitive-debt
```

### From Source

```bash
git clone https://github.com/motiramshinde/CodeKarma.git
cd CodeKarma
npm install
npm link
```

## Usage

### Analyze a single file
```bash
cognitive-debt src/index.js
```

### Analyze a directory
```bash
cognitive-debt src/
```

### Get JSON output
```bash
cognitive-debt src/ --format json
```

### Use custom configuration
```bash
cognitive-debt src/ --config .cognitivedebtrc.json
```

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

  ✓ Dependencies:
    Local imports: 8
    External imports: 12

Top Issues:

  1. Function 'handleRequest' is too long (142 lines) (line 23)
  2. Function 'validateData' has deep nesting (7 levels) (line 89)
  3. Function 'processUser' has too many parameters (9) (line 156)

═══════════════════════════════════════════
```

## How Scoring Works

**Current implementation: Higher score = Better code**

- **80-100**: Excellent (low cognitive debt)
- **60-79**: Good (manageable)
- **40-59**: Fair (needs attention)
- **0-39**: Poor (high debt)

The tool starts at 100 and subtracts penalties for:
- Long functions
- Deep nesting
- Too many parameters
- Unclear names
- High coupling

See [SCORING_DESIGN.md](SCORING_DESIGN.md) for the full formula and rationale.

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

Adjust these based on your team's standards.

## Why This Tool Exists

Most code quality tools focus on **correctness** (does it work?) or **style** (does it look consistent?).

This tool focuses on **comprehension** (can a human understand it?).

Because:
- Developers spend 70% of their time reading code, not writing it
- Cognitive load is the #1 barrier to onboarding new contributors
- "Technical debt" is often really "cognitive debt"

## What Makes This Different

### 1. Transparent
No black-box ML. Every score is simple math you can audit. See [SCORING_DESIGN.md](SCORING_DESIGN.md).

### 2. Local-Only
No API keys. No cloud services. Your code never leaves your machine.

### 3. Configurable
Don't like our thresholds? Change them. It's your codebase.

### 4. Educational
The tool explains *why* code is hard to read, not just that it is.

## Limitations

### This tool is NOT perfect

- **Context-blind**: Doesn't know if your 100-line function is a state machine that *should* be long
- **Heuristic-based**: Naming clarity uses simple pattern matching, not semantic analysis
- **Single-file**: Doesn't track complexity across file boundaries (yet)

**Use your judgment.** A score is a signal, not a verdict.

## Contributing

This tool is designed for community contributions.

### Adding a New Analyzer

1. Create `src/analyzers/yourAnalyzer.js`
2. Export an `analyze(ast, filePath)` function that returns metrics
3. Add it to `src/index.js`
4. Update weights in `config/defaults.json`
5. Add tests

See existing analyzers for examples.

### Improving Scoring

The scoring formula is in `src/scoring/calculator.js`. 

If you think the weights are wrong, open an issue with:
- Your proposed changes
- Rationale (ideally with research citations)
- Example code that should score differently

### Code Standards

This tool measures cognitive debt, so it should have low cognitive debt:
- Functions under 50 lines
- Nesting under 3 levels
- Clear names
- Comments explaining *why*, not *what*

Run the tool on itself: `cognitive-debt src/`

## Ethical Statement

### What We Believe

1. **Code is for humans first, computers second**  
   If a computer can run it but a human can't understand it, it's not good code.

2. **Metrics are tools, not targets**  
   Goodhart's Law: "When a measure becomes a target, it ceases to be a good measure." Don't game the score.

3. **Context matters**  
   A 200-line function might be fine if it's a generated parser. Use your brain.

4. **Accessibility is a feature**  
   Code that's hard to understand excludes junior developers and non-native English speakers.

### What We Don't Believe

- ❌ That a single number can capture code quality
- ❌ That all code should look the same
- ❌ That tools can replace human judgment
- ❌ That "clean code" is always the right answer

### Our Commitment

- We will keep the algorithm transparent and auditable
- We will not add telemetry or phone home
- We will not sell this tool or your data
- We will listen to feedback and adjust when we're wrong

## License

MIT - Use it however you want.

## Acknowledgments

Built on the shoulders of:
- **Babel** - For AST parsing
- **Commander** - For CLI framework
- **Robert Martin** - For "Clean Code" principles
- **Every developer** who's struggled with unmaintainable code

## Contact

Issues: [GitHub Issues](https://github.com/motiramshinde/CodeKarma/issues)  
npm: [cognitive-debt](https://www.npmjs.com/package/cognitive-debt)

This is a tool by developers, for developers. We're figuring it out as we go.

---

*"The best code is code that doesn't need to be read. The second-best code is code that's easy to read."*
