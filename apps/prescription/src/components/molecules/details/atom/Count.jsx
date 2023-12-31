import TextField from '@paziresh24/shared/ui/textField';
import { useEffect, useRef } from 'react';
import styles from './Count.module.scss';

const Count = ({
    defaultValue,
    onChange,
    label,
    simple,
    error,
    focus,
    setFocus,
    autoWidth,
    min,
    max
}) => {
    const ref = useRef();

    useEffect(() => {
        ref.current.value = defaultValue;
    }, [defaultValue]);

    useEffect(() => {
        focus ? ref.current.focus() : ref.current.blur();
    }, [focus]);

    const handleOnBlur = () => {
        setFocus && setFocus(false);
        if (ref.current.value < 1) {
            ref.current.value = 1;
            onChange(1);
        }
    };

    return (
        <TextField
            ref={ref}
            error={error}
            label={label ?? 'تعداد'}
            type="number"
            onBlur={handleOnBlur}
            min={min ?? '1'}
            max={max}
            className={`${!autoWidth && styles.countInput} ${simple ? styles.simple : ''}`}
            onChange={e => onChange(e.target.value ?? null)}
        />
    );
};

export default Count;
