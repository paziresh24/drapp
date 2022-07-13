import styles from './textField.module.scss';
import classNames from 'classnames';
import { forwardRef, useState } from 'react';

const TextField = forwardRef(({ autoComplete = 'off', ...props }, ref) => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    return (
        <label
            className={classNames({
                [styles['wrapper']]: true,
                [styles['disabled']]: props.disabled,
                [props.className]: props.className
            })}
        >
            <input
                className={classNames({
                    [styles['input']]: true,
                    [styles['error']]: props.error,
                    [styles.password]: props.type === 'password'
                })}
                disabled={props.disabled}
                type={isShowPassword ? 'text' : props.type}
                value={props.value}
                defaultValue={props.defaultValue}
                name={props.name}
                placeholder={props.placeHolder ? props.placeHolder : ' '}
                onChange={props.onChange}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                ref={ref}
                style={props.style}
                onKeyDown={props.onKeyDown}
                autoComplete={autoComplete}
                inputMode={props.inputMode}
                min={props.min}
                max={props.max}
                data-testid={props.testId}
                maxLength={props.maxLength}
            />
            <span className={styles['label']}>{props.label}</span>
            {props.type === 'password' && (
                <span
                    className={styles['show-password']}
                    onClick={() => setIsShowPassword(prev => !prev)}
                >
                    {isShowPassword ? (
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.53023 2.4697C3.23734 2.17681 2.76247 2.17681 2.46957 2.4697C2.17668 2.76259 2.17668 3.23747 2.46957 3.53036L5.13723 6.19801C3.91106 7.01861 2.99173 8.00411 2.35714 8.96369C1.64412 10.0419 1.25 11.1513 1.25 12C1.25 12.6616 1.48923 13.4704 1.91294 14.284C2.34365 15.1109 2.99041 15.9926 3.86629 16.8011C5.62703 18.4264 8.30768 19.75 12 19.75C14.1796 19.75 16.0109 19.2887 17.5107 18.5715L20.4696 21.5304C20.7625 21.8233 21.2373 21.8233 21.5302 21.5304C21.8231 21.2375 21.8231 20.7626 21.5302 20.4697L3.53023 2.4697ZM16.3748 17.4356L14.0679 15.1287C13.4751 15.5211 12.7637 15.75 11.9999 15.75C9.92883 15.75 8.2499 14.0711 8.2499 12C8.2499 11.2363 8.47885 10.5248 8.87127 9.93206L6.22202 7.2828C5.0408 8.01882 4.17938 8.92754 3.60829 9.7911C2.98821 10.7287 2.75 11.5502 2.75 12C2.75 12.3384 2.88577 12.9046 3.24331 13.5911C3.59385 14.2641 4.13459 15.0074 4.88371 15.6989C6.37297 17.0736 8.69232 18.25 12 18.25C13.7211 18.25 15.1715 17.9315 16.3748 17.4356ZM9.96904 11.0298C9.82845 11.3235 9.7499 11.6522 9.7499 12C9.7499 13.2427 10.7573 14.25 11.9999 14.25C12.3477 14.25 12.6765 14.1715 12.9701 14.0309L9.96904 11.0298ZM12 5.75001C10.9594 5.75001 10.0189 5.86643 9.17331 6.06728C8.7703 6.16299 8.36601 5.91388 8.2703 5.51088C8.17458 5.10788 8.42369 4.70359 8.82669 4.60787C9.78973 4.37915 10.8467 4.25001 12 4.25001C15.6923 4.25001 18.373 5.5736 20.1337 7.1989C21.0096 8.00741 21.6564 8.88909 22.0871 9.71606C22.5108 10.5296 22.75 11.3384 22.75 12C22.75 13.2108 21.9456 15.0051 20.4152 16.5311C20.1218 16.8236 19.647 16.8229 19.3545 16.5296C19.062 16.2362 19.0627 15.7614 19.3561 15.4689C20.7151 14.1139 21.25 12.6791 21.25 12C21.25 11.6616 21.1142 11.0954 20.7567 10.409C20.4061 9.73592 19.8654 8.9926 19.1163 8.30111C17.627 6.92641 15.3077 5.75001 12 5.75001Z"
                                fill="#22282F"
                            />
                        </svg>
                    ) : (
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2.75 12C2.75 11.6616 2.88577 11.0954 3.24331 10.409C3.59385 9.73591 4.13459 8.9926 4.88371 8.3011C6.37297 6.9264 8.69232 5.75 12 5.75C15.3077 5.75 17.627 6.9264 19.1163 8.3011C19.8654 8.9926 20.4061 9.73591 20.7567 10.409C21.1142 11.0954 21.25 11.6616 21.25 12C21.25 12.3384 21.1142 12.9046 20.7567 13.591C20.4061 14.2641 19.8654 15.0074 19.1163 15.6989C17.627 17.0736 15.3077 18.25 12 18.25C8.69232 18.25 6.37297 17.0736 4.88371 15.6989C4.13459 15.0074 3.59385 14.2641 3.24331 13.591C2.88577 12.9046 2.75 12.3384 2.75 12ZM12 4.25C8.30768 4.25 5.62703 5.5736 3.86629 7.1989C2.99041 8.0074 2.34365 8.88909 1.91294 9.71605C1.48923 10.5296 1.25 11.3384 1.25 12C1.25 12.6616 1.48923 13.4704 1.91294 14.284C2.34365 15.1109 2.99041 15.9926 3.86629 16.8011C5.62703 18.4264 8.30768 19.75 12 19.75C15.6923 19.75 18.373 18.4264 20.1337 16.8011C21.0096 15.9926 21.6564 15.1109 22.0871 14.284C22.5108 13.4704 22.75 12.6616 22.75 12C22.75 11.3384 22.5108 10.5296 22.0871 9.71605C21.6564 8.88909 21.0096 8.0074 20.1337 7.1989C18.373 5.5736 15.6923 4.25 12 4.25ZM9.7499 12C9.7499 10.7574 10.7573 9.75002 11.9999 9.75002C13.2425 9.75002 14.2499 10.7574 14.2499 12C14.2499 13.2427 13.2425 14.25 11.9999 14.25C10.7573 14.25 9.7499 13.2427 9.7499 12ZM11.9999 8.25002C9.92883 8.25002 8.2499 9.92896 8.2499 12C8.2499 14.0711 9.92883 15.75 11.9999 15.75C14.071 15.75 15.7499 14.0711 15.7499 12C15.7499 9.92896 14.071 8.25002 11.9999 8.25002Z"
                                fill="#22282F"
                            />
                        </svg>
                    )}
                </span>
            )}
            {props.errorText && props.error && (
                <span className={styles['error-text']}>{props.errorText}</span>
            )}
        </label>
    );
});

export default TextField;
