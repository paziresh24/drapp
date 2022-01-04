import styles from '../lists.module.scss';
import { useServices } from '@paziresh24/context/prescription/services-context';
import Count from './../../atom/Count';

const Number = ({ serviceId, value, editable = true, field, label, simple = true }) => {
    const [services, setServices] = useServices();

    const editNumber = number => {
        if (number) {
            services[services.findIndex(item => item.id === serviceId)][field] = number;
            setServices(services);
        }
    };

    return (
        <>
            {editable && (
                <Count
                    simple={simple}
                    label={label}
                    defaultValue={value}
                    onChange={value => editNumber(value)}
                />
            )}
            {!editable && <span>{value}</span>}
        </>
    );
};

export default Number;
