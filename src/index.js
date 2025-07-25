import reactHookForm from './rules/react-hook-form.js';
import tanstackTable from './rules/tanstack-table.js';
import fs from 'fs';

const pkg = JSON.parse(
    fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
    meta: {
        name: pkg.name,
        version: pkg.version,
    },
    rules: {
        'react-hook-form': reactHookForm,
        'tanstack-table': tanstackTable,
    },
};

export default plugin;
