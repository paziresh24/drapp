import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';

import styles from './modal.module.scss';
import CloseIcon from '../../icons/public/close';

import { isMobile } from 'react-device-detect';

const Modal = ({
    isOpen,
    onClose,
    title,
    icon = undefined,
    children,
    noHeader = false,
    noBodyPadding = false,
    fullPage = false,
    maxWidth = undefined,
    id = undefined
}) => {
    const neutralizeBack = () => {
        if (isMobile) {
            window.history.pushState(null, '', window.location.href);
            window.onpopstate = () => {
                window.onpopstate = () => {
                    return;
                };
                document.body.classList.remove(styles['open-modal']);
                onClose(false);
            };
        }
    };

    useEffect(() => {
        if (isOpen) {
            neutralizeBack();
            return document.body.classList.add(styles['open-modal']);
        } else {
            document.body.classList.remove(styles['open-modal']);
            if (isMobile) {
                window.onpopstate = () => {
                    return;
                };
                // history.back();
            }
        }
    }, [isOpen]);

    const closeModalHandler = () => {
        if (isMobile) {
            window.onpopstate = () => {
                return;
            };
            window.history.back();
        }
        document.body.classList.remove(styles['open-modal']);
        onClose(false);
    };

    return ReactDOM.createPortal(
        <CSSTransition
            in={isOpen}
            timeout={100}
            classNames={{
                enterDone: styles['show']
            }}
            unmountOnExit
        >
            <div className={styles['root']} onClick={closeModalHandler}>
                <div className={styles['mask']} aria-hidden>
                    <div
                        className={classNames({
                            [styles['wrap']]: true,
                            [styles['fullPage']]: fullPage
                        })}
                        onClick={e => e.stopPropagation()}
                        id={id}
                        style={{ maxWidth: !isMobile && maxWidth }}
                    >
                        {!noHeader && (
                            <div className={styles['header']}>
                                <div className={styles['title-wraper']}>
                                    {icon}
                                    <span className={styles['title']}>{title}</span>
                                </div>
                                <CloseIcon
                                    className={styles['close-button']}
                                    onClick={closeModalHandler}
                                />
                            </div>
                        )}
                        <div
                            className={classNames({
                                [styles['body']]: true,
                                [styles['scrollable']]: fullPage
                            })}
                            style={{ padding: noBodyPadding ? '0' : null }}
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </CSSTransition>,
        document.body
    );
};

export default Modal;
