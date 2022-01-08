import styles from './textField.module.scss';
import classNames from 'classnames';
import { forwardRef } from 'react';

const TextField = forwardRef((props, ref) => {
    return (
        <label
            className={classNames({
                [styles['wrapper']]: true,
                [styles['disabled']]: props.disabled,
                [props.className]: props.className
            })}
        >
            <input
                className={classNames({ [styles['input']]: true, [styles['error']]: props.error })}
                disabled={props.disabled}
                type={props.type}
                value={props.value}
                defaultValue={props.defaultValue}
                name={props.name}
                placeholder=" "
                onChange={props.onChange}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                ref={ref}
                style={props.style}
                onKeyDown={props.onKeyDown}
                autoComplete="off"
                inputMode={props.inputMode}
                min={props.min}
            />
            <span className={styles['label']}>{props.label}</span>
            {props.errorText && props.error && (
                <span className={styles['error-text']}>{props.errorText}</span>
            )}
        </label>
    );
});

export default TextField;
