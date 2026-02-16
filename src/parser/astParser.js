const parser = require('@babel/parser');
const fs = require('fs');

/**
 * Parses JavaScript or TypeScript code into an Abstract Syntax Tree (AST)
 * 
 * @param {string} filePath - Path to the file to parse
 * @returns {Object} Object containing { ast, loc }
 * @throws {Error} If file cannot be read or parsed
 */
function parseFile(filePath) {
  try {
    // Read file content
    const code = fs.readFileSync(filePath, 'utf-8');

    // Determine if TypeScript based on file extension
    const isTypeScript = filePath.endsWith('.ts') || filePath.endsWith('.tsx');

    // Parse with appropriate plugins
    // We enable common plugins to handle modern JavaScript/TypeScript syntax
    const ast = parser.parse(code, {
      sourceType: 'module', // Support ES6 imports/exports
      plugins: [
        'jsx', // Support JSX syntax
        'typescript', // Support TypeScript (ignored for .js files)
        'classProperties', // Support class fields
        'decorators-legacy', // Support decorators
        'dynamicImport', // Support dynamic import()
        'optionalChaining', // Support optional chaining (?.)
        'nullishCoalescingOperator', // Support nullish coalescing (??)
      ],
    });

    // Calculate total lines of code
    const loc = code.split('\n').length;

    return { ast, loc };
  } catch (error) {
    // Provide helpful error messages
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }

    if (error instanceof SyntaxError) {
      throw new Error(`Syntax error in ${filePath}: ${error.message}`);
    }

    throw new Error(`Failed to parse ${filePath}: ${error.message}`);
  }
}

module.exports = { parseFile };
