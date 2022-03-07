import Queue from './queue';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Molecules/Queue',
    component: Queue
};

const Template = args => (
    <div className="w-96">
        <Queue {...args} />
    </div>
);

export const Simple = Template.bind({});
Simple.args = {
    status: 'deleted'
};
