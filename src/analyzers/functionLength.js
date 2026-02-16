const traverse = require('@babel/traverse').default;

/**
 * Analyzes function length in the codebase
 * 
 * Long functions are harder to understand, test, and maintain.
 * Industry best practices suggest keeping functions under 50 lines.
 * 
 * @param {Object} ast - Abstract Syntax Tree from Babel parser
 * @param {string} filePath - Path to the file being analyzed
 * @returns {Object} Metrics about function lengths
 */
function analyze(ast, filePath) {
    const functions = [];

    // Traverse AST and find all function-like nodes
    traverse(ast, {
        // Regular function declarations: function foo() {}
        FunctionDeclaration(path) {
            analyzeFunctionNode(path, functions);
        },

        // Function expressions: const foo = function() {}
        FunctionExpression(path) {
            analyzeFunctionNode(path, functions);
        },

        // Arrow functions: const foo = () => {}
        ArrowFunctionExpression(path) {
            analyzeFunctionNode(path, functions);
        },

        // Class methods: class Foo { bar() {} }
        ClassMethod(path) {
            analyzeFunctionNode(path, functions);
        },

        // Object methods: { foo() {} }
        ObjectMethod(path) {
            analyzeFunctionNode(path, functions);
        },
    });

    // Calculate statistics
    const lengths = functions.map(f => f.length);
    const avg = lengths.length > 0
        ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
        : 0;
    const max = lengths.length > 0 ? Math.max(...lengths) : 0;

    // Find problematic functions (> 50 lines)
    const longFunctions = functions.filter(f => f.length > 50);

    return {
        totalFunctions: functions.length,
        averageLength: avg,
        maxLength: max,
        longFunctions: longFunctions.map(f => ({
            name: f.name,
            line: f.line,
            length: f.length,
        })),
    };
}

/**
 * Helper function to extract function metrics from an AST node
 */
function analyzeFunctionNode(path, functions) {
    const node = path.node;

    // Calculate line count
    const startLine = node.loc.start.line;
    const endLine = node.loc.end.line;
    const length = endLine - startLine + 1;

    // Get function name (or 'anonymous' if unnamed)
    let name = 'anonymous';
    if (node.id && node.id.name) {
        // Named function: function foo() {}
        name = node.id.name;
    } else if (path.parent.type === 'VariableDeclarator' && path.parent.id) {
        // Variable assignment: const foo = () => {}
        name = path.parent.id.name;
    } else if (path.parent.type === 'Property' && path.parent.key) {
        // Object method: { foo: () => {} }
        name = path.parent.key.name || path.parent.key.value;
    } else if (node.key) {
        // Class method or object method: class { foo() {} }
        name = node.key.name || node.key.value;
    }

    functions.push({
        name,
        line: startLine,
        length,
    });
}

module.exports = { analyze };
