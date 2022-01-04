import { useEffect, useState } from 'react';
import styles from './turnStatusCheckbox.module.scss';

const TurnStatusCheckbox = ({ title, checked, status }) => {
    const [switchId, setSwitchId] = useState('');
    const [switchValue, setSwitchValue] = useState(checked);

    useEffect(() => {
        setSwitchId(uniqID());
    }, []);

    const uniqID = () => {
        return 1 + Math.floor(Math.random() * 5000).toString();
    };

    const changeValue = () => {
        setSwitchValue(prevValue => {
            // status(!prevValue);
            return !prevValue;
        });
    };

    return (
        <div className={styles['switch']}>
            <input type="checkbox" id={switchId} checked={switchValue} onChange={changeValue} />
            <label htmlFor={switchId}>{title}</label>
        </div>
    );
};

TurnStatusCheckbox.defaultProps = {
    checked: false
};

export { TurnStatusCheckbox };
