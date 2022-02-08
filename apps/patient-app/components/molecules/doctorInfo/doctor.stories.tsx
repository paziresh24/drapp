import DoctorInfo from './doctorInfo';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Molecules/DoctorInfo',
    component: DoctorInfo
};

export const DoctorInfoComponents = () => (
    <DoctorInfo avatar="/" firstName="امیر" lastName="بیگی" expertise="پزشک عمومی" />
);
