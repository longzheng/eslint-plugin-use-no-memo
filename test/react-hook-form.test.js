import { RuleTester } from 'eslint';
import reactHookFormRule from '../src/rules/react-hook-form.js';

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

ruleTester.run('react-hook-form', reactHookFormRule, {
    valid: [
        // Function with 'use no memo' directive
        {
            code: `
                import { useForm } from 'react-hook-form';
                
                function MyComponent() {
                    'use no memo';
                    const form = useForm();
                    return null;
                }
            `,
        },
        // Arrow function with 'use no memo' directive
        {
            code: `
                import { useForm } from 'react-hook-form';
                
                const MyComponent = () => {
                    'use no memo';
                    const form = useForm();
                    return null;
                };
            `,
        },
        // Function expression with 'use no memo' directive
        {
            code: `
                import { useForm } from 'react-hook-form';
                
                const MyComponent = function() {
                    'use no memo';
                    const form = useForm();
                    return null;
                };
            `,
        },
        // useForm not imported from react-hook-form
        {
            code: `
                import { useForm } from 'some-other-library';
                
                function MyComponent() {
                    const form = useForm();
                    return null;
                }
            `,
        },
        // Different hook from react-hook-form
        {
            code: `
                import { useWatch } from 'react-hook-form';
                
                function MyComponent() {
                    const value = useWatch();
                    return null;
                }
            `,
        },
        // useForm imported with different name
        {
            code: `
                import { useForm as useReactHookForm } from 'react-hook-form';
                
                function MyComponent() {
                    'use no memo';
                    const form = useReactHookForm();
                    return null;
                }
            `,
        },
        // No useForm call
        {
            code: `
                import { useForm } from 'react-hook-form';
                
                function MyComponent() {
                    return null;
                }
            `,
        },
        // useForm called outside of function
        {
            code: `
                import { useForm } from 'react-hook-form';
                
                const form = useForm();
            `,
        },
    ],
    invalid: [
        // Function without 'use no memo' directive
        {
            code: `
                import { useForm } from 'react-hook-form';
                
                function MyComponent() {
                    const form = useForm();
                    return null;
                }
            `,
            errors: [
                {
                    messageId: 'noMemoRequired',
                },
            ],
            output: `
                import { useForm } from 'react-hook-form';
                
                function MyComponent() {
    'use no memo';

                    const form = useForm();
                    return null;
                }
            `,
        },
        // Arrow function without 'use no memo' directive
        {
            code: `
                import { useForm } from 'react-hook-form';
                
                const MyComponent = () => {
                    const form = useForm();
                    return null;
                };
            `,
            errors: [
                {
                    messageId: 'noMemoRequired',
                },
            ],
            output: `
                import { useForm } from 'react-hook-form';
                
                const MyComponent = () => {
    'use no memo';

                    const form = useForm();
                    return null;
                };
            `,
        },
        // Function expression without 'use no memo' directive
        {
            code: `
                import { useForm } from 'react-hook-form';
                
                const MyComponent = function() {
                    const form = useForm();
                    return null;
                };
            `,
            errors: [
                {
                    messageId: 'noMemoRequired',
                },
            ],
            output: `
                import { useForm } from 'react-hook-form';
                
                const MyComponent = function() {
    'use no memo';

                    const form = useForm();
                    return null;
                };
            `,
        },
        // Multiple useForm calls in same function
        {
            code: `
                import { useForm } from 'react-hook-form';
                
                function MyComponent() {
                    const form1 = useForm();
                    const form2 = useForm();
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
                import { useForm } from 'react-hook-form';
                
                function MyComponent() {
    'use no memo';

                    const form1 = useForm();
                    const form2 = useForm();
                    return null;
                }
            `,
        },
        // useForm imported with different name
        {
            code: `
                import { useForm as useReactHookForm } from 'react-hook-form';
                
                function MyComponent() {
                    const form = useReactHookForm();
                    return null;
                }
            `,
            errors: [
                {
                    messageId: 'noMemoRequired',
                },
            ],
            output: `
                import { useForm as useReactHookForm } from 'react-hook-form';
                
                function MyComponent() {
    'use no memo';

                    const form = useReactHookForm();
                    return null;
                }
            `,
        },
        // Nested functions - inner function should be reported
        {
            code: `
                import { useForm } from 'react-hook-form';
                
                function OuterComponent() {
                    'use no memo';
                    
                    function InnerComponent() {
                        const form = useForm();
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
                import { useForm } from 'react-hook-form';
                
                function OuterComponent() {
                    'use no memo';
                    
                    function InnerComponent() {
    'use no memo';

                        const form = useForm();
                        return null;
                    }
                    
                    return InnerComponent;
                }
            `,
        },
    ],
});
