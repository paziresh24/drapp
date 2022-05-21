import styles from './fixedWrapBottom.module.scss';
import { CSSTransition } from 'react-transition-group';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

const FixedWrapBottom = ({ children, className }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

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
};

export default FixedWrapBottom;
