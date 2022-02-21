import TurnDetails from '../../turnDetails';
import Location from './../../location/location';
import Rate from './../../rate/rate';
import { BookStatus } from 'apps/patient-app/types/bookStatus';

interface TurnBodyProps {
    detailsData: Array<{ id: number; name: string; value: string | React.ReactNode }>;
    status: BookStatus;
    feedbackUrl: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    centerType: 'clinic' | 'hospital' | 'consult';
}

export const TurnBody: React.FC<TurnBodyProps> = props => {
    const { detailsData, status, feedbackUrl, location, centerType } = props;

    return (
        <>
            {status !== BookStatus.deleted && <TurnDetails items={detailsData} />}

            {centerType !== 'consult' &&
                status !== BookStatus.expired &&
                status !== BookStatus.deleted && (
                    <Location address={location.address} lat={location.lat} lng={location.lng} />
                )}
            {centerType !== 'consult' && status === BookStatus.expired && feedbackUrl && (
                <Rate link={feedbackUrl} />
            )}
        </>
    );
};

export default TurnBody;
