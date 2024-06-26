import styles from './fixedWrapBottom.module.scss';
import { CSSTransition } from 'react-transition-group';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { isMobile } from 'react-device-detect';
import { isEmbed } from '@paziresh24/shared/utils';

const FixedWrapBottom = ({ children, className = '' }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    if (isMobile)
        return (
            <CSSTransition
                in={show}
                timeout={300}
                classNames={{
                    enterDone: styles['show']
                }}
            >
                <div
                    className={classNames('border-t border-solid border-[#e8ecf0]', {
                        [styles['wrapper']]: true,
                        [className]: className,
                        '!bottom-0': isEmbed()
                    })}
                >
                    {children}
                </div>
            </CSSTransition>
        );

    return <div className={classNames(className, styles['wrapper'])}>{children}</div>;
};

export default FixedWrapBottom;
