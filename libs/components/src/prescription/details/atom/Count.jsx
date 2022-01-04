import TextField from '../../../core/textField';
import { useEffect, useRef } from 'react';
import styles from './Count.module.scss';

const Count = ({ defaultValue, onChange, label, simple, error }) => {
    const ref = useRef();

    useEffect(() => {
        ref.current.value = defaultValue;
    }, [defaultValue]);

    return (
        <TextField
            ref={ref}
            error={error}
            label={label ?? 'تعداد'}
            type="number"
            className={`${styles.countInput} ${simple ? styles.simple : ''}`}
            onChange={e => onChange(e.target.value ?? null)}
        />
    );
};

export default Count;
