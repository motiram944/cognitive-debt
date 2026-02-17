# GitHub Authority Standards

These sections are designed to be added to the repository `README.md` or `CONTRIBUTING.md` to establish project maturity and philosophy.

---

## 🛡 Why This Project Exists
We believe that code is fundamentally a medium for human-to-human communication. Computers can execute binary; source code exists for *us*.

This project is a stand against "clever" code. It is an automated advocate for the future maintainer who has to wake up at 3 AM to fix a bug. We built this because we believe empathy for your teammates starts with writing readable code.

## ⛔ When NOT To Use This Tool
*   **Do not use this to punish developers.** Cognitive debt is often a systemic issue, not a personal failure.
*   **Do not use this as a hard gate without discussion.** Sometimes complex problems require complex solutions.
*   **Do not optimize for score alone.** A score of 100 with incorrect logic is useless.

## 🤝 Philosophy
1.  **Transparency**: No AI black boxes. You should be able to do the math on a piece of paper.
2.  **Privacy**: Your code never leaves your machine.
3.  **Education**: The tool should teach you *why* the score is low, not just judge you.

## 📝 Contributing Outline
We welcome first-time contributors! Open source can be intimidating, but we're here to help.
*   **Found a bug?** Open an issue.
*   **Want to add a metric?** Check `src/analyzers/` for examples.
*   **Documentation fix?** These are the most valuable contributions!

---

## 🔍 Issue Template Idea

**Is this a bug or a feature?**
[ ] Bug
[ ] Feature
[ ] Discussion: "Is this fair?"

**What happened?**
I analyzed my file and got a score of 40/100.

**Why do you think this is wrong?**
The tool penalized me for nesting, but this is a complex state machine...

**Context**
Help us understand why the heuristic failed here.
