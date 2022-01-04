import { useEffect, useRef, useState } from 'react';
import styles from './accordion.module.scss';
import className from 'classnames';
import { ChevronIcon } from '../../icons';
const Accordion = ({ title, icon, children, open, setOpen }) => {
    const [isOpen, setIsOpen] = useState(open);
    const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop);
    const myRef = useRef(null);
    const executeScroll = () => scrollToRef(myRef);

    const toggleAccordion = () => {
        executeScroll();
        setIsOpen(prevValue => !prevValue);
        setOpen && setOpen(prevValue => !prevValue);
    };

    useEffect(() => {
        setOpen && setIsOpen(open);
    }, [open]);

    return (
        <div className={styles['accordion']} ref={myRef}>
            <div
                className={className(styles['inner'], { [styles['open']]: isOpen })}
                onClick={toggleAccordion}
                aria-hidden
            >
                <div className={styles['inside']}>
                    {icon}
                    <span>{title}</span>
                </div>
                <ChevronIcon dir={isOpen ? 'top' : 'bottom'} />
            </div>
            {isOpen && <div className={styles['content']}>{children}</div>}
        </div>
    );
};

Accordion.defaultProps = {
    open: false
};

export { Accordion };
