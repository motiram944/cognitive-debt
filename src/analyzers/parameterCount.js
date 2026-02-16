const traverse = require('@babel/traverse').default;

/**
 * Analyzes function parameter counts
 * 
 * Functions with many parameters (> 4) are harder to call correctly,
 * test thoroughly, and understand. They often indicate the function
 * is doing too much or needs refactoring to use objects/config.
 * 
 * @param {Object} ast - Abstract Syntax Tree from Babel parser
 * @param {string} filePath - Path to the file being analyzed
 * @returns {Object} Metrics about parameter counts
 */
function analyze(ast, filePath) {
    const functions = [];

    traverse(ast, {
        'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod|ObjectMethod'(path) {
            const node = path.node;
            const name = getFunctionName(path);
            const paramCount = node.params.length;

            functions.push({
                name,
                line: node.loc.start.line,
                paramCount,
            });
        },
    });

    // Calculate statistics
    const counts = functions.map(f => f.paramCount);
    const avg = counts.length > 0
        ? Math.round((counts.reduce((a, b) => a + b, 0) / counts.length) * 10) / 10
        : 0;
    const max = counts.length > 0 ? Math.max(...counts) : 0;

    // Find functions with too many parameters (> 4)
    const tooManyParams = functions.filter(f => f.paramCount > 4);

    return {
        totalFunctions: functions.length,
        averageParams: avg,
        maxParams: max,
        functionsWithTooManyParams: tooManyParams.map(f => ({
            name: f.name,
            line: f.line,
            paramCount: f.paramCount,
        })),
    };
}

/**
 * Helper function to get function name from AST node
 */
function getFunctionName(path) {
    const node = path.node;

    if (node.id && node.id.name) {
        return node.id.name;
    } else if (path.parent.type === 'VariableDeclarator' && path.parent.id) {
        return path.parent.id.name;
    } else if (path.parent.type === 'Property' && path.parent.key) {
        return path.parent.key.name || path.parent.key.value;
    } else if (node.key) {
        return node.key.name || node.key.value;
    }

    return 'anonymous';
}

module.exports = { analyze };
