import Aavatar from '../../atoms/avatar';
import Text from '../../atoms/text';

interface DoctorInfoProps {
    avatar?: string;
    firstName: string;
    lastName: string;
    expertise?: string;
}

export const DoctorInfo: React.FC<DoctorInfoProps> = props => {
    const { avatar, firstName, lastName, expertise } = props;
    return (
        <div className="flex items-center">
            <Aavatar src={avatar} />
            <div className="flex flex-col mr-4">
                <Text fontSize="lg" fontWeight="bold">
                    {firstName} {lastName}
                </Text>
                {expertise && (
                    <Text fontSize="sm" className="mt-1">
                        {expertise}
                    </Text>
                )}
            </div>
        </div>
    );
};

export default DoctorInfo;
