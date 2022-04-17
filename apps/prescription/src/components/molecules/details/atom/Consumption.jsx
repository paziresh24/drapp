import Select from '@paziresh24/shared/ui/select';
import { useEffect, useState } from 'react';
import consumptionData from '@paziresh24/constants/drugData/consumption.json';

const Consumption = ({ onChange, defaultValue, simple, error, focus, insuranceType }) => {
    const [consumption, setConsumption] = useState([]);

    useEffect(() => {
        reformatData();
    }, []);

    const reformatData = () => {
        const reformat = consumptionData[insuranceType].map(consumption => ({
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
