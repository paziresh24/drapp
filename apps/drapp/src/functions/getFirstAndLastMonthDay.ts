import moment from 'jalali-moment';

interface Params {
    year: number;
    month: number;
}

export const getFirstAndLastMonthDay = (year: number, month: number) => {
    const firstDayOfMonth = moment([year, month], 'jYYYY,jM,jD').startOf('jMonth');
    const lastDayOfMonth = moment([year, month], 'jYYYY,jM,jD').endOf('jMonth');

    return {
        firstDayOfMonth: firstDayOfMonth.unix(),
        lastDayOfMonth: lastDayOfMonth.unix()
    };
};

export default getFirstAndLastMonthDay;
