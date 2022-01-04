import { useLayoutEffect, useState } from 'react';
import styles from './TitleBar.module.scss';

import FavoriteFolder from 'components/prescription/favoriteFolder';
import PatientCase from 'components/prescription/patientCase';
import PrescriptionTemplates from '../../prescriptionTemplates';

import DrugIcon from './icon/drugIcon.png';
import LabIcon from './icon/labIcon.png';
import OthersIcon from './icon/othersIcon.png';
import ReactTooltip from 'react-tooltip';
import { sendEvent } from '@paziresh24/utils';
import { useLearnTour } from '../../../../hooks/learn';

const TitleBar = ({ type }) => {
    const [prescriptionTemplatesModal, setPrescriptionTemplatesModal] = useState(false);
    const [patientCaseModal, setPatientCaseModal] = useState(null);
    const [favoriteFolderModal, setFavoriteFolderModal] = useState(null);
    const [title, setTitle] = useState('');
    const [icon, setIcon] = useState('');
    const { tourState, setSteps } = useLearnTour();

    useLayoutEffect(() => {
        if (type === 'drugs') {
            setIcon(DrugIcon);
            return setTitle('دارو');
        }
        if (type === 'bulkDrugs') {
            setIcon(DrugIcon);
            return setTitle('دارو ترکیبی');
        }
        if (type === 'lab') {
            setIcon(LabIcon);
            return setTitle('آزمایشگاه');
        }
        if (type === 'others') {
            setIcon(OthersIcon);
            return setTitle('تصویربرداری، فیزیوتراپی، خدمات پزشکی');
        }
    }, [type]);

    const favoriteFolderAction = () => {
        sendEvent('clickfavorite', 'prescription', 'clickfavorite');
        setFavoriteFolderModal(true);
        setTimeout(() => setSteps(17), 0);
    };

    const prescriptionTemplatesAction = () => {
        setSteps(10);
        sendEvent('clickcollection', 'prescription', 'clickcollection');
        setPrescriptionTemplatesModal(true);
    };

    const patientCaseAction = () => {
        sendEvent('clickhistory', 'prescription', 'clickhistory');
        setPatientCaseModal(true);
        setSteps(13);
    };

    return (
        <>
            <div className={styles.bar}>
                <div className={styles.title}>
                    <img src={icon} alt="" />
                    <span>تجویز {title}</span>
                </div>
                <div className={styles.actions}>
                    <button
                        className={styles.action}
                        onClick={favoriteFolderAction}
                        data-tip
                        data-for="favhint"
                        id="favorite_button_step"
                    >
                        اقلام پراستفاده
                    </button>
                    <ReactTooltip id="favhint" place="top" type="dark" effect="solid">
                        دارو، آزمایش و یا خدمت پاراکلینیکی که توسط پزشک ستاره دار شده است
                    </ReactTooltip>

                    <button
                        className={styles.action}
                        onClick={prescriptionTemplatesAction}
                        data-tip
                        data-for="usehint"
                        id="template_button_step"
                    >
                        نسخ پراستفاده
                    </button>

                    <ReactTooltip id="usehint" place="top" type="dark" effect="solid">
                        بعد از انتخاب اقلام یک نسخه، از گزینه &quot;افزودن نسخه فعلی&quot; آن نسخه
                        را بعنوان نسخه پرتکرار خود ذخیره کنید تا در تجویزهای بعدی از آن استفاده
                        کنید.
                    </ReactTooltip>

                    <button
                        className={styles.action}
                        onClick={patientCaseAction}
                        data-tip
                        data-for="casehint"
                        id="pcase_button_step"
                    >
                        سوابق
                    </button>

                    <ReactTooltip id="casehint" place="top" type="dark" effect="solid">
                        کلیه سوابق بیمار که در سامانه پذیرش24 ثبت شده است
                    </ReactTooltip>
                </div>
            </div>
            <PrescriptionTemplates
                isOpen={prescriptionTemplatesModal}
                onClose={setPrescriptionTemplatesModal}
            />
            {/* <FavoriteFolder
                type={type}
                isOpen={favoriteFolderModal}
                onClose={setFavoriteFolderModal}
            /> */}
            <PatientCase isOpen={patientCaseModal} onClose={setPatientCaseModal} />
        </>
    );
};

export default TitleBar;
