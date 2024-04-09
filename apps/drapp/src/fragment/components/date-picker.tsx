import { Calendar, DayValue } from '@hassanmojab/react-modern-calendar-datepicker';

import moment from 'jalali-moment';

export const DatePicker = ({ onChange, locale, holidays = [], value }: any) => {
    const dateToJson = (value: number) => {
        const date = moment(value * 1000).locale(locale);
        return {
            year: date.year(),
            month: date.month() + 1,
            day: date.date()
        };
    };
    return (
        <Calendar
            onChange={(value: any) => {
                return onChange(
                    moment(`${value?.year}/${value?.month}/${value?.day}`, 'jYYYY/jMM/jDD', locale)
                        .locale('en')
                        .unix()
                );
            }}
            locale={locale}
            customDaysClassName={holidays.map((d: any) => {
                return {
                    ...dateToJson(d),
                    className: 'holiday-style'
                };
            })}
            {...(value && {
                value: dateToJson(value)
            })}
        />
    );
};
