import styles from './counter.module.scss';

import CirclePlusIcon from '@paziresh24/shared/icon/public/circlePlus';
import CircleMinusIcon from '@paziresh24/shared/icon/public/circleMinus';
import { useEffect, useState } from 'react';

const Counter = props => {
    const [value, setValue] = useState(props.defaultValue ? props.defaultValue : 1);

    useEffect(() => {
        if (props.defaultValue) setValue(props.defaultValue);
    }, [props.defaultValue]);

    useEffect(() => {
        props.value && value && props.value(value);
    }, [value, props]);

    const increase = () => {
        if (props?.max) {
            if (props?.max > value) {
                return setValue(prevValue => prevValue + props.defaultCount);
            }
        } else {
            setValue(prevValue => prevValue + props.defaultCount);
        }
    };

    const decrease = () => {
        const result = value - props.defaultCount;
        if (result >= 1) setValue(prevValue => prevValue - props.defaultCount);
    };

    const inputHandler = e => {
        if (e.target.value != 0) setValue(e.target.value);
    };

    return (
        <div className={styles['wrapper']}>
            <label>{props.label}</label>
            <div className={styles['row']}>
                <button className={styles['button']} onClick={increase}>
                    <CirclePlusIcon />
                    افزایش
                </button>
                <input
                    type="tel"
                    data-type={props.type ? props.type : undefined}
                    className={styles['input']}
                    value={props.type ? `${value} ${props.type}` : value}
                    onChange={inputHandler}
                    disabled={props.type}
                />
                <button className={styles['button']} onClick={decrease}>
                    <CircleMinusIcon />
                    کاهش
                </button>
            </div>
        </div>
    );
};

Counter.defaultProps = {
    defaultCount: 1
};

export default Counter;
