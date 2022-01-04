import Select from '../../../ui/Select/Select';
import { useEffect, useState } from 'react';

const Amounts = ({ onChange, items, defaultValue }) => {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        items.map(brand => {
            setBrands(brands => [
                ...brands,
                {
                    name: brand.name.includes('ي') ? brand.name.replace(/ي/g, 'ی') : brand.name,
                    value: brand.id
                }
            ]);
        });
    }, [items]);

    return <Select defaultValue={defaultValue} onChange={onChange} label="برند" items={brands} />;
};

export default Amounts;
