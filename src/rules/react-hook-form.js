/**
 * ESLint rule to enforce 'use no memo' directive when using useForm from react-hook-form
 * https://github.com/react-hook-form/react-hook-form/issues/12298
 */

import { createUseNoMemoRule } from '../util/createUseNoMemoRule.js';

/** @type {import('eslint').Rule.RuleModule} */
export default {
    meta: {
        type: `problem`,
        docs: {
            description: `Require 'use no memo' directive when using useForm from react-hook-form`,
            recommended: true,
        },
        fixable: `code`,
        messages: {
            noMemoRequired: `Functions using useForm must include the 'use no memo' directive.`,
        },
    },
    create(context) {
        return createUseNoMemoRule({
            context,
            hookName: `useForm`,
            importName: `react-hook-form`,
        });
    },
};
