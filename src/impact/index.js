const { analyzeFile } = require('../index');
const { scanProjectForDependents } = require('./projectScanner');
const { calculateRisk } = require('./riskCalculator');
const path = require('path');
const chalk = require('chalk');

/**
 * Entry point for Change Impact Analysis
 */
function analyzeChangeImpact(filePath) {
    const absolutePath = path.resolve(filePath);
    const projectRoot = process.cwd();

    // 1. Analyze target file for Cognitive Debt
    const analysis = analyzeFile(absolutePath);
    if (!analysis.success) {
        return {
            success: false,
            error: analysis.error
        };
    }

    // 2. Scan for dependents (Fan-In)
    const dependencyData = scanProjectForDependents(absolutePath, projectRoot);

    // 3. Calculate Risk
    const risk = calculateRisk(
        analysis.scoreData.score,
        dependencyData.fanIn,
        analysis.metrics
    );

    // 4. Format Output
    const relativePath = path.relative(projectRoot, absolutePath);
    const output = formatImpactReport(relativePath, analysis.scoreData, dependencyData, risk);

    return {
        success: true,
        output
    };
}

function formatImpactReport(file, scoreData, depData, risk) {
    const lines = [];

    // Header
    lines.push('\n═══════════════════════════════════════════');
    lines.push(` 🔮 Change Impact Forecast`);
    lines.push('═══════════════════════════════════════════\n');

    lines.push(`Target: ${chalk.bold(file)}`);

    // Risk Level Badge
    let riskBadge = '';
    switch (risk.level) {
        case 'Critical': riskBadge = chalk.bgRed.white.bold(' CRITICAL RISK '); break;
        case 'High': riskBadge = chalk.red.bold('🔴 High Risk'); break;
        case 'Medium': riskBadge = chalk.yellow.bold('🟡 Medium Risk'); break;
        case 'Low': riskBadge = chalk.green.bold('🟢 Low Risk'); break;
    }
    lines.push(`Risk Level: ${riskBadge}\n`);

    // Context Stats
    lines.push(chalk.dim(' Context:'));
    const scoreColor = getScoreColor(scoreData.score);
    lines.push(`  • Cognitive Score: ${scoreColor(`${scoreData.score}/100`)} (${scoreData.grade})`);
    lines.push(`  • Dependents:      ${depData.fanIn} files rely on this`);
    if (depData.fanIn > 0 && depData.fanIn <= 5) {
        depData.dependents.forEach(d => lines.push(chalk.dim(`      └─ ${path.relative(process.cwd(), d)}`)));
    } else if (depData.fanIn > 5) {
        lines.push(chalk.dim(`      (and ${depData.fanIn} others...)`));
    }
    lines.push('');

    // Why?
    lines.push(chalk.bold('Why?'));
    risk.reasons.forEach(r => lines.push(`  • ${r}`));
    lines.push('');

    // Suggestion
    lines.push(chalk.bold('💡 Suggestion:'));
    lines.push(`  ${chalk.cyan(risk.suggestion)}`);

    lines.push('\n═══════════════════════════════════════════\n');

    return lines.join('\n');
}

function getScoreColor(score) {
    if (score >= 80) return chalk.green;
    if (score >= 60) return chalk.blue;
    if (score >= 40) return chalk.yellow;
    return chalk.red;
}

module.exports = { analyzeChangeImpact };
