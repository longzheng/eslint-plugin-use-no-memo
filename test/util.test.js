import { test } from 'node:test';
import assert from 'node:assert';
import { hasUseNoMemoDirective } from '../src/util/hasUseNoMemoDirective.js';

test('hasUseNoMemoDirective', async (t) => {
    await t.test('should return true when function has "use no memo" directive', () => {
        // Mock function node with directive
        const functionNode = {
            body: {
                type: 'BlockStatement',
                body: [
                    {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'Literal',
                            value: 'use no memo',
                        },
                    },
                ],
                directives: [],
            },
        };

        assert.strictEqual(hasUseNoMemoDirective(functionNode), true);
    });

    await t.test('should return true when function has directive in directives array', () => {
        // Mock function node with directive in directives array
        const functionNode = {
            body: {
                type: 'BlockStatement',
                body: [],
                directives: [
                    {
                        value: {
                            value: 'use no memo',
                        },
                    },
                ],
            },
        };

        assert.strictEqual(hasUseNoMemoDirective(functionNode), true);
    });

    await t.test('should return false when function has no directive', () => {
        // Mock function node without directive
        const functionNode = {
            body: {
                type: 'BlockStatement',
                body: [
                    {
                        type: 'VariableDeclaration',
                        declarations: [],
                    },
                ],
                directives: [],
            },
        };

        assert.strictEqual(hasUseNoMemoDirective(functionNode), false);
    });

    await t.test('should return false when function has different directive', () => {
        // Mock function node with different directive
        const functionNode = {
            body: {
                type: 'BlockStatement',
                body: [
                    {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'Literal',
                            value: 'use strict',
                        },
                    },
                ],
                directives: [],
            },
        };

        assert.strictEqual(hasUseNoMemoDirective(functionNode), false);
    });

    await t.test('should return false when function has no body', () => {
        // Mock function node without body
        const functionNode = {
            body: null,
        };

        assert.strictEqual(hasUseNoMemoDirective(functionNode), false);
    });

    await t.test('should return false when function body is not a BlockStatement', () => {
        // Mock arrow function with expression body
        const functionNode = {
            body: {
                type: 'Identifier',
                name: 'something',
            },
        };

        assert.strictEqual(hasUseNoMemoDirective(functionNode), false);
    });

    await t.test('should return true when directive appears after other statements', () => {
        // Mock function node with directive after other statements
        const functionNode = {
            body: {
                type: 'BlockStatement',
                body: [
                    {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'Literal',
                            value: 'use strict',
                        },
                    },
                    {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'Literal',
                            value: 'use no memo',
                        },
                    },
                ],
                directives: [],
            },
        };

        assert.strictEqual(hasUseNoMemoDirective(functionNode), true);
    });

    await t.test('should handle empty body', () => {
        // Mock function node with empty body
        const functionNode = {
            body: {
                type: 'BlockStatement',
                body: [],
                directives: [],
            },
        };

        assert.strictEqual(hasUseNoMemoDirective(functionNode), false);
    });
});
