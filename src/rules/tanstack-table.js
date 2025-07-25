/**
 * ESLint rule to enforce 'use no memo' directive when using useReactTable from @tanstack/react-table
 * https://github.com/TanStack/table/issues/5567
 */

import { createUseNoMemoRule } from '../util/createUseNoMemoRule.js';

/** @type {import('eslint').Rule.RuleModule} */
export default {
    meta: {
        type: `problem`,
        docs: {
            description: `Require 'use no memo' directive when using useReactTable from @tanstack/react-table`,
            recommended: true,
        },
        fixable: `code`,
        messages: {
            noMemoRequired: `Functions using useReactTable must include the 'use no memo' directive.`,
        },
    },
    create(context) {
        return createUseNoMemoRule({
            context,
            hookName: `useReactTable`,
            importName: `@tanstack/react-table`,
        });
    },
};
