import TurnDetails from './turnDetails';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Molecules/TurnDetails',
    component: TurnDetails
};

const Template = args => (
    <div className="w-80">
        <TurnDetails {...args} />
    </div>
);

export const ExampleStory = Template.bind({});
ExampleStory.args = {
    items: [{ id: 1, name: 'کدپیگیری', value: '123' }]
};
