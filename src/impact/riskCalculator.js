/**
 * Calculator for Change Impact Risk
 * 
 * Logic:
 * Risk = f(Cognitive Debt Score, Fan-In Dependencies)
 * 
 * - High Debt + High Fan-In = CRITICAL RISK
 * - Low Debt + High Fan-In = HIGH RISK (Fragile)
 * - High Debt + Low Fan-In = MEDIUM RISK (Contained mess)
 * - Low Debt + Low Fan-In = LOW RISK
 */

function calculateRisk(score, fanIn, metrics) {
    let riskLevel = 'Low';
    let reasons = [];
    let suggestion = '';

    // 1. Determine Risk Level & Primary Reasons
    if (fanIn > 5) {
        if (score < 50) {
            riskLevel = 'Critical';
            reasons.push(`Used by ${fanIn} other modules`);
            reasons.push(`High cognitive debt (${score}/100)`);
        } else {
            riskLevel = 'High';
            reasons.push(`Used by ${fanIn} other modules`);
        }
    } else if (fanIn > 2) {
        if (score < 40) {
            riskLevel = 'High';
            reasons.push(`Complex code (Score: ${score})`);
            reasons.push(`Used by ${fanIn} consumers`);
        } else {
            riskLevel = 'Medium';
            reasons.push(`Moderate usage (${fanIn} files)`);
        }
    } else {
        if (score < 30) {
            riskLevel = 'Medium';
            reasons.push(`High cognitive debt (Score: ${score})`);
            reasons.push(`Hard to verify safely`);
        } else if (score < 50) {
            riskLevel = 'Low';
            reasons.push(`Localized complexity`);
        } else {
            riskLevel = 'Low';
            reasons.push(`Isolated and readable`);
        }
    }

    // 2. Add Specific "Why" Reasons based on Metrics
    if (metrics.nestingDepth && metrics.nestingDepth.max > 4) {
        reasons.push(`Deeply nested logic (Level ${metrics.nestingDepth.max})`);
    }
    if (metrics.parameterCount && metrics.parameterCount.max > 4) {
        reasons.push(`Complex function signatures (>4 params)`);
    }
    if (metrics.dependencies && metrics.dependencies.highCoupling) {
        reasons.push(`High external coupling`);
    }

    // 3. Predict "Likely Impact"
    let likelyImpacts = [];

    if (fanIn > 0) {
        likelyImpacts.push("Dependent module stability");
        likelyImpacts.push("Integration test pipelines");
    }

    if (metrics.nestingDepth && metrics.nestingDepth.max > 3) {
        likelyImpacts.push("Edge case handling");
        likelyImpacts.push("Logic flow correctness");
    }

    if (metrics.parameterCount && metrics.parameterCount.max > 3) {
        likelyImpacts.push("API contract compatibility");
    }

    if (score < 50) {
        likelyImpacts.push("Future refactoring difficulty");
        likelyImpacts.push("Bug fix time overlap");
    }

    if (likelyImpacts.length === 0) {
        likelyImpacts.push("Local functionality only");
    }

    // Deduplicate and limit
    likelyImpacts = [...new Set(likelyImpacts)].slice(0, 4);


    // 4. Generate Actionable Suggestion
    // Prioritize specific issues over generic risk levels
    if (metrics.nestingDepth && metrics.nestingDepth.max > 4) {
        suggestion = "Refactor deeply nested logic into smaller helper functions to reduce complexity.";
    } else if (metrics.dependencies && metrics.dependencies.highCoupling) {
        suggestion = "Mock external dependencies carefully; this file is tightly coupled.";
    } else if (metrics.parameterCount && metrics.parameterCount.max > 4) {
        suggestion = "Consider using an object parameter to simplify function signatures.";
    } else if (riskLevel === 'Critical') {
        suggestion = "Start by writing integration tests for dependent files before touching this code.";
    } else if (riskLevel === 'High') {
        suggestion = "Check all call sites for compatibility before merging. Regression risk is high.";
    } else if (riskLevel === 'Medium') {
        suggestion = "Add unit tests for edge cases, as this file has moderate complexity.";
    } else {
        suggestion = "Standard unit testing should be sufficient.";
    }

    return {
        level: riskLevel,
        reasons,
        likelyImpacts,
        suggestion
    };
}

module.exports = { calculateRisk };
