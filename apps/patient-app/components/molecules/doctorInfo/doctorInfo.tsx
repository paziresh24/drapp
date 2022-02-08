import Aavatar from '../../atoms/avatar';
import Text from '../../atoms/Text';

interface DoctorInfoProps {
    avatar?: string;
    firstName: string;
    lastName: string;
    expertise: string;
}

export const DoctorInfo: React.FC<DoctorInfoProps> = props => {
    const { avatar, firstName, lastName, expertise } = props;
    return (
        <div className="flex items-center">
            <Aavatar src={avatar} />
            <div className="flex flex-col">
                <Text fontSize="lg">
                    {firstName} {lastName}
                </Text>
                <Text fontSize="sm">{expertise}</Text>
            </div>
        </div>
    );
};

export default DoctorInfo;
