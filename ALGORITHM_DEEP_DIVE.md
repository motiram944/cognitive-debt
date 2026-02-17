# 🧠 Cognitive Debt Algorithm Deep Dive

This document details the exact mathematical formulas, heuristics, and logic used by **Code Karma** to calculate cognitive debt scores and estimated reading times.

Unlike "black box" AI tools, Code Karma uses transparent, deterministic algorithms based on software engineering research (Miller's Law, Clean Code principles).

---

## 1. The Core Scoring Formula

The final **Cognitive Debt Score** (0-100) is calculated by subtracting **penalties** from a perfect score of 100.

$$
Score = \max(0, 100 - \sum Penalties)
$$

Where penalties are calculated from five distinct dimensions of complexity.

### The 5 Dimensions of Complexity

| Dimension | Weight | Threshold | Why it matters |
|-----------|--------|-----------|----------------|
| **Naming Clarity** | **30** | 0% Unclear | If you can't name it, you don't understand it. Ambiguity is the #1 cause of confusion. |
| **Nesting Depth** | **10** | 3 Levels | Deep nesting exceeds short-term memory (Miller's Law: 7±2 items). |
| **Parameter Count** | **5** | 4 Params | More parameters = exponentially more interactions to track. |
| **Dependencies** | **2** | 10 Imports | High coupling makes code fragile and hard to isolate. |
| **Function Length** | **0.5** | 50 Lines | Long functions dilute focus and mix distinct responsibilities. |

---

## 2. Penalty Calculations (The Math)

Each analyzer calculates a penalty only when the code exceeds a specific **threshold**.

### A. Naming Clarity (Weight: 30)
Measures the percentage of identifiers (variables, functions, params) that are vague (e.g., `data`, `obj`, `temp`, `a`, `b`).

$$
Penalty = (\frac{\text{Unclear Identifiers}}{\text{Total Identifiers}}) \times 30
$$

*Example*: If 10% of your names are unclear, you lose **3 points**.

### B. Nesting Depth (Weight: 10 per level)
Measures how deep control structures (if/for/while) are nested.

$$
Penalty = (\text{Max Depth} - 3) \times 10
$$

*Example*: A function with 5 levels of nesting (2 above threshold) loses **20 points**.

### C. Parameter Count (Weight: 5 per param)
Measures the average number of arguments in functions.

$$
Penalty = (\text{Average Params} - 4) \times 5
$$

*Example*: If your average function takes 6 arguments, you lose **10 points**.

### D. Function Length (Weight: 0.5 per line)
Measures lines of code per function.

$$
Penalty = (\text{Average Length} - 50) \times 0.5
$$

*Example*: If average length is 70 lines (20 over threshold), you lose **10 points**.

### E. Dependencies (Weight: 2 per import)
Measures local imports (coupling).

$$
Penalty = (\text{Local Imports} - 10) \times 2
$$

*Example*: A file importing 15 local modules loses **10 points**.

---

## 3. "Time to Understand" Heuristic

This metric estimates how long it would take a developer to read and comprehend the file. It is **not** just a word count; it scales exponentially with complexity.

### The Formula
$$
\text{Time} = \frac{\text{LOC}}{\text{BaseSpeed}} \times \text{ComplexityMultiplier}
$$

### Variables
1.  **LOC**: Total Lines of Code.
2.  **BaseSpeed**: **20 lines per minute** (Assumes scanning clean code).
3.  **ComplexityMultiplier**: A factor from **1.0x** (simple) to **10.0x+** (impossible).

### How the Multiplier is Calculated

The multiplier starts at **1.0** and grows based on:

1.  **General Debt (Score Impact)**:
    $$
    + ((100 - Score) / 100) \times 2
    $$
    *(A score of 0 adds +2.0x to the multiplier)*

2.  **Nesting Penalty (Context Switching)**:
    $$
    + (\text{MaxDepth} - 3) \times 0.2
    $$
    *(Each extra level adds 20% reading time)*

3.  **Parameter Load (Memory Load)**:
    $$
    + (\text{MaxParams} - 3) \times 0.1
    $$
    *(Each extra param adds 10% reading time)*

4.  **Ambiguity Penalty (Verification Time)**:
    $$
    + (\text{UnclearPercent} / 100) \times 2
    $$
    *(100% unclear names triples reading time because you have to check definitions constantly)*

---

## 4. Grading Scale

| Grade | Score Range | Description |
|-------|-------------|-------------|
| 🟢 **Excellent** | **80 - 100** | Code is self-documenting. Minimal cognitive load. |
| 🔵 **Good** | **60 - 79** | Readable but has minor complexity. Manageable. |
| 🟡 **Fair** | **40 - 59** | Requires effort to understand. Refactoring recommended. |
| 🔴 **Poor** | **0 - 39** | High cognitive debt. Significant risk of bugs during modification. |
