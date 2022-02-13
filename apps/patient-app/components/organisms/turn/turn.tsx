import Card from '../../atoms/card';
import { useState, useEffect } from 'react';
import { convertToPersianDate, convertToTime } from '@paziresh24/utils';
import { TurnBody, TurnFooter, TurnHeader } from '../../molecules/turnCard';
interface TurnProps {
    status?: 'expired' | 'deleted' | 'not_visited';
    id: string;
    centerType: 'clinic' | 'hospital' | 'consult';
    centerInfo: {
        centerId: string;
        centerType: string;
    };
    doctorInfo: {
        avatar: string;
        firstName: string;
        lastName: string;
        expertise: string;
        slug: string;
    };
    patientInfo: {
        nationalCode: string;
    };
    turnDetails: {
        bookTime: number;
        waitingTime?: 0 | 1 | 2 | 3;
        trackingCode: string;
    };
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    feedbackUrl: string | null;
    prescription?: {
        pdf?: string;
    };
}

enum WaitingTimeList {
    'کمتر از نیم ساعت',
    'نیم تا یک ساعت',
    'یک تا دو ساعت',
    'بیشتر از دو ساعت'
}

export const Turn: React.FC<TurnProps> = props => {
    const {
        status,
        doctorInfo,
        turnDetails,
        location,
        feedbackUrl,
        prescription,
        centerType,
        patientInfo,
        centerInfo,
        id
    } = props;

    const [detailsData, setDetailsData] = useState([]);

    useEffect(() => {
        setTurnDetailsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [turnDetails, status, centerType]);

    const setTurnDetailsData = () => {
        const { bookTime, trackingCode, waitingTime } = turnDetails;
        const dateAndTime = `${convertToTime(bookTime)} - ${convertToPersianDate(bookTime)}`;

        if (status !== 'expired')
            if (centerType === 'consult')
                return setDetailsData([
                    { id: 0, name: 'زمان ارتباط با پزشک', value: dateAndTime },
                    { id: 1, name: 'کدپیگیری', value: trackingCode }
                ]);
            else
                return setDetailsData([
                    { id: 0, name: 'زمان نوبت', value: dateAndTime },
                    {
                        id: 1,
                        name: `میانگین زمان انتظار در ${
                            centerType === 'clinic' ? 'مطب' : 'بیمارستان'
                        }`,
                        value: WaitingTimeList[waitingTime]
                    },
                    { id: 2, name: 'کدپیگیری', value: trackingCode }
                ]);
        setDetailsData([{ id: 1, name: 'زمان نوبت', value: dateAndTime }]);
    };

    return (
        <Card className="space-y-2 relative" style={{ opacity: status === 'deleted' && '0.5' }}>
            <TurnHeader
                id={id}
                doctorInfo={doctorInfo}
                centerId={centerInfo.centerId}
                trackingCode={turnDetails.trackingCode}
                nationalCode={patientInfo.nationalCode}
                status={status}
            />

            <TurnBody
                centerType={centerType}
                detailsData={detailsData}
                location={location}
                feedbackUrl={feedbackUrl}
                status={status}
            />

            <TurnFooter
                centerType={centerType}
                pdfLink={prescription.pdf}
                slug={doctorInfo.slug}
                status={status}
            />
        </Card>
    );
};

export default Turn;
