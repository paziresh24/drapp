import Select from '../../../ui/Select/Select';
import { useEffect, useState } from 'react';
import amountData from '@paziresh24/constants/drugData/amounts.json';

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
            .filter(amount => (shape ? +amount.shape === +shape : true))
            .map(amount => ({
                name: amount.name.includes('ي') ? amount.name.replace(/ي/g, 'ی') : amount.name,
                value: amount.id
            }));

        setAmount(reformat);
    };

    return (
        <Select
            focus={focus}
            setFocus={setFocus}
            error={error}
            defaultValue={defaultValue}
            onChange={onChange}
            label="مقادیر مصرف"
            items={amount}
            simple={simple}
        />
    );
};

export default Amounts;
