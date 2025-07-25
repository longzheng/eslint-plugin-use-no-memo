/**
 * Checks if a function node has the 'use no memo' directive.
 * @param {import('eslint').Rule.Node} functionNode - The function node (FunctionDeclaration, ArrowFunctionExpression, FunctionExpression).
 * @returns {boolean} True if the directive is found, false otherwise.
 */
export function hasUseNoMemoDirective(functionNode) {
    if (!functionNode.body || functionNode.body.type !== `BlockStatement`) {
        return false; // Not a function with a block body
    }

    const bodyContent = functionNode.body.body;

    // Check formal directives array (if parser populates it)
    if (functionNode.body.directives && functionNode.body.directives.length > 0) {
        if (functionNode.body.directives.some((directive) => directive.value?.value === `use no memo`)) {
            return true;
        }
    }

    // Check the first statements in the body for string literal directives
    if (bodyContent && bodyContent.length > 0) {
        for (const statement of bodyContent) {
            if (
                statement.type === `ExpressionStatement` &&
                statement.expression.type === `Literal` &&
                typeof statement.expression.value === `string`
            ) {
                if (statement.expression.value === `use no memo`) {
                    return true;
                }
                // It's a string literal, but not the one we want, continue checking subsequent string literals
            } else {
                // Reached a non-string-literal statement, stop checking
                break;
            }
        }
    }

    return false;
}
