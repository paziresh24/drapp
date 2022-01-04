import Select from '../../../ui/Select/Select';
import { useEffect, useState } from 'react';
import consumptionData from '@paziresh24/constants/drugData/consumption.json';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';

const Consumption = ({ onChange, defaultValue, simple, error, focus }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const [consumption, setConsumption] = useState([]);

    useEffect(() => {
        reformatData();
    }, []);

    const reformatData = () => {
        const reformat = consumptionData[prescriptionInfo.insuranceType].map(consumption => ({
            name: consumption.name.includes('ي')
                ? consumption.name.replace(/ي/g, 'ی')
                : consumption.name,
            value: consumption.id
        }));

        setConsumption(reformat);
    };

    return (
        <Select
            error={error}
            focus={focus}
            defaultValue={defaultValue && defaultValue}
            onChange={onChange}
            label="زمان مصرف"
            items={consumption}
            simple={simple}
        />
    );
};

export default Consumption;
