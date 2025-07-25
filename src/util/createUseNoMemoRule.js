import { hasUseNoMemoDirective } from '../util/hasUseNoMemoDirective.js';

/**
 * @param {{
 *  context: import('eslint').Rule.RuleContext,
 *  hookName: string,
 *  importName: string
 * }} options
 * @returns {import('eslint').Rule.NodeListener}
 */
export function createUseNoMemoRule({ context, hookName, importName }) {
    let localName = null;

    return {
        ImportDeclaration(node) {
            if (node.source.value !== importName) {
                return;
            }

            const useReactTableSpecifier = node.specifiers.find(
                (specifier) => specifier.type === `ImportSpecifier` && specifier.imported.name === hookName,
            );

            if (useReactTableSpecifier) {
                localName = useReactTableSpecifier.local.name;
            }
        },

        CallExpression(node) {
            if (!localName || node.callee.type !== `Identifier` || node.callee.name !== localName) {
                return; // Not a call to the imported hook
            }

            // Find the containing function node
            let current = node.parent;
            let functionNode = null;
            while (current) {
                if (
                    current.type === `FunctionDeclaration` ||
                    current.type === `ArrowFunctionExpression` ||
                    current.type === `FunctionExpression`
                ) {
                    functionNode = current;
                    break;
                }
                current = current.parent;
            }

            if (!functionNode || !functionNode.body || functionNode.body.type !== `BlockStatement`) {
                return; // Could not find a suitable containing function with a block body
            }

            if (!hasUseNoMemoDirective(functionNode)) {
                context.report({
                    node: functionNode, // Report the error on the function itself
                    messageId: `noMemoRequired`,
                    fix(fixer) {
                        // Check again inside the fixer to be safe in case of concurrent fixes
                        if (!hasUseNoMemoDirective(functionNode)) {
                            const functionBodyStart = functionNode.body.range[0] + 1; // Position after '{'
                            // Basic indentation, assuming standard code style
                            const indentation = `    `;
                            return fixer.insertTextAfterRange(
                                [functionBodyStart, functionBodyStart],
                                `\n${indentation}'use no memo';\n`,
                            );
                        }
                        return null;
                    },
                });
            }
        },
    };
}
