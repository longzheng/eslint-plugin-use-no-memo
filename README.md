# eslint-plugin-use-no-memo

ESLint plugin for enforcing the "use no memo" directive with React libraries incompatible with React Compiler.

The [React Compiler](https://react.dev/learn/react-compiler) automatically optimizes React components by memoizing expensive operations. However, some React libraries are incompatible with this automatic memoization and require the [`'use no memo'` directive to opt out of React Compiler optimizations](https://react.dev/reference/react-compiler/directives/use-no-memo).

This ESLint plugin helps you automatically detect when you're using incompatible hooks and either warns you to add the directive or automatically fixes it for you.

## Supported Libraries

This plugin currently supports the following libraries and hooks:

- **react-hook-form**: `useForm` hook ([Issue #12298](https://github.com/react-hook-form/react-hook-form/issues/12298))
- **@tanstack/react-table**: `useReactTable` hook ([Issue #5567](https://github.com/TanStack/table/issues/5567))

## Installation

```bash
npm install --save-dev eslint-plugin-use-no-memo
```

## Configuration

### ESLint Flat Config (eslint.config.js)

For ESLint v9+ with flat config:

```js
import useNoMemo from 'eslint-plugin-use-no-memo';

export default [
  {
    plugins: {
      'use-no-memo': useNoMemo,
    },
    rules: {
      'use-no-memo/react-hook-form': 'error',
      'use-no-memo/tanstack-table': 'error',
    },
  },
];
```

### Legacy ESLint Config (.eslintrc.js)

For older ESLint versions:

```js
module.exports = {
  plugins: ['use-no-memo'],
  rules: {
    'use-no-memo/react-hook-form': 'error',
    'use-no-memo/tanstack-table': 'error',
  },
};
```

## Rules

### `use-no-memo/react-hook-form`

Enforces the `'use no memo'` directive when using `useForm` from react-hook-form.

#### ❌ Incorrect

```jsx
import { useForm } from 'react-hook-form';

function MyComponent() {
  const form = useForm();
  // ... rest of component
}
```

#### ✅ Correct

```jsx
import { useForm } from 'react-hook-form';

function MyComponent() {
  'use no memo';
  const form = useForm();
  // ... rest of component
}
```

### `use-no-memo/tanstack-table`

Enforces the `'use no memo'` directive when using `useReactTable` from @tanstack/react-table.

#### ❌ Incorrect

```jsx
import { useReactTable } from '@tanstack/react-table';

function MyComponent() {
  const table = useReactTable({
    // ... table config
  });
}
```

#### ✅ Correct

```jsx
import { useReactTable } from '@tanstack/react-table';

function MyComponent() {
  'use no memo';
  const table = useReactTable({
    // ... table config
  });
  // ... rest of component
}
```
