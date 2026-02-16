# Changelog

All notable changes to Code Karma will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-16

### Added
- **New Feature**: "Est. Time to Understand" metric - calculates how long it takes to read the code based on complexity.
- **New Feature**: HTML Report Generation - Create beautiful, interactive dashboards with `--output report.html`.
- **New Feature**: JSON File Output - Save analysis data to disk with `--output report.json`.
- **Documentation**: New `SCORING_LOGIC_EXPLAINED.md` deep dive guide.
- **Documentation**: Comprehensive Installation and Usage guide in README.
- **Assets**: Added good/bad code examples for marketing.
- GitHub repository URLs updated to `motiram944`.
- CI/CD integration examples.
- Initial release of Code Karma
- **Function Length Analyzer** - Measures lines of code per function
- **Nesting Depth Analyzer** - Tracks control flow nesting levels
- **Parameter Count Analyzer** - Counts function parameters
- **Naming Clarity Analyzer** - Identifies unclear variable/function names
- **Dependencies Analyzer** - Tracks cross-file imports
- **Scoring Engine** - Transparent weighted penalty system (0-100 score)
- **CLI Interface** - Command-line tool with file and directory support
- **Multiple Output Formats** - Text (colorized) and JSON output
- **Configurable Thresholds** - Custom configuration via `.cognitivedebtrc.json`
- **Comprehensive Documentation** - README, scoring design, comparison guide
- **Example Files** - Good and bad code samples for testing

### Features
- AST-based analysis using Babel parser
- Support for JavaScript and TypeScript
- Local-only execution (no external services)
- Exit codes for CI/CD integration (0 = pass, 1 = fail)
- Detailed issue reporting with line numbers
- Zero runtime dependencies on external APIs

### Documentation
- README.md - Main documentation
- SCORING_DESIGN.md - Research-backed scoring rationale
- SCORING_COMPARISON.md - Two scoring approaches explained
- PUBLISHING_GUIDE.md - npm publishing instructions
- PROJECT_SUMMARY.md - Quick reference guide

---

## Future Releases

### Planned for 1.1.0
- [ ] Add cyclomatic complexity analyzer
- [ ] Support for Vue.js single-file components
- [ ] HTML report generation
- [ ] Watch mode for continuous analysis
- [ ] Git diff integration (analyze only changed files)

### Planned for 1.2.0
- [ ] VS Code extension
- [ ] GitHub Action for automated checks
- [ ] Team dashboard (aggregate scores across projects)
- [ ] Historical trend tracking

### Planned for 2.0.0
- [ ] Cross-file complexity analysis
- [ ] Semantic naming analysis (using NLP)
- [ ] Custom analyzer plugin system
- [ ] Alternative scoring mode (higher = worse)

---

## Contributing

See [PUBLISHING_GUIDE.md](PUBLISHING_GUIDE.md) for how to contribute and publish updates.
