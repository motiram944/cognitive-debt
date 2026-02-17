const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { analyzeDirectory } = require('../index');
const { compareResults } = require('./comparator');
const GitHelper = require('./gitHelper');

/**
 * Orchestrates the Diff process
 * 
 * Supports:
 * - diff base..target (Git refs)
 * - diff path1 path2 (Directories)
 */
async function runDiff(args, options) {
    const projectRoot = process.cwd();
    const git = new GitHelper(projectRoot);

    let baseDir = '';
    let targetDir = '';
    let tempDirs = [];

    try {
        // 1. Resolve Inputs
        if (args.length === 1 && args[0].includes('..')) {
            // Git Ref Mode: "main..feat"
            const [baseRef, targetRef] = args[0].split('..');

            console.log(chalk.blue(`⏳ Exporting ${baseRef} and ${targetRef} for analysis...`));

            if (!git.isValidRef(baseRef) || !git.isValidRef(targetRef)) {
                throw new Error(`Invalid git references: ${baseRef} or ${targetRef}`);
            }

            baseDir = git.exportRefToTemp(baseRef);
            targetDir = git.exportRefToTemp(targetRef);
            tempDirs.push(baseDir, targetDir);

        } else if (args.length === 2) {
            // Directory Mode: "./v1 ./v2"
            baseDir = path.resolve(args[0]);
            targetDir = path.resolve(args[1]);

            if (!fs.existsSync(baseDir) || !fs.existsSync(targetDir)) {
                throw new Error("One or more directories not found.");
            }
        } else {
            throw new Error("Invalid usage. Use 'base..target' or 'dir1 dir2'.");
        }

        // 2. Analyze
        console.log(chalk.dim(`🔍 Analyzing base state...`));
        const baseResultsRaw = analyzeDirectory(baseDir);

        console.log(chalk.dim(`🔍 Analyzing target state...`));
        const targetResultsRaw = analyzeDirectory(targetDir);

        // Normalize paths to be relative ensuring accurate matching
        const normalize = (results, root) => results.map(r => ({
            ...r,
            filePath: path.relative(root, r.filePath)
        }));

        const baseResults = normalize(baseResultsRaw, baseDir);
        const targetResults = normalize(targetResultsRaw, targetDir);

        // 3. Compare
        const diff = compareResults(baseResults, targetResults);

        // 4. Output
        if (options.output && options.output.endsWith('.json')) {
            fs.writeFileSync(options.output, JSON.stringify(diff, null, 2));
            console.log(chalk.green(`Diff report written to ${options.output}`));
        } else {
            printDiffReport(diff);
        }

        return { success: true };

    } catch (error) {
        return { success: false, error: error.message };
    } finally {
        // 5. Cleanup
        tempDirs.forEach(d => git.cleanup(d));
    }
}

function printDiffReport(diff) {
    console.log('\n═══════════════════════════════════════════');
    console.log(` 📉 Cognitive Debt Diff`);
    console.log('═══════════════════════════════════════════\n');

    // Status Headline
    let statusColor = chalk.gray;
    let statusText = "No significant change";

    if (diff.status === 'degraded') {
        statusColor = chalk.red;
        statusText = `⚠️  DEBT INCREASED`;
    } else if (diff.status === 'improved') {
        statusColor = chalk.green;
        statusText = `👏  DEBT DECREASED`;
    }

    console.log(statusColor.bold(`${statusText}\n`));

    // Global Metrics
    console.log(chalk.bold('Global Changes:'));
    if (diff.metrics.loc.delta !== 0) {
        const sign = diff.metrics.loc.delta > 0 ? '+' : '';
        console.log(`- Lines of Code:   ${sign}${diff.metrics.loc.delta}`);
    }
    if (diff.metrics.dependencies.delta !== 0) {
        const sign = diff.metrics.dependencies.delta > 0 ? '+' : '';
        const color = diff.metrics.dependencies.delta > 0 ? chalk.yellow : chalk.green;
        console.log(`- Dependencies:    ${color(`${sign}${diff.metrics.dependencies.delta}`)}`);
    }

    // File Breakdown
    console.log('');
    console.log(chalk.bold('Impacted Files:'));

    if (diff.files.length === 0) {
        console.log(chalk.dim('  None.'));
    }

    // Show top 5 degraded files
    diff.files
        .filter(f => f.deltaScore < 0) // Negative delta means score went DOWN (bad)
        .slice(0, 5)
        .forEach(f => {
            console.log(chalk.red(`  🔴 ${path.basename(f.file)}`));
            f.reasons.forEach(r => console.log(chalk.dim(`     └─ ${r}`)));
        });

    // Show top 5 improved files
    diff.files
        .filter(f => f.deltaScore > 0)
        .slice(0, 5)
        .forEach(f => {
            console.log(chalk.green(`  🟢 ${path.basename(f.file)}`));
            console.log(chalk.dim(`     └─ Improved Score (+${f.deltaScore})`));
        });

    console.log('\n═══════════════════════════════════════════\n');
}

module.exports = { runDiff };
