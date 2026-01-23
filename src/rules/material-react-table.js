/**
 * ESLint rule to enforce 'use no memo' directive when using useMaterialReactTable from material-react-table
 * https://github.com/KevinVandy/material-react-table
 */

import { createUseNoMemoRule } from '../util/createUseNoMemoRule.js';

/** @type {import('eslint').Rule.RuleModule} */
export default {
    meta: {
        type: `problem`,
        docs: {
            description: `Require 'use no memo' directive when using useMaterialReactTable from material-react-table`,
            recommended: true,
        },
        fixable: `code`,
        messages: {
            noMemoRequired: `Functions using useMaterialReactTable must include the 'use no memo' directive.`,
        },
    },
    create(context) {
        return createUseNoMemoRule({
            context,
            hookName: `useMaterialReactTable`,
            importName: `material-react-table`,
        });
    },
};
