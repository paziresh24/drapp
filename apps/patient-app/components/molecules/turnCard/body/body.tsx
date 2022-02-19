import TurnDetails from '../../turnDetails';
import Location from './../../location/location';
import Rate from './../../rate/rate';

interface TurnBodyProps {
    detailsData: Array<{ id: number; name: string; value: string | React.ReactNode }>;
    status: 'expired' | 'deleted' | 'not_visited' | 'visited';
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
            {status !== 'deleted' && <TurnDetails items={detailsData} />}

            {centerType !== 'consult' && status !== 'expired' && status !== 'deleted' && (
                <Location address={location.address} lat={location.lat} lng={location.lng} />
            )}
            {centerType !== 'consult' && status === 'expired' && feedbackUrl && (
                <Rate link={feedbackUrl} />
            )}
        </>
    );
};

export default TurnBody;
