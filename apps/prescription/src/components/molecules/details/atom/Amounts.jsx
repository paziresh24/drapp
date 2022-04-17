import Select from '@paziresh24/shared/ui/select';
import { useEffect, useState } from 'react';
import amountData from '@paziresh24/constants/drugData/amounts.json';
import Count from './Count';

const Amounts = ({
    onChange,
    defaultValue,
    simple,
    shape,
    error,
    focus,
    setFocus,
    insuranceType
}) => {
    const [amount, setAmount] = useState([]);

    useEffect(() => {
        reformatData();
    }, [shape]);

    const reformatData = () => {
        const reformat = amountData[insuranceType]
            .filter(amount => (shape ? +amount.shape.includes(shape.toString()) : true))
            .map(amount => ({
                name: amount.name.includes('ي') ? amount.name.replace(/ي/g, 'ی') : amount.name,
                value: amount.value
            }));

        setAmount(reformat);
    };

    return +shape === 5 || +shape === 10 ? (
        <Count
            label="میزان مصرف"
            defaultValue={defaultValue}
            simple={simple}
            autoWidth
            min={1}
            max={100}
            onChange={value => onChange({ name: value, id: value })}
        />
    ) : (
        <Select
            focus={focus}
            setFocus={setFocus}
            error={error}
            defaultValue={defaultValue}
            onChange={onChange}
            label="میزان مصرف"
            items={amount}
            simple={simple}
        />
    );
};

export default Amounts;
