const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

/**
 * Scans the project to find files that import the target file.
 * Returns the "Fan-In" count and list of dependent files.
 */
function scanProjectForDependents(targetFile, projectRoot) {
    const dependents = [];
    const targetBaseName = path.basename(targetFile, path.extname(targetFile));

    // Normalize target path for comparison
    const absTarget = path.resolve(targetFile);

    // Recursive file walker
    function walkDir(dir) {
        if (dir.includes('node_modules') || dir.includes('.git')) return;

        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                walkDir(filePath);
            } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
                checkDependency(filePath, absTarget, targetBaseName);
            }
        }
    }

    function checkDependency(currentFile, targetFile, targetBase) {
        // Skip self
        if (currentFile === targetFile) return;

        try {
            const code = fs.readFileSync(currentFile, 'utf-8');

            // Optimization: Skip parsing if target name isn't even in the file content
            // accurate enough for a quick scan
            if (!code.includes(targetBase) && !code.includes(path.basename(targetFile))) {
                return;
            }

            const ast = parser.parse(code, {
                sourceType: 'module',
                plugins: ['jsx', 'typescript', 'classProperties']
            });

            let depends = false;

            traverse(ast, {
                // Import Declaration: import x from './target'
                ImportDeclaration(path) {
                    if (resolveImport(path.node.source.value, currentFile, targetFile)) {
                        depends = true;
                        path.stop();
                    }
                },
                // Require Call: require('./target')
                CallExpression(path) {
                    if (path.node.callee.name === 'require' &&
                        path.node.arguments.length > 0 &&
                        path.node.arguments[0].type === 'StringLiteral') {

                        if (resolveImport(path.node.arguments[0].value, currentFile, targetFile)) {
                            depends = true;
                            path.stop();
                        }
                    }
                }
            });

            if (depends) {
                dependents.push(currentFile);
            }
        } catch (err) {
            // Ignore parse errors (tolerant)
        }
    }

    // Resolves relative import path to absolute and compares with target
    function resolveImport(importPath, currentFile, targetFile) {
        if (!importPath.startsWith('.')) return false; // Skip external modules

        try {
            const currentDir = path.dirname(currentFile);
            const resolvedPath = path.resolve(currentDir, importPath);

            // Check exact match (if extension provided) or try adding extensions
            const extensions = ['', '.js', '.ts', '.jsx', '.tsx'];

            for (const ext of extensions) {
                if (resolvedPath + ext === targetFile) return true;
            }
        } catch (e) {
            return false;
        }
        return false;
    }

    walkDir(projectRoot);

    return {
        fanIn: dependents.length,
        dependents
    };
}

module.exports = { scanProjectForDependents };
