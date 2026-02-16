const chalk = require('chalk');

/**
 * Formats analysis results for display
 * Supports both text (human-readable) and JSON formats
 */

/**
 * Format results as human-readable text with colors
 */
function formatText(filePath, metrics, scoreData) {
    const lines = [];

    // Header
    lines.push('');
    lines.push(chalk.bold.cyan('═══════════════════════════════════════════'));
    lines.push(chalk.bold.cyan('    Cognitive Debt Analysis Report'));
    lines.push(chalk.bold.cyan('═══════════════════════════════════════════'));
    lines.push('');

    // File info
    lines.push(chalk.gray('File: ') + chalk.white(filePath));
    lines.push('');

    // Score with color based on grade
    const scoreColor = getScoreColor(scoreData.grade);
    lines.push(chalk.bold('Overall Score: ') + scoreColor(`${scoreData.score}/100`) +
        ` (${scoreColor(scoreData.grade)})`);
    lines.push('');

    // Metrics summary
    lines.push(chalk.bold.underline('Metrics Summary:'));
    lines.push('');

    // Function Length
    const funcLengthIcon = metrics.functionLength.averageLength <= 50 ? '✓' : '⚠';
    const funcLengthColor = metrics.functionLength.averageLength <= 50 ? chalk.green : chalk.yellow;
    lines.push(funcLengthColor(`  ${funcLengthIcon} Function Length:`));
    lines.push(`    Average: ${metrics.functionLength.averageLength} lines`);
    lines.push(`    Maximum: ${metrics.functionLength.maxLength} lines`);
    if (metrics.functionLength.longFunctions.length > 0) {
        lines.push(chalk.yellow(`    ⚠ ${metrics.functionLength.longFunctions.length} function(s) exceed 50 lines`));
    }
    lines.push('');

    // Nesting Depth
    const nestingIcon = metrics.nestingDepth.maxDepth <= 3 ? '✓' : '⚠';
    const nestingColor = metrics.nestingDepth.maxDepth <= 3 ? chalk.green : chalk.yellow;
    lines.push(nestingColor(`  ${nestingIcon} Nesting Depth:`));
    lines.push(`    Average: ${metrics.nestingDepth.averageDepth} levels`);
    lines.push(`    Maximum: ${metrics.nestingDepth.maxDepth} levels`);
    if (metrics.nestingDepth.deeplyNestedFunctions.length > 0) {
        lines.push(chalk.yellow(`    ⚠ ${metrics.nestingDepth.deeplyNestedFunctions.length} function(s) exceed 3 levels`));
    }
    lines.push('');

    // Parameter Count
    const paramsIcon = metrics.parameterCount.averageParams <= 4 ? '✓' : '⚠';
    const paramsColor = metrics.parameterCount.averageParams <= 4 ? chalk.green : chalk.yellow;
    lines.push(paramsColor(`  ${paramsIcon} Parameter Count:`));
    lines.push(`    Average: ${metrics.parameterCount.averageParams} parameters`);
    lines.push(`    Maximum: ${metrics.parameterCount.maxParams} parameters`);
    if (metrics.parameterCount.functionsWithTooManyParams.length > 0) {
        lines.push(chalk.yellow(`    ⚠ ${metrics.parameterCount.functionsWithTooManyParams.length} function(s) exceed 4 parameters`));
    }
    lines.push('');

    // Naming Clarity
    const namingIcon = metrics.namingClarity.unclearPercent <= 10 ? '✓' : '⚠';
    const namingColor = metrics.namingClarity.unclearPercent <= 10 ? chalk.green : chalk.yellow;
    lines.push(namingColor(`  ${namingIcon} Naming Clarity:`));
    lines.push(`    Unclear names: ${metrics.namingClarity.unclearPercent}%`);
    lines.push(`    Total identifiers: ${metrics.namingClarity.totalIdentifiers}`);
    lines.push('');

    // Dependencies
    const depsIcon = metrics.dependencies.localImports <= 10 ? '✓' : '⚠';
    const depsColor = metrics.dependencies.localImports <= 10 ? chalk.green : chalk.yellow;
    lines.push(depsColor(`  ${depsIcon} Dependencies:`));
    lines.push(`    Local imports: ${metrics.dependencies.localImports}`);
    lines.push(`    External imports: ${metrics.dependencies.externalImports}`);
    if (metrics.dependencies.highCoupling) {
        lines.push(chalk.yellow(`    ⚠ High coupling detected (>10 local imports)`));
    }
    lines.push('');

    // Top Issues
    const issues = collectTopIssues(metrics);
    if (issues.length > 0) {
        lines.push(chalk.bold.underline('Top Issues:'));
        lines.push('');
        issues.slice(0, 5).forEach((issue, index) => {
            lines.push(chalk.red(`  ${index + 1}. ${issue.description} (line ${issue.line})`));
        });
        lines.push('');
    }

    // Footer
    lines.push(chalk.bold.cyan('═══════════════════════════════════════════'));
    lines.push('');

    return lines.join('\n');
}

/**
 * Format results as JSON
 */
function formatJSON(filePath, metrics, scoreData) {
    return JSON.stringify({
        file: filePath,
        score: scoreData.score,
        grade: scoreData.grade,
        breakdown: scoreData.breakdown,
        metrics: {
            functionLength: {
                average: metrics.functionLength.averageLength,
                max: metrics.functionLength.maxLength,
                longFunctions: metrics.functionLength.longFunctions,
            },
            nestingDepth: {
                average: metrics.nestingDepth.averageDepth,
                max: metrics.nestingDepth.maxDepth,
                deeplyNestedFunctions: metrics.nestingDepth.deeplyNestedFunctions,
            },
            parameterCount: {
                average: metrics.parameterCount.averageParams,
                max: metrics.parameterCount.maxParams,
                functionsWithTooManyParams: metrics.parameterCount.functionsWithTooManyParams,
            },
            namingClarity: {
                unclearPercent: metrics.namingClarity.unclearPercent,
                totalIdentifiers: metrics.namingClarity.totalIdentifiers,
                unclearNames: metrics.namingClarity.unclearNames,
            },
            dependencies: {
                local: metrics.dependencies.localImports,
                external: metrics.dependencies.externalImports,
                highCoupling: metrics.dependencies.highCoupling,
                localImportsList: metrics.dependencies.localImportsList,
            },
        },
        issues: collectTopIssues(metrics),
    }, null, 2);
}

/**
 * Get color for score based on grade
 */
function getScoreColor(grade) {
    switch (grade) {
        case 'Excellent':
            return chalk.green.bold;
        case 'Good':
            return chalk.blue.bold;
        case 'Fair':
            return chalk.yellow.bold;
        case 'Poor':
            return chalk.red.bold;
        default:
            return chalk.white;
    }
}

/**
 * Collect top issues from all metrics
 */
function collectTopIssues(metrics) {
    const issues = [];

    // Long functions
    metrics.functionLength.longFunctions.forEach(func => {
        issues.push({
            severity: func.length > 100 ? 'high' : 'medium',
            description: `Function '${func.name}' is too long (${func.length} lines)`,
            line: func.line,
            metric: 'functionLength',
        });
    });

    // Deeply nested functions
    metrics.nestingDepth.deeplyNestedFunctions.forEach(func => {
        issues.push({
            severity: func.depth > 5 ? 'high' : 'medium',
            description: `Function '${func.name}' has deep nesting (${func.depth} levels)`,
            line: func.line,
            metric: 'nestingDepth',
        });
    });

    // Too many parameters
    metrics.parameterCount.functionsWithTooManyParams.forEach(func => {
        issues.push({
            severity: func.paramCount > 6 ? 'high' : 'medium',
            description: `Function '${func.name}' has too many parameters (${func.paramCount})`,
            line: func.line,
            metric: 'parameterCount',
        });
    });

    // Unclear names
    metrics.namingClarity.unclearNames.forEach(name => {
        issues.push({
            severity: 'low',
            description: `${name.type} '${name.name}' has unclear name: ${name.reason}`,
            line: name.line,
            metric: 'namingClarity',
        });
    });

    // Sort by severity (high > medium > low) and limit
    const severityOrder = { high: 0, medium: 1, low: 2 };
    issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return issues;
}

module.exports = {
    formatText,
    formatJSON,
};
