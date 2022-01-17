import styles from './ToolBox.module.scss';
import { Tabs, Tab } from '@paziresh24/components/core/tab';
import Favorite from './Favorite';
import Template from './Template';
import History from './History';
import { ChevronIcon } from '@paziresh24/components/icons';
import { useEffect, useRef } from 'react';
import { useToolBox } from '@paziresh24/context/prescription/toolBox.context';
import { isMobile } from 'react-device-detect';
import Modal from '@paziresh24/components/core/modal';
import { CloseIcon } from '../../../icons';
import { useMediaQuery } from 'react-responsive';

const ToolBox = () => {
    const [isOpen, setIsOpen] = useToolBox();
    const isSmallSize = useMediaQuery({ query: '(max-width: 1438px)' });

    useEffect(() => {
        if (isSmallSize) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }, [isSmallSize]);

    const gutter = useRef();
    const pane = useRef();

    useEffect(() => {
        function resizer(e) {
            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);

            let prevX = e.x;
            const panel = pane.current.getBoundingClientRect();

            function mousemove(e) {
                let newX = prevX - e.x;
                pane.current.style.width = panel.width - newX + 'px';
            }

            function mouseup() {
                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            }
        }

        !isMobile && gutter.current.addEventListener('mousedown', resizer);
    }, []);

    return isMobile ? (
        <Modal title="" fullPage noBodyPad isOpen={isOpen} onClose={setIsOpen} noHeader>
            <div className={`${styles.wrapper} ${styles.mobile}`}>
                <div
                    className="absolute top-[1.3rem] left-[1.2rem]"
                    style={{ position: 'absolute', top: '1.3rem', left: '1.2rem' }}
                    onClick={() => setIsOpen(false)}
                    aria-hidden
                >
                    <CloseIcon color="#3f3f79" />
                </div>
                <ToolBoxContent />
            </div>
        </Modal>
    ) : (
        <>
            {/* {isSmallSize && isOpen && (
                // <div className={styles.mask} onClick={() => setIsOpen(prev => !prev)} aria-hidden />
            )} */}
            {/* <ResizePanel
                direction="e"
                style={{ width: '35rem', maxWidth: '60rem', direction: 'ltr' }}
                handleClass={styles.customHandle}
            > */}
            <div className={`${styles.wrapper} ${!isOpen ? styles.hide : ''}`} ref={pane}>
                <div className={styles.gutter} ref={gutter} />

                <ToolBoxContent />
                <button
                    className={`${styles.close} ${!isOpen ? styles.right : ''}`}
                    onClick={() => setIsOpen(prev => !prev)}
                >
                    <ChevronIcon dir={isOpen ? 'left' : 'right'} />
                </button>
            </div>
            {/* </ResizePanel> */}
        </>
    );
};

const ToolBoxContent = () => {
    return (
        <Tabs center={!isMobile}>
            <Tab title="ستاره دار">
                <Favorite />
            </Tab>
            <Tab title="نسخ پراستفاده">
                <Template />
            </Tab>
            <Tab title="سوابق">
                <History />
            </Tab>
        </Tabs>
    );
};

export default ToolBox;
