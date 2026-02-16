const fs = require('fs');
const path = require('path');

/**
 * Calculates the Cognitive Debt score based on all analyzer metrics
 * 
 * Score ranges from 0-100:
 * - 80-100: Excellent (low cognitive debt)
 * - 60-79: Good (manageable debt)
 * - 40-59: Fair (needs attention)
 * - 0-39: Poor (high cognitive debt)
 * 
 * @param {Object} metrics - Combined metrics from all analyzers
 * @param {Object} config - Configuration with thresholds and weights
 * @returns {Object} Score and detailed breakdown
 */
function calculateScore(metrics, config = null) {
    // Load default config if not provided
    if (!config) {
        const configPath = path.join(__dirname, '../../config/defaults.json');
        config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }

    const { thresholds, weights } = config;

    // Calculate individual penalties (0 = no penalty, higher = worse)
    const penalties = {
        functionLength: calculateFunctionLengthPenalty(metrics.functionLength, thresholds, weights),
        nestingDepth: calculateNestingDepthPenalty(metrics.nestingDepth, thresholds, weights),
        parameterCount: calculateParameterCountPenalty(metrics.parameterCount, thresholds, weights),
        namingClarity: calculateNamingClarityPenalty(metrics.namingClarity, thresholds, weights),
        dependencies: calculateDependenciesPenalty(metrics.dependencies, thresholds, weights),
    };

    // Sum all penalties
    const totalPenalty = Object.values(penalties).reduce((sum, penalty) => sum + penalty, 0);

    // Calculate final score (100 - penalties, clamped to 0-100)
    const score = Math.max(0, Math.min(100, 100 - totalPenalty));

    // Determine grade
    const grade = getGrade(score, config.grades);

    return {
        score: Math.round(score),
        grade,
        penalties,
        breakdown: {
            functionLength: {
                score: Math.max(0, 100 - penalties.functionLength),
                penalty: Math.round(penalties.functionLength),
            },
            nestingDepth: {
                score: Math.max(0, 100 - penalties.nestingDepth),
                penalty: Math.round(penalties.nestingDepth),
            },
            parameterCount: {
                score: Math.max(0, 100 - penalties.parameterCount),
                penalty: Math.round(penalties.parameterCount),
            },
            namingClarity: {
                score: Math.max(0, 100 - penalties.namingClarity),
                penalty: Math.round(penalties.namingClarity),
            },
            dependencies: {
                score: Math.max(0, 100 - penalties.dependencies),
                penalty: Math.round(penalties.dependencies),
            },
        },
    };
}

/**
 * Calculate penalty for function length
 * Penalty increases as average length exceeds threshold
 */
function calculateFunctionLengthPenalty(metrics, thresholds, weights) {
    if (!metrics || metrics.totalFunctions === 0) return 0;

    const avgLength = metrics.averageLength;
    const threshold = thresholds.functionLength;
    const weight = weights.functionLength;

    // No penalty if under threshold
    if (avgLength <= threshold) return 0;

    // Penalty = (excess over threshold) * weight
    return (avgLength - threshold) * weight;
}

/**
 * Calculate penalty for nesting depth
 * Penalty increases significantly with deeper nesting
 */
function calculateNestingDepthPenalty(metrics, thresholds, weights) {
    if (!metrics || metrics.totalFunctions === 0) return 0;

    const maxDepth = metrics.maxDepth;
    const threshold = thresholds.nestingDepth;
    const weight = weights.nestingDepth;

    // No penalty if under threshold
    if (maxDepth <= threshold) return 0;

    // Penalty = (excess over threshold) * weight
    return (maxDepth - threshold) * weight;
}

/**
 * Calculate penalty for parameter count
 * Penalty increases with more parameters
 */
function calculateParameterCountPenalty(metrics, thresholds, weights) {
    if (!metrics || metrics.totalFunctions === 0) return 0;

    const avgParams = metrics.averageParams;
    const threshold = thresholds.parameterCount;
    const weight = weights.parameterCount;

    // No penalty if under threshold
    if (avgParams <= threshold) return 0;

    // Penalty = (excess over threshold) * weight
    return (avgParams - threshold) * weight;
}

/**
 * Calculate penalty for naming clarity
 * Penalty based on percentage of unclear names
 */
function calculateNamingClarityPenalty(metrics, thresholds, weights) {
    if (!metrics || metrics.totalIdentifiers === 0) return 0;

    const unclearPercent = metrics.unclearPercent;
    const weight = weights.namingClarity;

    // Penalty = (percentage of unclear names / 100) * weight
    // This gives a 0-weight penalty range
    return (unclearPercent / 100) * weight;
}

/**
 * Calculate penalty for dependencies
 * Penalty increases with more local imports (coupling)
 */
function calculateDependenciesPenalty(metrics, thresholds, weights) {
    if (!metrics) return 0;

    const localImports = metrics.localImports;
    const threshold = thresholds.maxLocalImports;
    const weight = weights.dependencies;

    // No penalty if under threshold
    if (localImports <= threshold) return 0;

    // Penalty = (excess over threshold) * weight
    return (localImports - threshold) * weight;
}

/**
 * Determine grade based on score
 */
function getGrade(score, grades) {
    if (score >= grades.excellent) return 'Excellent';
    if (score >= grades.good) return 'Good';
    if (score >= grades.fair) return 'Fair';
    return 'Poor';
}

module.exports = { calculateScore };
