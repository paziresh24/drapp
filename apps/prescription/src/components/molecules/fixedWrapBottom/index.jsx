import styles from './fixedWrapBottom.module.scss';
import { CSSTransition } from 'react-transition-group';
import { useEffect, useState } from 'react';

const FixedWrapBottom = ({ children }) => {
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
            <div className={styles['wrapper']}>{children}</div>
        </CSSTransition>
    );
};

export default FixedWrapBottom;
