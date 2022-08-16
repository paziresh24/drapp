import moment from 'jalali-moment';
import uniq from 'lodash/uniq';
import { toast } from 'react-toastify';
import { weekDays } from 'apps/drapp/src/constants/weekDays';
import { useState } from 'react';

const convertTimeToTimeStamp = (time: string) => {
    const [hour, minute] = time.split(':');
    return +moment()
        .hour(+hour)
        .minute(+minute)
        .unix();
};

const workHoursValidation = (workHours: Day[]) => {
    const isValidTime = workHours.every(workHour => {
        const { from, to } = workHour;
        return convertTimeToTimeStamp(from) < convertTimeToTimeStamp(to);
    });

    return isValidTime;
};

const oldAndNewWorkHours = ({
    workHours,
    prevWorkHours
}: {
    workHours: Day[];
    prevWorkHours: Day[];
}) => {
    const confilitedDays: DayIds[] = [];
    workHours.forEach(workHour => {
        const { from, to } = workHour;
        const fromTime = convertTimeToTimeStamp(from);
        const toTime = convertTimeToTimeStamp(to);
        prevWorkHours.forEach(prevWorkHour => {
            const { from: prevFrom, to: prevTo } = prevWorkHour;
            const prevFromTime = convertTimeToTimeStamp(prevFrom);
            const prevToTime = convertTimeToTimeStamp(prevTo);
            if (workHour.day === prevWorkHour.day) {
                if (
                    (fromTime < prevFromTime && toTime <= prevFromTime) ||
                    (fromTime >= prevToTime && toTime > prevToTime)
                ) {
                    return;
                }
                confilitedDays.push(workHour.day);
            }
        });
    });
    return uniq(confilitedDays);
};

const initialHours = {
    from: '09:00',
    to: '21:00'
};

export const useWorkHoursValidation = () => {
    const [days, setDays] = useState<DayIds[]>([]);
    const [hours, setHours] = useState(initialHours);

    const validationWorkHour = ({ currentWorkHours }: { currentWorkHours: Day[] }) => {
        if (!days.length) {
            toast.error('لطفا روز های کاری خود را انتخاب کنید.');
            return false;
        }

        const workDays = days.map(day => ({
            day,
            ...hours
        }));

        if (!workHoursValidation(workDays)) {
            toast.error('زمان های کاری باید به صورت صحیح وارد شود.');
            return false;
        }

        const confilitedDays = oldAndNewWorkHours({
            workHours: workDays,
            prevWorkHours: currentWorkHours
        });

        if (confilitedDays.length > 0) {
            confilitedDays.forEach(dayId => {
                toast.error(
                    `روز ${
                        weekDays.find(day => day.id === dayId)?.name
                    } با زمان های دیگر تداخل دارد.`
                );
            });
            return false;
        }
        setDays([]);
        setHours(initialHours);

        return true;
    };

    return { validationWorkHour, setDays, setHours, days, hours };
};
