import Card from '../../atoms/card';
import DoctorInfo from './../../molecules/doctorInfo';

interface ClinicTurnProps {
    address: string;
    lat: number;
    long: number;
}

export const ClinicTurn: React.FC<ClinicTurnProps> = props => {
    const { address, lat, long } = props;
    return (
        <Card>
            <DoctorInfo firstName="دکتر امیرحسین" lastName="بیگی" expertise="پزشک عمومی" />
        </Card>
    );
};

export default ClinicTurn;
