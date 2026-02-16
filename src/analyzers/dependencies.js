const traverse = require('@babel/traverse').default;

/**
 * Analyzes cross-file dependencies
 * 
 * High coupling (many imports) makes code harder to modify and test in isolation.
 * This analyzer tracks:
 * - Local imports (from the same project)
 * - External imports (from node_modules)
 * 
 * Files with > 10 local imports may indicate tight coupling.
 * 
 * @param {Object} ast - Abstract Syntax Tree from Babel parser
 * @param {string} filePath - Path to the file being analyzed
 * @returns {Object} Metrics about dependencies
 */
function analyze(ast, filePath) {
    const localImports = [];
    const externalImports = [];

    traverse(ast, {
        // ES6 imports: import foo from 'bar'
        ImportDeclaration(path) {
            const source = path.node.source.value;
            const line = path.node.loc.start.line;

            if (isLocalImport(source)) {
                localImports.push({
                    source,
                    line,
                });
            } else {
                externalImports.push({
                    source,
                    line,
                });
            }
        },

        // CommonJS requires: const foo = require('bar')
        CallExpression(path) {
            const node = path.node;

            // Check if it's a require() call
            if (node.callee.type === 'Identifier' &&
                node.callee.name === 'require' &&
                node.arguments.length > 0 &&
                node.arguments[0].type === 'StringLiteral') {

                const source = node.arguments[0].value;
                const line = node.loc.start.line;

                if (isLocalImport(source)) {
                    localImports.push({
                        source,
                        line,
                    });
                } else {
                    externalImports.push({
                        source,
                        line,
                    });
                }
            }
        },
    });

    // Calculate statistics
    const totalImports = localImports.length + externalImports.length;
    const highCoupling = localImports.length > 10;

    return {
        totalImports,
        localImports: localImports.length,
        externalImports: externalImports.length,
        highCoupling,
        localImportsList: localImports.map(imp => ({
            source: imp.source,
            line: imp.line,
        })),
    };
}

/**
 * Determines if an import is local (from the project) or external (from node_modules)
 */
function isLocalImport(source) {
    // Local imports start with './' or '../'
    return source.startsWith('./') || source.startsWith('../');
}

module.exports = { analyze };
