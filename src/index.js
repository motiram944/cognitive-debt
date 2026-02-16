const { parseFile } = require('./parser/astParser');
const functionLengthAnalyzer = require('./analyzers/functionLength');
const nestingDepthAnalyzer = require('./analyzers/nestingDepth');
const parameterCountAnalyzer = require('./analyzers/parameterCount');
const namingClarityAnalyzer = require('./analyzers/namingClarity');
const dependenciesAnalyzer = require('./analyzers/dependencies');
const { calculateScore } = require('./scoring/calculator');
const { formatText, formatJSON } = require('./reporter/formatter');
const fs = require('fs');
const path = require('path');

/**
 * Main orchestrator for cognitive debt analysis
 * 
 * This is the core entry point that coordinates all analyzers,
 * calculates the score, and formats the output.
 */

/**
 * Analyze a single file
 * 
 * @param {string} filePath - Path to the file to analyze
 * @param {Object} options - Analysis options
 * @returns {Object} Analysis results
 */
function analyzeFile(filePath, options = {}) {
    const { format = 'text', config = null } = options;

    try {
        // Step 1: Parse the file into AST
        const ast = parseFile(filePath);

        // Step 2: Run all analyzers
        const metrics = {
            functionLength: functionLengthAnalyzer.analyze(ast, filePath),
            nestingDepth: nestingDepthAnalyzer.analyze(ast, filePath),
            parameterCount: parameterCountAnalyzer.analyze(ast, filePath),
            namingClarity: namingClarityAnalyzer.analyze(ast, filePath),
            dependencies: dependenciesAnalyzer.analyze(ast, filePath),
        };

        // Step 3: Calculate cognitive debt score
        const scoreData = calculateScore(metrics, config);

        // Step 4: Format output
        const output = format === 'json'
            ? formatJSON(filePath, metrics, scoreData)
            : formatText(filePath, metrics, scoreData);

        return {
            success: true,
            output,
            scoreData,
            metrics,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            filePath,
        };
    }
}

/**
 * Analyze a directory (all .js and .ts files)
 * 
 * @param {string} dirPath - Path to the directory
 * @param {Object} options - Analysis options
 * @returns {Array} Array of analysis results
 */
function analyzeDirectory(dirPath, options = {}) {
    const files = findJavaScriptFiles(dirPath);
    const results = [];

    for (const file of files) {
        const result = analyzeFile(file, options);
        results.push(result);
    }

    return results;
}

/**
 * Recursively find all JavaScript/TypeScript files in a directory
 */
function findJavaScriptFiles(dirPath, fileList = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules and hidden directories
            if (file !== 'node_modules' && !file.startsWith('.')) {
                findJavaScriptFiles(filePath, fileList);
            }
        } else if (stat.isFile()) {
            // Include .js, .jsx, .ts, .tsx files
            if (/\.(js|jsx|ts|tsx)$/.test(file)) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

module.exports = {
    analyzeFile,
    analyzeDirectory,
};
