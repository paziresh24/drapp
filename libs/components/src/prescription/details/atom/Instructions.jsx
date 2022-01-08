import Select from '../../../ui/Select/Select';
import { useEffect, useState } from 'react';
import instructionsData from '@paziresh24/constants/drugData/instructions.json';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';

const Instructions = ({ onChange, defaultValue, simple, error, focus, setFocus }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const [instructions, setInstructions] = useState([]);

    useEffect(() => {
        reformatData();
    }, []);

    const reformatData = () => {
        const reformat = instructionsData[prescriptionInfo.insuranceType].map(instruction => ({
            name: instruction.name.includes('ي')
                ? instruction.name.replace(/ي/g, 'ی')
                : instruction.name,
            value: instruction.id
        }));

        setInstructions(reformat);
    };

    return (
        <Select
            focus={focus}
            setFocus={setFocus}
            error={error}
            defaultValue={defaultValue}
            onChange={onChange}
            label="طریقه مصرف"
            items={instructions}
            simple={simple}
        />
    );
};

export default Instructions;
