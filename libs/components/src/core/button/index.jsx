import classNames from 'classnames';
import styles from './button.module.scss';
import PropTypes from 'prop-types';

import { ChevronIcon } from '../../icons/';
import LoadingIcon from '../../icons/public/loading';

const Button = props => {
    const buttonClass = classNames({
        [styles['btn']]: true,
        [styles['full-with']]: props.block,
        [styles['icon']]: props.icon,
        [styles[props.size]]: props.size,
        [styles[props.variant]]: props.variant,
        [props.className]: props.className,
        [styles[props.theme]]: props.theme,
        [styles['loading']]: props.loading,
        [styles['square']]: props.square
    });

    const buttonIcon =
        props.icon === 'arrow' ? (
            <ChevronIcon color={props.disabled ? '#91A5B6' : 'rgba(255, 255, 255, 0.66)'} />
        ) : (
            props.icon
        );

    return (
        <button
            onClick={props.onClick}
            className={buttonClass}
            disabled={props.loading || props.disabled}
            type={props.type}
            style={props.style}
            id={props.id}
        >
            {props.loading && !buttonIcon ? (
                <LoadingIcon
                    color={
                        props.variant === 'secondary'
                            ? props.theme !== 'error'
                                ? '#27bda0'
                                : '#f56262'
                            : ' #fff'
                    }
                />
            ) : props.buttonIcon ? (
                props.buttonIcon
            ) : (
                props.children && <span className={styles['text']}>{props.children}</span>
            )}
            {buttonIcon && props.loading ? <LoadingIcon /> : buttonIcon}
        </button>
    );
};

Button.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary']).isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    theme: PropTypes.oneOf(['error', 'success']),
    block: PropTypes.bool
};

Button.defaultProps = {
    icon: '',
    variant: 'primary',
    loading: false,
    theme: 'success'
};

export default Button;
