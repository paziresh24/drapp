import { useEffect, useState } from 'react';
import styles from './switch.module.scss';

const Switch = ({ title, checked, status }) => {
    const [switchId, setSwitchId] = useState('');
    const [switchValue, setSwitchValue] = useState(checked);

    useEffect(() => {
        setSwitchId(uniqID());
        status(switchValue);
    }, [switchValue]);

    const uniqID = () => {
        return 1 + Math.floor(Math.random() * 100000).toString();
    };

    const changeValue = () => {
        setSwitchValue(prevValue => !prevValue);
    };

    return (
        <div className={styles['switch']}>
            <input type="checkbox" id={switchId} checked={switchValue} onChange={changeValue} />
            <label htmlFor={switchId}>{title}</label>
        </div>
    );
};

Switch.defaultProps = {
    checked: false
};

export { Switch };
