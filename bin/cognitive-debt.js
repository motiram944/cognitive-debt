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
    .option('-f, --format <type>', 'Output format: text or json', 'text')
    .option('-c, --config <path>', 'Path to custom configuration file')
    .action((targetPath, options) => {
        // Validate path exists
        if (!fs.existsSync(targetPath)) {
            console.error(`Error: Path not found: ${targetPath}`);
            process.exit(1);
        }

        // Validate format
        if (!['text', 'json'].includes(options.format)) {
            console.error(`Error: Invalid format '${options.format}'. Use 'text' or 'json'.`);
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
        const analysisOptions = {
            format: options.format,
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

// Parse command-line arguments
program.parse();
