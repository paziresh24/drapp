import Text from '../../atoms/text';
import { ChevronIcon } from '@paziresh24/components/icons';

interface RateProps {
    link: string;
}

export const Rate: React.FC<RateProps> = props => {
    const { link } = props;
    return (
        <div className="flex items-center justify-between w-full bg-gray p-3 px-4 rounded-md">
            <Text>هنوز به این پزشک امتیازی نداده اید.</Text>
            <a href={link} className="flex items-center">
                <Text fontWeight="bold" className="text-secondary ml-2">
                    ثبت نظر
                </Text>
                <ChevronIcon dir="left" color="#27BDA0" width="12" height="15" />
            </a>
        </div>
    );
};

export default Rate;
