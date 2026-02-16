const traverse = require('@babel/traverse').default;

/**
 * Analyzes naming clarity in the codebase
 * 
 * Clear, descriptive names make code self-documenting and easier to understand.
 * This analyzer flags:
 * - Single-letter names (except i, j, k in loops)
 * - All lowercase without separators (e.g., 'userdata' vs 'userData')
 * - Common abbreviations without context (e.g., 'usr', 'btn', 'tmp')
 * 
 * @param {Object} ast - Abstract Syntax Tree from Babel parser
 * @param {string} filePath - Path to the file being analyzed
 * @returns {Object} Metrics about naming clarity
 */
function analyze(ast, filePath) {
    const identifiers = [];
    const unclearNames = [];

    traverse(ast, {
        // Analyze variable declarations
        VariableDeclarator(path) {
            if (path.node.id.type === 'Identifier') {
                const name = path.node.id.name;
                const line = path.node.loc.start.line;

                identifiers.push(name);

                if (isUnclear(name, path)) {
                    unclearNames.push({
                        name,
                        line,
                        type: 'variable',
                        reason: getUnclearReason(name, path),
                    });
                }
            }
        },

        // Analyze function names
        FunctionDeclaration(path) {
            if (path.node.id) {
                const name = path.node.id.name;
                const line = path.node.loc.start.line;

                identifiers.push(name);

                if (isUnclear(name, path)) {
                    unclearNames.push({
                        name,
                        line,
                        type: 'function',
                        reason: getUnclearReason(name, path),
                    });
                }
            }
        },

        // Analyze function parameters
        'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression'(path) {
            path.node.params.forEach(param => {
                if (param.type === 'Identifier') {
                    const name = param.name;
                    const line = param.loc.start.line;

                    identifiers.push(name);

                    if (isUnclear(name, path)) {
                        unclearNames.push({
                            name,
                            line,
                            type: 'parameter',
                            reason: getUnclearReason(name, path),
                        });
                    }
                }
            });
        },
    });

    // Calculate statistics
    const unclearPercent = identifiers.length > 0
        ? Math.round((unclearNames.length / identifiers.length) * 100)
        : 0;

    return {
        totalIdentifiers: identifiers.length,
        unclearCount: unclearNames.length,
        unclearPercent,
        unclearNames: unclearNames.slice(0, 10), // Limit to top 10 for readability
    };
}

/**
 * Determines if a name is unclear
 */
function isUnclear(name, path) {
    // Allow common short names in specific contexts
    if (isAllowedShortName(name, path)) {
        return false;
    }

    // Single letter (except allowed ones)
    if (name.length === 1) {
        return true;
    }

    // All lowercase without separators and > 8 chars (e.g., 'userdata')
    if (/^[a-z]{9,}$/.test(name)) {
        return true;
    }

    // Common unclear abbreviations
    const unclearAbbreviations = [
        'tmp', 'temp', 'usr', 'btn', 'str', 'num', 'obj', 'arr',
        'val', 'res', 'req', 'ctx', 'cfg', 'mgr', 'svc', 'util',
    ];

    if (unclearAbbreviations.includes(name.toLowerCase())) {
        return true;
    }

    return false;
}

/**
 * Checks if a short name is allowed in context
 */
function isAllowedShortName(name, path) {
    // Allow i, j, k in for loops
    if (['i', 'j', 'k'].includes(name)) {
        let parent = path.parent;
        while (parent) {
            if (parent.type === 'ForStatement' ||
                parent.type === 'ForInStatement' ||
                parent.type === 'ForOfStatement') {
                return true;
            }
            parent = parent.parent;
        }
    }

    // Allow common single-letter names in specific contexts
    // e.g., 'x' and 'y' for coordinates, 'e' for events
    if (['e', 'x', 'y'].includes(name)) {
        // This is a simplified check - in production, you might want more context
        return true;
    }

    return false;
}

/**
 * Gets the reason why a name is unclear
 */
function getUnclearReason(name, path) {
    if (name.length === 1 && !isAllowedShortName(name, path)) {
        return 'Single letter name';
    }

    if (/^[a-z]{9,}$/.test(name)) {
        return 'Long lowercase name without separators';
    }

    return 'Unclear abbreviation';
}

module.exports = { analyze };
