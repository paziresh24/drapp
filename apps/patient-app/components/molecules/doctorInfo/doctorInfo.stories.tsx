import DoctorInfo from './doctorInfo';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Molecules/DoctorInfo',
    component: DoctorInfo
};

const Template = args => <DoctorInfo {...args} />;

export const ExampleStory = Template.bind({});
ExampleStory.args = {
    avatar: 'https://www.paziresh24.com/api/getImage/p24/search-men/d418ce9cfb1df336bad5b3c48bc03f1e.jpg',
    firstName: 'دکتر امیرحسین',
    lastName: 'بیگی',
    expertise: 'پزشک عمومی'
};
