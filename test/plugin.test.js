import { test } from 'node:test';
import assert from 'node:assert';
import plugin from '../src/index.js';

test('plugin structure', async (t) => {
    await t.test('should export correct plugin structure', () => {
        assert.strictEqual(typeof plugin, 'object');
        assert.strictEqual(plugin.meta.name, 'eslint-use-no-memo');
        assert.strictEqual(typeof plugin.rules, 'object');
    });

    await t.test('should have react-hook-form rule', () => {
        assert.strictEqual(typeof plugin.rules['react-hook-form'], 'object');
        assert.strictEqual(typeof plugin.rules['react-hook-form'].create, 'function');
        assert.strictEqual(plugin.rules['react-hook-form'].meta.type, 'problem');
        assert.strictEqual(plugin.rules['react-hook-form'].meta.fixable, 'code');
        assert.strictEqual(plugin.rules['react-hook-form'].meta.docs.recommended, true);
    });

    await t.test('should have tanstack-table rule', () => {
        assert.strictEqual(typeof plugin.rules['tanstack-table'], 'object');
        assert.strictEqual(typeof plugin.rules['tanstack-table'].create, 'function');
        assert.strictEqual(plugin.rules['tanstack-table'].meta.type, 'problem');
        assert.strictEqual(plugin.rules['tanstack-table'].meta.fixable, 'code');
        assert.strictEqual(plugin.rules['tanstack-table'].meta.docs.recommended, true);
    });

    await t.test('should have correct message IDs', () => {
        assert.strictEqual(
            plugin.rules['react-hook-form'].meta.messages.noMemoRequired,
            "Functions using useForm must include the 'use no memo' directive."
        );
        assert.strictEqual(
            plugin.rules['tanstack-table'].meta.messages.noMemoRequired,
            "Functions using useReactTable must include the 'use no memo' directive."
        );
    });
});
