# Cognitive Debt Scoring Formula

## Design Philosophy

**Higher score = Higher cognitive burden** (0 = perfect, 100 = unmaintainable)

This scoring system is designed to be:
- **Transparent**: No black-box algorithms
- **Justifiable**: Every weight has a research-backed rationale
- **Configurable**: Teams can adjust based on their context
- **Educational**: Helps developers understand *why* code is hard to read

---

## Scoring Formula

```
Cognitive Debt Score = Σ (Factor Score × Factor Weight)

Where total weights sum to 100%
```

### Factor Breakdown

| Factor | Weight | Rationale |
|--------|--------|-----------|
| **Nesting Depth** | 30% | Most impactful on comprehension (Miller's Law: 7±2 items in working memory) |
| **Function Length** | 25% | Long functions require more context switching |
| **Naming Clarity** | 20% | Poor names force readers to hold mental mappings |
| **Parameter Count** | 15% | High parameter count increases cognitive load exponentially |
| **Cross-file Dependencies** | 10% | Coupling requires understanding multiple files simultaneously |

**Total: 100%**

---

## Individual Factor Scoring

### 1. Nesting Depth (30% weight)

**Research basis**: Studies show comprehension drops significantly beyond 3 levels of nesting.

```
Score = min(100, (max_depth - 1) × 25)

Thresholds:
- 1 level:  0 points (ideal)
- 2 levels: 25 points (acceptable)
- 3 levels: 50 points (concerning)
- 4 levels: 75 points (problematic)
- 5+ levels: 100 points (critical)
```

**Why this formula?**
- Linear penalty because each level adds similar cognitive load
- Starts at 1 (not 0) because even flat code has some structure
- Cap at 100 to prevent one factor from dominating

---

### 2. Function Length (25% weight)

**Research basis**: Robert Martin's "Clean Code" suggests 20 lines max; studies show comprehension degrades after ~50 lines.

```
Score = min(100, max(0, (avg_length - 20) × 2))

Thresholds:
- ≤20 lines:  0 points (ideal)
- 30 lines:  20 points (acceptable)
- 50 lines:  60 points (needs refactoring)
- 70 lines: 100 points (critical)
```

**Why this formula?**
- 20 lines is the "ideal" baseline (no penalty)
- Multiplier of 2 means every 10 extra lines adds 20 points
- Reflects non-linear difficulty: 70-line function is much harder than 2× a 35-line function

---

### 3. Naming Clarity (20% weight)

**Research basis**: Variable names account for 70% of code comprehension time (Lawrie et al., 2006).

```
Score = (unclear_names / total_names) × 100

Unclear names include:
- Single letters (except i, j, k in loops)
- Abbreviations without context (tmp, usr, btn)
- All lowercase >8 chars without separators (userdata)
```

**Why this formula?**
- Direct percentage: 50% unclear names = 50 points
- Simple and intuitive
- Encourages teams to improve naming incrementally

---

### 4. Parameter Count (15% weight)

**Research basis**: Psychological studies show humans struggle with >4 parameters (working memory limits).

```
Score = min(100, max(0, (avg_params - 3) × 20))

Thresholds:
- ≤3 params:  0 points (ideal)
- 4 params:  20 points (acceptable)
- 5 params:  40 points (consider refactoring)
- 6 params:  60 points (problematic)
- 8+ params: 100 points (critical)
```

**Why this formula?**
- 3 parameters is the sweet spot (no penalty)
- Multiplier of 20 creates steep penalties (encourages using objects/config)
- Reflects that 8 parameters is genuinely hard to use correctly

---

### 5. Cross-file Dependencies (10% weight)

**Research basis**: High coupling increases change impact and testing difficulty.

```
Score = min(100, max(0, (local_imports - 5) × 10))

Thresholds:
- ≤5 imports:  0 points (ideal)
- 10 imports: 50 points (acceptable)
- 15 imports: 100 points (high coupling)
```

**Why this formula?**
- 5 imports is reasonable for most modules
- Lowest weight (10%) because dependencies are sometimes necessary
- Encourages modular design without being punitive

---

## Example Calculation

### Example: A Problematic Function

```javascript
function processUserDataAndValidate(id, name, email, phone, address, 
                                   country, zip, preferences, metadata) {
  let tmp = null;
  if (id) {
    if (name) {
      if (email) {
        if (phone) {
          if (validateEmail(email)) {
            // ... 80 lines of logic ...
          }
        }
      }
    }
  }
  return tmp;
}
```

**Metrics:**
- Max nesting depth: 5 levels
- Function length: 85 lines
- Unclear names: 1/10 = 10%
- Parameters: 9
- Local imports: 3

**Calculation:**

| Factor | Raw Score | Weight | Contribution |
|--------|-----------|--------|--------------|
| Nesting Depth | (5-1)×25 = **100** | 30% | **30.0** |
| Function Length | (85-20)×2 = **100** (capped) | 25% | **25.0** |
| Naming Clarity | 10% = **10** | 20% | **2.0** |
| Parameter Count | (9-3)×20 = **100** (capped) | 15% | **15.0** |
| Dependencies | (3-5)×10 = **0** (negative, so 0) | 10% | **0.0** |

**Final Score: 72/100** (High Cognitive Debt)

**Interpretation:** This function is in the "problematic" range. The main issues are:
1. Deep nesting (30 points) - hardest to fix, biggest impact
2. Too long (25 points) - should be split into smaller functions
3. Too many parameters (15 points) - use a config object

---

## Grade Boundaries

| Score | Grade | Meaning |
|-------|-------|---------|
| 0-20 | **Excellent** | Low cognitive burden, easy to maintain |
| 21-40 | **Good** | Manageable complexity |
| 41-60 | **Fair** | Needs attention, refactoring recommended |
| 61-80 | **Poor** | High cognitive burden, difficult to maintain |
| 81-100 | **Critical** | Unmaintainable, urgent refactoring needed |

---

## Why These Weights?

### Nesting Depth (30%) - Highest Weight
- **Hardest to understand**: Requires holding multiple conditions in working memory
- **Hardest to test**: Exponential path complexity
- **Research-backed**: Miller's Law (7±2 items) is well-established

### Function Length (25%) - Second Highest
- **Context switching**: Long functions require scrolling and mental context management
- **Testability**: Harder to write focused tests
- **Easier to fix**: Can be mechanically split

### Naming Clarity (20%) - High Weight
- **First impression**: Bad names make code immediately harder to read
- **Persistent cost**: Every reader pays the price
- **Easy to fix**: Renaming is low-risk

### Parameter Count (15%) - Medium Weight
- **Usability**: Hard to call functions correctly
- **Often fixable**: Can use objects or builder patterns
- **Less common**: Most functions have ≤3 parameters

### Dependencies (10%) - Lowest Weight
- **Context-dependent**: Sometimes high coupling is justified (e.g., framework code)
- **Architectural**: Often requires larger refactoring
- **Less immediate**: Doesn't affect single-function comprehension as much

---

## Avoiding Magic Numbers

Every threshold is based on:
1. **Published research** (Miller's Law, Clean Code principles)
2. **Industry standards** (Google/Airbnb style guides)
3. **Empirical data** (what real codebases look like)

### Configurable Thresholds

Teams can adjust in `.cognitivedebtrc.json`:

```json
{
  "thresholds": {
    "nestingDepth": 3,      // Your team's max acceptable depth
    "functionLength": 50,   // Your team's line limit
    "parameterCount": 4,    // Your team's param limit
    "maxLocalImports": 10   // Your team's coupling limit
  },
  "weights": {
    "nestingDepth": 30,     // % weight (must sum to 100)
    "functionLength": 25,
    "namingClarity": 20,
    "parameterCount": 15,
    "dependencies": 10
  }
}
```

---

## Trade-offs & Design Decisions

### 1. Average vs. Max
- **Nesting/Params**: Use **max** (one bad function is a problem)
- **Function Length**: Use **average** (a few long functions is acceptable)

### 2. Capping at 100
- Prevents one catastrophic function from skewing results
- Makes scores comparable across files

### 3. Linear vs. Exponential Penalties
- **Linear** for most factors (easier to understand)
- Could argue for exponential on nesting (10 levels is >2× worse than 5)
- Chose simplicity over precision

### 4. What's Missing?
- **Cyclomatic complexity**: Correlated with nesting depth
- **Comment density**: Hard to measure quality vs. quantity
- **Code duplication**: Requires cross-file analysis (expensive)

---

## Validation

To validate this scoring system:

1. **Test on known-good code**: Should score 0-20
2. **Test on known-bad code**: Should score 60+
3. **Compare with team consensus**: Do scores match code review feedback?
4. **Iterate**: Adjust weights based on false positives/negatives

---

## Summary

This scoring system prioritizes **transparency** and **education** over precision. Every number has a justification, and teams can adjust based on their context. The goal is not to achieve a perfect score, but to identify code that genuinely increases cognitive burden for maintainers.
