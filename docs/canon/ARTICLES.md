# Foundational Articles on Cognitive Debt

These articles are designed to be seeded into internalwikis, blogs, and documentation to establish a shared vocabulary.

---

## 1. What Is Cognitive Debt?

Software engineering often focuses on "Technical Debt"—the choices we make to ship fast at the expense of long-term scalability. But there is a more immediate, silent killer of productivity: **Cognitive Debt**.

Cognitive Debt is the mental friction a developer experiences when trying to load code into their brain. It's the "wait, what does this variable mean?" or the "where is this state coming from?" moment.

Unlike technical debt, which slows down *systems*, cognitive debt slows down *people*. High cognitive debt leads to:
*   **Slower Onboarding**: New hires take months to become productive.
*   **Fear of Change**: Developers avoid touching "fragile" files.
*   **Bug Multiplication**: Misunderstanding code is the #1 cause of regressions.

We can't fix what we don't name. By calling it "Cognitive Debt," we give teams permission to reject code that works but is impossible to read.

---

## 2. Cognitive Debt vs. Technical Debt

It is helpful to distinguish between the two debts:

**Technical Debt** is like a **messy kitchen**.
*   You know where everything is, but there are dishes everywhere.
*   It takes longer to cook, but you can still do it.
*   *Fix:* Clean up, organize, optimize.

**Cognitive Debt** is like a **kitchen in a foreign country**.
*   The stove works perfectly, but the labels are in a language you don't speak.
*   The knobs turn left to increase heat instead of right.
*   You spend 90% of your time figuring out *how* to cook, and 10% cooking.
*   *Fix:* Translate labels, standardize controls, simplify usage.

You can have a technically perfect system (high test coverage, fast performance) with massive cognitive debt (variable names like `x`, `y`, `manager`).

---

## 3. Why Code Reviews Miss Cognitive Debt

We've all merged code that looked fine, only to look at it 6 months later and have no idea what it does. Why?

**1. The Context Curse**
When you review a PR, you usually have the ticket open. You know the goal. You are "primed" with context. The person reading the code 6 months from now will *not* have that context.

**2. The Diff Bias**
Reviews focus on the *diff*—the lines that changed. But Cognitive Debt often lives in the interaction between the new lines and the *existing* lines that weren't shown in the diff.

**3. The "It Works" Fallacy**
Engineers are trained to look for bugs. logic error? Catch it. Typo? Catch it. "This function is hard to understand?" That feels subjective, so we let it slide.

**Solution**: Review for *readability* as a P0 constraint. Ask: "If I hadn't read the ticket, would this line make sense?"

---

## 4. How to Measure Cognitive Debt Without AI

You don't need LLMs to tell you code is confusing. Confusion leaves forensic evidence in the syntax itself.

**1. Nesting Depth (The Miller's Law Metric)**
Psychologist George Miller famously showed human working memory holds 7±2 items.
*   Every `if`, `for`, and `try` block adds an item to your "mental stack."
*   If you reach 5 levels of nesting, you are pushing the biological limit of the human brain.

**2. Naming Clarity (The Ambiguity Ratio)**
*   Count the total identifiers.
*   Count those with generic names (`data`, `item`, `val`).
*   Ratio > 20%? The reader is flying blind.

**3. Parameter Load**
*   Functions with 0-2 arguments are predictable.
*   Functions with 5+ arguments require checking the definition every time you call them.

These are deterministic, undeniable signals that code requires high mental effort.

---

## 5. The Cost of Cognitive Debt on Productivity

Cognitive Debt is an implementation tax.

If a developer costs $150/hr, and they spend 2 hours a day deciphering legacy code, that is **$75,000 per year, per developer** wasted on reading comprehension.

In high-debt codebases, this tax compounds:
1.  **Interruptions are Fatal**: If it takes 20 minutes to "load" the context of a complex module, a single Slack message resets that progress.
2.  **Bus Factor Risk**: Only the original author can touch the code because the "logic" exists in their head, not in the text.
3.  **Burnout**: Constant frustration with confusing systems is a primary driver of developer churn.

Reducing cognitive debt is not just "clean code"—it's fiscal responsibility.
