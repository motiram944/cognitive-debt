const traverse = require('@babel/traverse').default;

/**
 * Analyzes nesting depth in the codebase
 * 
 * Deep nesting (> 3 levels) makes code harder to follow and reason about.
 * It often indicates complex control flow that could be simplified.
 * 
 * @param {Object} ast - Abstract Syntax Tree from Babel parser
 * @param {string} filePath - Path to the file being analyzed
 * @returns {Object} Metrics about nesting depth
 */
function analyze(ast, filePath) {
    const nestingData = [];
    let currentFunction = null;
    let maxDepthInFunction = 0;
    let currentDepth = 0;

    traverse(ast, {
        // Track when we enter a function
        'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod|ObjectMethod': {
            enter(path) {
                // Save previous function context
                const previousFunction = currentFunction;
                const previousMaxDepth = maxDepthInFunction;
                const previousDepth = currentDepth;

                // Start tracking new function
                currentFunction = getFunctionName(path);
                maxDepthInFunction = 0;
                currentDepth = 0;

                // When we exit this function, restore previous context
                path.node._previousContext = {
                    function: previousFunction,
                    maxDepth: previousMaxDepth,
                    depth: previousDepth,
                };
            },
            exit(path) {
                // Record the function's max depth
                if (currentFunction) {
                    nestingData.push({
                        name: currentFunction,
                        line: path.node.loc.start.line,
                        maxDepth: maxDepthInFunction,
                    });
                }

                // Restore previous context
                const context = path.node._previousContext;
                if (context) {
                    currentFunction = context.function;
                    maxDepthInFunction = context.maxDepth;
                    currentDepth = context.depth;
                }
            },
        },

        // Track nesting-inducing statements
        'IfStatement|ForStatement|ForInStatement|ForOfStatement|WhileStatement|DoWhileStatement|SwitchStatement|TryStatement': {
            enter() {
                currentDepth++;
                maxDepthInFunction = Math.max(maxDepthInFunction, currentDepth);
            },
            exit() {
                currentDepth--;
            },
        },
    });

    // Calculate statistics
    const depths = nestingData.map(f => f.maxDepth);
    const avg = depths.length > 0
        ? Math.round((depths.reduce((a, b) => a + b, 0) / depths.length) * 10) / 10
        : 0;
    const max = depths.length > 0 ? Math.max(...depths) : 0;

    // Find deeply nested functions (> 3 levels)
    const deeplyNested = nestingData.filter(f => f.maxDepth > 3);

    return {
        totalFunctions: nestingData.length,
        averageDepth: avg,
        maxDepth: max,
        deeplyNestedFunctions: deeplyNested.map(f => ({
            name: f.name,
            line: f.line,
            depth: f.maxDepth,
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
