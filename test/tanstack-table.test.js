import { RuleTester } from 'eslint';
import tanstackTableRule from '../src/rules/tanstack-table.js';

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

ruleTester.run('tanstack-table', tanstackTableRule, {
    valid: [
        // Function with 'use no memo' directive
        {
            code: `
                import { useReactTable } from '@tanstack/react-table';
                
                function MyComponent() {
                    'use no memo';
                    const table = useReactTable({
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
                import { useReactTable } from '@tanstack/react-table';
                
                const MyComponent = () => {
                    'use no memo';
                    const table = useReactTable({
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
                import { useReactTable } from '@tanstack/react-table';
                
                const MyComponent = function() {
                    'use no memo';
                    const table = useReactTable({
                        data: [],
                        columns: [],
                    });
                    return null;
                };
            `,
        },
        // useReactTable not imported from @tanstack/react-table
        {
            code: `
                import { useReactTable } from 'some-other-library';
                
                function MyComponent() {
                    const table = useReactTable();
                    return null;
                }
            `,
        },
        // Different hook from @tanstack/react-table
        {
            code: `
                import { createTable } from '@tanstack/react-table';
                
                function MyComponent() {
                    const table = createTable();
                    return null;
                }
            `,
        },
        // useReactTable imported with different name
        {
            code: `
                import { useReactTable as useTable } from '@tanstack/react-table';
                
                function MyComponent() {
                    'use no memo';
                    const table = useTable({
                        data: [],
                        columns: [],
                    });
                    return null;
                }
            `,
        },
        // No useReactTable call
        {
            code: `
                import { useReactTable } from '@tanstack/react-table';
                
                function MyComponent() {
                    return null;
                }
            `,
        },
        // useReactTable called outside of function
        {
            code: `
                import { useReactTable } from '@tanstack/react-table';
                
                const table = useReactTable({
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
                import { useReactTable } from '@tanstack/react-table';
                
                function MyComponent() {
                    const table = useReactTable({
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
                import { useReactTable } from '@tanstack/react-table';
                
                function MyComponent() {
    'use no memo';

                    const table = useReactTable({
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
                import { useReactTable } from '@tanstack/react-table';
                
                const MyComponent = () => {
                    const table = useReactTable({
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
                import { useReactTable } from '@tanstack/react-table';
                
                const MyComponent = () => {
    'use no memo';

                    const table = useReactTable({
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
                import { useReactTable } from '@tanstack/react-table';
                
                const MyComponent = function() {
                    const table = useReactTable({
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
                import { useReactTable } from '@tanstack/react-table';
                
                const MyComponent = function() {
    'use no memo';

                    const table = useReactTable({
                        data: [],
                        columns: [],
                    });
                    return null;
                };
            `,
        },
        // Multiple useReactTable calls in same function
        {
            code: `
                import { useReactTable } from '@tanstack/react-table';
                
                function MyComponent() {
                    const table1 = useReactTable({ data: [], columns: [] });
                    const table2 = useReactTable({ data: [], columns: [] });
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
                import { useReactTable } from '@tanstack/react-table';
                
                function MyComponent() {
    'use no memo';

                    const table1 = useReactTable({ data: [], columns: [] });
                    const table2 = useReactTable({ data: [], columns: [] });
                    return null;
                }
            `,
        },
        // useReactTable imported with different name
        {
            code: `
                import { useReactTable as useTable } from '@tanstack/react-table';
                
                function MyComponent() {
                    const table = useTable({
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
                import { useReactTable as useTable } from '@tanstack/react-table';
                
                function MyComponent() {
    'use no memo';

                    const table = useTable({
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
                import { useReactTable } from '@tanstack/react-table';
                
                function OuterComponent() {
                    'use no memo';
                    
                    function InnerComponent() {
                        const table = useReactTable({
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
                import { useReactTable } from '@tanstack/react-table';
                
                function OuterComponent() {
                    'use no memo';
                    
                    function InnerComponent() {
    'use no memo';

                        const table = useReactTable({
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
