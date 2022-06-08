import styles from './fixedWrapBottom.module.scss';
import { CSSTransition } from 'react-transition-group';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { isMobile } from 'react-device-detect';

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
                <div className={classNames({ [styles['wrapper']]: true, [className]: className })}>
                    {children}
                </div>
            </CSSTransition>
        );

    return children;
};

export default FixedWrapBottom;
