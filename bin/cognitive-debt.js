#!/usr/bin/env node

/**
 * Cognitive Debt CLI
 * 
 * Command-line interface for analyzing JavaScript/TypeScript code
 * and calculating Cognitive Debt scores.
 * 
 * Usage:
 *   cognitive-debt <file-or-directory> [options]
 * 
 * Options:
 *   --format <type>    Output format: 'text' or 'json' (default: text)
 *   --config <path>    Path to custom config file
 *   -h, --help         Show help
 *   -v, --version      Show version
 */

const { Command } = require('commander');
const { analyzeFile, analyzeDirectory } = require('../src/index');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

// Create CLI program
const program = new Command();

program
    .name('cognitive-debt')
    .description('Analyze JavaScript/TypeScript code and calculate Cognitive Debt scores')
    .version(packageJson.version)
    .argument('<path>', 'File or directory to analyze')
    .option('-f, --format <type>', 'Output format: text, json, or html', 'text')
    .option('-c, --config <path>', 'Path to custom configuration file')
    .option('-o, --output <path>', 'Write report to file (html or json)')
    .action((targetPath, options) => {
        // Validate path exists
        if (!fs.existsSync(targetPath)) {
            console.error(`Error: Path not found: ${targetPath}`);
            process.exit(1);
        }

        // Validate format
        if (!['text', 'json', 'html'].includes(options.format)) {
            console.error(`Error: Invalid format '${options.format}'. Use 'text', 'json', or 'html'.`);
            process.exit(1);
        }

        // Load custom config if provided
        let config = null;
        if (options.config) {
            if (!fs.existsSync(options.config)) {
                console.error(`Error: Config file not found: ${options.config}`);
                process.exit(1);
            }
            try {
                config = JSON.parse(fs.readFileSync(options.config, 'utf-8'));
            } catch (error) {
                console.error(`Error: Failed to parse config file: ${error.message}`);
                process.exit(1);
            }
        }

        // Check if path is file or directory
        const stat = fs.statSync(targetPath);
        // Determine format based on output file if present
        let format = options.format;
        if (options.output) {
            const ext = path.extname(options.output).toLowerCase();
            if (ext === '.json') {
                format = 'json';
            }
        }

        const analysisOptions = {
            format: format,
            config,
        };

        if (stat.isFile()) {
            // Analyze single file
            const result = analyzeFile(targetPath, analysisOptions);

            if (result.success) {
                console.log(result.output);
                // Exit with code based on score (fail if Poor)
                process.exit(result.scoreData.grade === 'Poor' ? 1 : 0);
            } else {
                console.error(`Error analyzing ${targetPath}: ${result.error}`);
                process.exit(1);
            }
        } else if (stat.isDirectory()) {
            // Analyze directory
            const results = analyzeDirectory(targetPath, analysisOptions);
            const { formatText, formatJSON, formatHTML } = require('../src/reporter/formatter');

            // Handle file output if specified
            if (options.output) {
                let content = '';
                const ext = path.extname(options.output).toLowerCase();

                // Determine format based on extension or flag
                const isHtml = ext === '.html' || options.format === 'html';
                const isJson = ext === '.json' || options.format === 'json';

                if (isHtml) {
                    content = formatHTML(results);
                } else if (isJson) {
                    // Extract data for JSON
                    const data = results.map(r => r.success ? JSON.parse(r.output) : { file: r.filePath, error: r.error });
                    content = JSON.stringify(data, null, 2);
                } else {
                    // Default to text
                    // This logic is simplified for text output to file
                    let totalScore = 0;
                    let fileCount = 0;

                    const lines = [];
                    results.forEach(result => {
                        if (result.success) {
                            lines.push(result.output);
                            totalScore += result.scoreData.score;
                            fileCount++;
                        }
                    });
                    if (fileCount > 0) {
                        const avgScore = Math.round(totalScore / fileCount);
                        lines.push('\n═══════════════════════════════════════════');
                        lines.push(`Summary: Analyzed ${fileCount} files. Avg Score: ${avgScore}/100`);
                        lines.push('═══════════════════════════════════════════\n');
                    }
                    content = lines.join('\n');
                }

                try {
                    fs.writeFileSync(options.output, content);
                    console.log(`Report written to ${options.output}`);
                    process.exit(0);
                } catch (err) {
                    console.error(`Error writing report: ${err.message}`);
                    process.exit(1);
                }
            }

            // Standard stdout output (no file)
            if (options.format === 'json') {
                // Output all results as JSON array
                const jsonResults = results.map(r => {
                    if (r.success) {
                        return JSON.parse(r.output);
                    } else {
                        return {
                            file: r.filePath,
                            error: r.error,
                        };
                    }
                });
                console.log(JSON.stringify(jsonResults, null, 2));
            } else {
                // Output text summary
                let totalScore = 0;
                let fileCount = 0;
                let poorFiles = [];

                results.forEach(result => {
                    if (result.success) {
                        console.log(result.output);
                        totalScore += result.scoreData.score;
                        fileCount++;

                        if (result.scoreData.grade === 'Poor') {
                            poorFiles.push(result.scoreData);
                        }
                    } else {
                        console.error(`Error analyzing ${result.filePath}: ${result.error}`);
                    }
                });

                // Print summary
                if (fileCount > 0) {
                    const avgScore = Math.round(totalScore / fileCount);
                    console.log('\n═══════════════════════════════════════════');
                    console.log('Summary');
                    console.log('═══════════════════════════════════════════');
                    console.log(`Files analyzed: ${fileCount}`);
                    console.log(`Average score: ${avgScore}/100`);
                    console.log(`Files with poor scores: ${poorFiles.length}`);
                    console.log('═══════════════════════════════════════════\n');

                    // Exit with error if any files have poor scores
                    process.exit(poorFiles.length > 0 ? 1 : 0);
                }
            }
        }
    });

const { analyzeChangeImpact } = require('../src/impact/index');

// ... existing code ...

program
    .command('impact')
    .description('Forecast the risk of changing a specific file')
    .argument('<file>', 'File path to analyze')
    .action((file) => {
        if (!fs.existsSync(file)) {
            console.error(`Error: File not found: ${file}`);
            process.exit(1);
        }

        const result = analyzeChangeImpact(file);
        if (result.success) {
            console.log(result.output);
        } else {
            console.error(`Error: ${result.error}`);
            process.exit(1);
        }
    });

const { runDiff } = require('../src/diff/index');

// ... existing code ...

program
    .command('diff')
    .description('Compare cognitive debt between two states (git refs or directories)')
    .argument('<base..target>', 'Git range (main..HEAD) or base directory')
    .argument('[target]', 'Target directory (if using dir mode)')
    .option('-o, --output <path>', 'Write diff report to json file')
    .action(async (base, target, options) => {
        // Normalize args
        const args = target ? [base, target] : [base];

        const result = await runDiff(args, options);
        if (!result.success) {
            console.error(chalk.red(`Error: ${result.error}`));
            process.exit(1);
        }
    });

// Parse command-line arguments
program.parse();
