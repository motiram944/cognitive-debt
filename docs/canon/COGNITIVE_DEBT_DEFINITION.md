# What Is Cognitive Debt?

**Cognitive Debt is the mental toll code takes on a developer's brain.**

It is the gap between how code *looks* (its syntax) and how it *thinks* (its logic). When this gap is wide, developers must burn mental energy to bridge it, simulating a computer's state in their own short-term memory.

### The Canonical Definition
> **"Cognitive Debt is the accumulated mental effort required to understand, predict, and safely modify a system, independent of its functional correctness."**

---

### How It Differs from Technical Debt

| **Technical Debt** | **Cognitive Debt** |
| :--- | :--- |
| **"It's hard to extends."** | **"It's hard to understand."** |
| Visible in: Architecture, Speed | Visible in: Onboarding time, Bug rate |
| Solution: Refactoring | Solution: Simplification & Renaming |
| *Example:* Monolithic class | *Example:* Variable named `data` |

### The Invisible Cost
Cognitive Debt is often invisible during code reviews because:
1.  **The Reviewer Context Fallacy**: The reviewer just read the ticket, so they have "context." Future maintainers won't.
2.  **Logic Bias**: We look for bugs, not confusion. If it works, we merge it.
3.  **Seniority Gap**: Senior engineers have internalized the system's oddities; juniors haven't.

### Measurable Signals (Without AI)
Cognitive Debt is **not subjective**. It correlates with measurable structural complexity:
*   **Cyclomatic Complexity**: How many paths must I hold in my head?
*   **Ambiguity Ratio**: What percentage of names require external lookup?
*   **Scope & Coupling**: how many files must I open to understand *this* one?

**Reducing Cognitive Debt is the highest-leverage activity an engineering team can perform.**
Because code is read 10x more than it is written.
