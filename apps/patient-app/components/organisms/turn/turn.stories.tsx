import ClinicTurn from './clinicTurn';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Organisms/ClinicTurn',
    component: ClinicTurn
};

const Template = args => (
    <div className="w-96">
        <ClinicTurn {...args} />
    </div>
);

export const Active = Template.bind({});
Active.args = {
    expired: false,
    doctorInfo: {
        avatar: 'https://www.paziresh24.com/api/getImage/p24/search-men/d418ce9cfb1df336bad5b3c48bc03f1e.jpg',
        firstName: 'دکتر امیرحسین',
        lastName: 'بیگی',
        expertise: 'پزشک عمومی'
    },
    turnDetails: {
        bookTime: 1644812367,
        waitingTime: 2,
        trackingCode: '1235'
    },
    location: {
        address:
            'آدرس: یزد، میدان مهدیه، بلوار آیت الله طالقانی، ساختمان نظام پزشکی طبقه دوم، واحد 21',
        lat: 31.885828,
        lng: 54.348932
    },
    feedbackUrl: 'http://p4z.ir/6uon7c8'
};

export const Expired = Template.bind({});
Expired.args = {
    expired: true,
    doctorInfo: {
        avatar: 'https://www.paziresh24.com/api/getImage/p24/search-men/d418ce9cfb1df336bad5b3c48bc03f1e.jpg',
        firstName: 'دکتر امیرحسین',
        lastName: 'بیگی',
        expertise: 'پزشک عمومی'
    }
};
