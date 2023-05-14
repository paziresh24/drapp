import { PlusLineIcon, TrashIcon } from '@paziresh24/shared/icon';
import Button from '@paziresh24/shared/ui/button';
import TextField from '@paziresh24/shared/ui/textField';
import { digitsFaToEn } from '@persian-tools/persian-tools';
import isNaN from 'lodash/isNaN';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

function splitMulti(str, tokens) {
    var tempChar = tokens[0]; // We can use the first token as a temporary join character
    for (var i = 1; i < tokens.length; i++) {
        str = str.split(tokens[i]).join(tempChar);
    }
    str = str.split(tempChar);
    return str;
}
export const CenterPhoneNumbers = props => {
    const { phoneNumber = '', onChange } = props;
    const [list, setList] = useState([]);

    const handleOnChangeInput = (id, value) => {
        if (isNaN(+digitsFaToEn(value))) return;
        const newList = list.slice();
        setList(
            newList.map(item => (item.id === id ? { ...item, value: digitsFaToEn(value) } : item))
        );
    };

    const handleRemove = id => {
        const newList = list.slice();
        setList(newList.filter(item => item.id !== id));
    };

    useEffect(() => {
        const phoneNumbers = splitMulti(phoneNumber ?? '', ['-', '|', ',', '،', ' ']);
        setList(
            phoneNumbers.map(item => ({
                id: uuid(),
                value: item
            }))
        );
    }, []);

    useEffect(() => {
        if (onChange)
            onChange(
                list
                    .filter(item => item.value)
                    .map(item => item.value)
                    .join('|')
            );
    }, [list]);

    return (
        <div>
            <div className="flex flex-col space-y-4">
                {list.map((item, index) => (
                    <div key={item.id} className="flex items-center space-s-2">
                        <TextField
                            label={
                                list.length > 1 ? `شماره تلفن مطب (${index + 1})` : 'شماره تلفن مطب'
                            }
                            type="tel"
                            inputMode="number"
                            value={item.value}
                            onChange={e => handleOnChangeInput(item.id, e.target.value)}
                        />
                        {list.length > 1 && (
                            <Button
                                type="button"
                                onClick={() => handleRemove(item.id)}
                                icon={
                                    <TrashIcon
                                        color="currentColor"
                                        className="w-5 h-5 text-red-500"
                                    />
                                }
                                variant="secondary"
                                theme="error"
                                className="min-w-[3rem] !p-1 flex !justify-center !items-center"
                            />
                        )}
                    </div>
                ))}
            </div>
            <div
                className="flex items-center py-3 text-sm cursor-pointer"
                onClick={() => setList(prev => [...prev, { id: uuid(), value: '' }])}
            >
                <PlusLineIcon color="currentColor" className="text-primary" />
                <span className="text-primary">افزودن شماره تلفن جدید</span>
            </div>
        </div>
    );
};

export default CenterPhoneNumbers;
