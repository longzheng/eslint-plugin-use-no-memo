import { RuleTester } from 'eslint';
import materialReactTableRule from '../src/rules/material-react-table.js';

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
});

ruleTester.run('material-react-table', materialReactTableRule, {
    valid: [
        // Function with 'use no memo' directive
        {
            code: `
                import { useMaterialReactTable } from 'material-react-table';

                function MyComponent() {
                    'use no memo';
                    const table = useMaterialReactTable({
                        data: [],
                        columns: [],
                    });
                    return null;
                }
            `,
        },
        // Arrow function with 'use no memo' directive
        {
            code: `
                import { useMaterialReactTable } from 'material-react-table';

                const MyComponent = () => {
                    'use no memo';
                    const table = useMaterialReactTable({
                        data: [],
                        columns: [],
                    });
                    return null;
                };
            `,
        },
        // Function expression with 'use no memo' directive
        {
            code: `
                import { useMaterialReactTable } from 'material-react-table';

                const MyComponent = function() {
                    'use no memo';
                    const table = useMaterialReactTable({
                        data: [],
                        columns: [],
                    });
                    return null;
                };
            `,
        },
        // useMaterialReactTable not imported from material-react-table
        {
            code: `
                import { useMaterialReactTable } from 'some-other-library';

                function MyComponent() {
                    const table = useMaterialReactTable();
                    return null;
                }
            `,
        },
        // Different hook from material-react-table
        {
            code: `
                import { MRT_TableBody } from 'material-react-table';

                function MyComponent() {
                    const el = MRT_TableBody;
                    return el;
                }
            `,
        },
        // useMaterialReactTable imported with different name
        {
            code: `
                import { useMaterialReactTable as useMRT } from 'material-react-table';

                function MyComponent() {
                    'use no memo';
                    const table = useMRT({
                        data: [],
                        columns: [],
                    });
                    return null;
                }
            `,
        },
        // No useMaterialReactTable call
        {
            code: `
                import { useMaterialReactTable } from 'material-react-table';

                function MyComponent() {
                    return null;
                }
            `,
        },
        // useMaterialReactTable called outside of function
        {
            code: `
                import { useMaterialReactTable } from 'material-react-table';

                const table = useMaterialReactTable({
                    data: [],
                    columns: [],
                });
            `,
        },
    ],
    invalid: [
        // Function without 'use no memo' directive
        {
            code: `
                import { useMaterialReactTable } from 'material-react-table';

                function MyComponent() {
                    const table = useMaterialReactTable({
                        data: [],
                        columns: [],
                    });
                    return null;
                }
            `,
            errors: [
                {
                    messageId: 'noMemoRequired',
                },
            ],
            output: `
                import { useMaterialReactTable } from 'material-react-table';

                function MyComponent() {
    'use no memo';

                    const table = useMaterialReactTable({
                        data: [],
                        columns: [],
                    });
                    return null;
                }
            `,
        },
        // Arrow function without 'use no memo' directive
        {
            code: `
                import { useMaterialReactTable } from 'material-react-table';

                const MyComponent = () => {
                    const table = useMaterialReactTable({
                        data: [],
                        columns: [],
                    });
                    return null;
                };
            `,
            errors: [
                {
                    messageId: 'noMemoRequired',
                },
            ],
            output: `
                import { useMaterialReactTable } from 'material-react-table';

                const MyComponent = () => {
    'use no memo';

                    const table = useMaterialReactTable({
                        data: [],
                        columns: [],
                    });
                    return null;
                };
            `,
        },
        // Function expression without 'use no memo' directive
        {
            code: `
                import { useMaterialReactTable } from 'material-react-table';

                const MyComponent = function() {
                    const table = useMaterialReactTable({
                        data: [],
                        columns: [],
                    });
                    return null;
                };
            `,
            errors: [
                {
                    messageId: 'noMemoRequired',
                },
            ],
            output: `
                import { useMaterialReactTable } from 'material-react-table';

                const MyComponent = function() {
    'use no memo';

                    const table = useMaterialReactTable({
                        data: [],
                        columns: [],
                    });
                    return null;
                };
            `,
        },
        // Multiple useMaterialReactTable calls in same function
        {
            code: `
                import { useMaterialReactTable } from 'material-react-table';

                function MyComponent() {
                    const table1 = useMaterialReactTable({ data: [], columns: [] });
                    const table2 = useMaterialReactTable({ data: [], columns: [] });
                    return null;
                }
            `,
            errors: [
                {
                    messageId: 'noMemoRequired',
                },
                {
                    messageId: 'noMemoRequired',
                },
            ],
            output: `
                import { useMaterialReactTable } from 'material-react-table';

                function MyComponent() {
    'use no memo';

                    const table1 = useMaterialReactTable({ data: [], columns: [] });
                    const table2 = useMaterialReactTable({ data: [], columns: [] });
                    return null;
                }
            `,
        },
        // useMaterialReactTable imported with different name
        {
            code: `
                import { useMaterialReactTable as useMRT } from 'material-react-table';

                function MyComponent() {
                    const table = useMRT({
                        data: [],
                        columns: [],
                    });
                    return null;
                }
            `,
            errors: [
                {
                    messageId: 'noMemoRequired',
                },
            ],
            output: `
                import { useMaterialReactTable as useMRT } from 'material-react-table';

                function MyComponent() {
    'use no memo';

                    const table = useMRT({
                        data: [],
                        columns: [],
                    });
                    return null;
                }
            `,
        },
        // Nested functions - inner function should be reported
        {
            code: `
                import { useMaterialReactTable } from 'material-react-table';

                function OuterComponent() {
                    'use no memo';

                    function InnerComponent() {
                        const table = useMaterialReactTable({
                            data: [],
                            columns: [],
                        });
                        return null;
                    }

                    return InnerComponent;
                }
            `,
            errors: [
                {
                    messageId: 'noMemoRequired',
                },
            ],
            output: `
                import { useMaterialReactTable } from 'material-react-table';

                function OuterComponent() {
                    'use no memo';

                    function InnerComponent() {
    'use no memo';

                        const table = useMaterialReactTable({
                            data: [],
                            columns: [],
                        });
                        return null;
                    }

                    return InnerComponent;
                }
            `,
        },
    ],
});
