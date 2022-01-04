import styles from './prescriptionSuccessed.module.scss';

import Modal from '../../core/modal';
import { CopyIcon } from '../../icons';
import { toast } from 'react-toastify';

const Prescriptionsuccessed = ({ isOpen, onClose, trackingCode, sequenceNumber }) => {
    const copybutton = () => {
        navigator.clipboard.writeText(trackingCode).then(
            () => {
                toast.info('کدپیگیری کپی شد.');
            },
            error => console.dir(error)
        );
    };

    return (
        <Modal title="اطلاعات نسخه" isOpen={isOpen} onClose={onClose}>
            <div className={styles['row']}>
                <div className={styles['col']} onClick={copybutton} aria-hidden>
                    <span className={styles['title']}>کدپیگیری</span>
                    <span className={styles['value']}>{trackingCode}</span>
                    <CopyIcon />
                </div>
                <div className={styles['col']}>
                    <span className={styles['title']}>کد توالی</span>
                    <span className={styles['value']}>{sequenceNumber}</span>
                </div>
            </div>
        </Modal>
    );
};

export { Prescriptionsuccessed };
