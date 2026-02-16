# 🧠 How Cognitive Debt Scoring Works: A Deep Dive

This document explains the exact math and logic behind the **Code Karma** (cognitive-debt) scoring system. We believe in transparency—no "AI black boxes," just clear, actionable metrics.

---

## 🌟 The Core Philosophy

**"Code is read 10x more than it is written."**

Our scoring system doesn't measure:
- ❌ **Correctness**: (Does it adhere to spec?)
- ❌ **Style**: (Are spaces consistent?)

It measures **Comprehension**:
- ✅ **Cognitive Load**: How many "items" must your brain hold at once?
- ✅ **Effort**: How hard is it to trace the flow of data?

---

## 🧮 The Application Formula

The score is calculated as a subtraction from a perfect 100.

$$ \text{Score} = 100 - \sum (\text{Penalties}) $$

We enforce a range of **0 to 100**.
- **100**: Perfect clarity.
- **0**: Extremely high cognitive debt.

### Weights (Importance of Each Factor)

We assign weights to different problems based on how much they hurt readability.

| Metric | Weight | Why? |
| --- | --- | --- |
| **Naming Clarity** | 30% | If you don't know what `x` is, you can't understand the code. |
| **Nesting Depth** | 25% | Deep nesting exceeds human working memory (Miller's Law). |
| **Function Length** | 20% | Long functions force context switching and scrolling. |
| **Parameter Count** | 15% | More parameters = exponential complexity in usage. |
| **Dependencies** | 10% | High coupling makes code fragile and hard to isolate. |

---

## ⏱️ Estimated Time to Understand

We calculate an estimated time to read and comprehend the file using this heuristic:

$$ \text{Time} = \left( \frac{\text{LOC}}{\text{15 lines/min}} \right) \times \left( 1 + \text{DebtFactor} \times 2 \right) $$

Where:
- **Base Speed**: 15 lines per minute.
- **DebtFactor**: Inverse of the score (0.0 for perfect code, 1.0 for score 0).
- **Multiplier**: 
  - Perfect code (score 100) → **1x** (15 lines/min)
  - Worst code (score 0) → **3x** (5 lines/min)

*This approximates that messy code takes 3x longer to understand than clean code.*

---

## 🔍 Detailed Metric Breakdown

### 1. Naming Clarity (30%)
**Goal**: Identify vague identifiers that force the reader to stop and deduce meaning.

**Detection Logic**:
We check all variable, function, and class names against a list of "suspect patterns":
- **Single letters**: `a`, `b`, `x`, `d` (except `i`, `j` in loops, `x`, `y` in coordinates).
- **Generic types**: `data`, `info`, `item`, `obj`, `value`, `temp`.
- **Numbered names**: `user2`, `item1`.

**Scoring**:
- `Identifier Score`: 0 if unclear, 1 if clear.
- `Overall Clarity`: (Clear Identifiers / Total Identifiers).
- **Penalty**: If clarity < 100%, we apply a weighted penalty proportional to the "unclear" percentage.

### 2. Nesting Depth (25%)
**Goal**: Measure "Cyclomatic Complexity" Lite. How deeply do you have to stack mental context?

**Detection Logic**:
We traverse the AST (Abstract Syntax Tree) and track how many block statements are inside each other.
- `if` inside `for` = Depth 2.
- `if` inside `if` inside `for` = Depth 3.

**Thresholds**:
- **0-2 levels**: No penalty.
- **3 levels**: Warning.
- **4+ levels**: Heavy penalty (Human Short-Term Memory limit is ~4-7 items).

### 3. Function Length (20%)
**Goal**: Keep units of logic small and single-purpose.

**Detection Logic**:
Count lines of code (LOC) per function body.

**Thresholds**:
- **< 20 lines**: Ideal.
- **20-50 lines**: Acceptable.
- **> 50 lines**: Penalty starts kicking in.
- **> 100 lines**: Maximum penalty for this metric.

### 4. Parameter Count (15%)
**Goal**: Reduce the interface complexity of functions.

**Detection Logic**:
Count arguments defined in function signature.

**Thresholds**:
- **0-3 params**: Ideal.
- **4 params**: Warning.
- **5+ params**: Penalty. (Refactoring hint: Use an object/interface).

### 5. Dependencies (10%)
**Goal**: Measure "Coupling". How much does this file know about the rest of the world?

**Detection Logic**:
Count `import` and `require` statements.

**Thresholds**:
- **0-5 imports**: Low coupling.
- **> 10 imports**: High coupling (God Object anti-pattern).

---

## 📉 Grade Scale

| Score Range | Grade | Meaning |
| --- | --- | --- |
| **80 - 100** | 🟢 **Excellent** | Low cognitive debt. Easy to maintain. |
| **60 - 79** | 🟡 **Good** | Manageable, but watch out for entropy. |
| **40 - 59** | 🟠 **Fair** | Hard to read. Needs refactoring soon. |
| **0 - 39** | 🔴 **Poor** | Critical debt. High risk of bugs during changes. |

---

## 🛠 Extensibility

Because we use **AST Parsing** (via Babel), not Regular Expressions, our tool "understands" the structure of the code. This means:
1. Comments don't confuse it.
2. String contents don't confuse it.
3. We can easily add new rules (e.g., specific React patterns, TypeScript complexity).

This logic is defined in `src/scoring/calculator.js` if you want to inspect the raw code.
