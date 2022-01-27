import TextField from '../../../core/textField';
import { useEffect, useRef } from 'react';
import styles from './Count.module.scss';

const Count = ({ defaultValue, onChange, label, simple, error, focus, setFocus }) => {
    const ref = useRef();

    useEffect(() => {
        ref.current.value = +defaultValue;
    }, [defaultValue]);

    useEffect(() => focus && ref.current.focus(), [focus]);

    return (
        <TextField
            ref={ref}
            error={error}
            label={label ?? 'تعداد'}
            type="number"
            min="1"
            onBlur={() => setFocus(false)}
            className={`${styles.countInput} ${simple ? styles.simple : ''}`}
            onChange={e => onChange(+e.target.value ?? null)}
        />
    );
};

export default Count;
