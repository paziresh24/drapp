import React from 'react';

import Button from './index';

export default {
    title: 'Core/Button',
    component: Button,
    argTypes: {
        variant: {
            options: ['primary', 'secondary'],
            control: { type: 'radio' }
        },
        theme: {
            options: ['success', 'error'],
            control: { type: 'radio' }
        },
        size: {
            options: ['larg', 'small'],
            control: { type: 'radio' }
        },
        loading: {
            control: { type: 'boolean' }
        },
        block: {
            control: { type: 'boolean' }
        }
    }
};

const Template = args => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    variant: 'primary',
    children: 'Button'
};

export const Secondary = Template.bind({});
Secondary.args = {
    variant: 'secondary',
    children: 'Button'
};

export const Small = Template.bind({});
Small.args = {
    variant: 'primary',
    size: 'small',
    children: 'Button'
};
