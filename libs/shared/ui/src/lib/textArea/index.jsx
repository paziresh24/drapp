import { useState, useEffect, forwardRef } from 'react';
import styles from './textArea.module.scss';
import classNames from 'classnames';

const TextArea = forwardRef((props, ref) => {
    return (
        <label
            className={classNames({
                [styles['wrapper']]: true,
                [styles['disabled']]: props.disabled
            })}
        >
            <textarea
                className={styles['input']}
                name=""
                id=""
                cols="30"
                rows="10"
                defaultValue={props['default-value']}
                value={props.value}
                placeholder=" "
                ref={ref}
                onChange={e => props.onChange && props.onChange(e.target.value)}
            />
            <span className={styles['label']}>{props.label}</span>
        </label>
    );
});

export default TextArea;
