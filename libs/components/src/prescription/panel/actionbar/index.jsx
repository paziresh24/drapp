import styles from './actionbar.module.scss';
import { ChevronIcon, HouseIcon, ThreeDots } from '../../../icons/';
import { useState } from 'react';
import Modal from '../../../core/modal';
import Button from '../../../core/button';
import { useHistory } from 'react-router-dom';

const ActionBar = props => {
    const [exitModal, setExitModal] = useState(false);
    const history = useHistory();

    const exit = () => {
        localStorage.removeItem('token');
        window.location.replace('/providers/');
    };

    const home = () => {
        history.push('/');
    };

    return (
        <>
            <div className={styles['wrapper']}>
                <div className={styles['back-button']} onClick={() => history.goBack()} aria-hidden>
                    <ChevronIcon dir="right" />
                    <span>بازگشت</span>
                </div>
                <div className={styles['actions']}>
                    <HouseIcon className={styles['home']} onClick={home} />
                    <ThreeDots className={styles['menu']} color="#3f3f79" />
                    <ul className={styles['drop-down']}>
                        <li>
                            <span onClick={() => setExitModal(true)} aria-hidden>
                                خروج
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <Modal title="آیا از خروج مطمئن می باشید؟" isOpen={exitModal} onClose={setExitModal}>
                <div className={styles['confirmModal-row']}>
                    <Button block variant="primary" onClick={() => exit()}>
                        بله
                    </Button>
                    <Button block variant="secondary" onClick={() => setExitModal(false)}>
                        بازگشت
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export { ActionBar };
