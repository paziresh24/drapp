import {
    convertTimeStampToFormattedTime,
    convertTimeStampToPersianDate
} from '@paziresh24/shared/utils';
import { BookStatus } from 'apps/patient-app/types/bookStatus';
import { CenterType } from 'apps/patient-app/types/centerType';

interface TurnDetailsDataParam {
    data: {
        bookTime: number;
        waitingTime?: 0 | 1 | 2 | 3;
        trackingCode: string;
    };
    status: BookStatus;
    centerType: CenterType;
}

enum WaitingTimeList {
    'کمتر از نیم ساعت',
    'نیم تا یک ساعت',
    'یک تا دو ساعت',
    'بیشتر از دو ساعت'
}

export const turnDetailsData = ({ data, status, centerType }: TurnDetailsDataParam) => {
    const { bookTime, trackingCode, waitingTime } = data;
    const dateAndTime = `${convertTimeStampToFormattedTime(
        bookTime
    )} - ${convertTimeStampToPersianDate(bookTime)}`;

    if (centerType === CenterType.consult)
        return [
            { id: 0, name: 'زمان ارتباط با پزشک', value: dateAndTime },
            { id: 1, name: 'کدپیگیری', value: trackingCode }
        ];

    if (status === BookStatus.expired) return [{ id: 0, name: 'زمان نوبت', value: dateAndTime }];

    if (status === BookStatus.visited)
        return [
            { id: 0, name: 'زمان نوبت', value: dateAndTime },
            { id: 1, name: 'کدپیگیری', value: trackingCode }
        ];

    if (status === BookStatus.notVisited)
        return [
            { id: 0, name: 'زمان نوبت', value: dateAndTime },
            {
                id: 1,
                name: `میانگین زمان انتظار در ${
                    centerType === CenterType.clinic ? 'مطب' : 'بیمارستان'
                }`,
                value: WaitingTimeList[waitingTime]
            },
            { id: 2, name: 'کدپیگیری', value: trackingCode }
        ];

    return [{ id: 0, name: 'کدپیگیری', value: trackingCode }];
};
