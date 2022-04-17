import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useServices } from '../../../../context/prescription/services-context';
import styles from './DiagnosisFiled.module.scss';
import Diagnosis from '../Diagnosis';
import { useDiagnosis } from '../../../../context/prescription/diagnosis-context';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { ChevronIcon } from '@paziresh24/shared/icon';
import { style } from 'dom-helpers';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useLearnTour } from '../../../../hooks/learn';

const DiagnosisFiled = ({ serviceId, onChange, type, defaultValue, label }) => {
    const [diagnosis, setDiagnosis] = useDiagnosis();
    const [showSerch, setShowSearch] = useState(false);
    const [prescriptionInfo] = useSelectPrescription();
    const [selectItem, setSelectItem] = useState({
        id: prescriptionInfo?.who_stem_id ?? '',
        name: prescriptionInfo?.diagnosis ?? '',
        shape: prescriptionInfo?.diagnosis ?? ''
    });
    const searchRef = useRef();
    const [searchValue, setSearchValue] = useState('');
    const { tourState, setSteps } = useLearnTour();
    const { search } = useLocation();
    const urlParams = queryString.parse(search);

    useEffect(() => {
        searchRef.current.value = selectItem.name;
        if (selectItem.name) {
            setDiagnosis({ ...selectItem });
            type === 'drugs' && setSteps(6);
        }
    }, [selectItem]);

    return (
        <div className={styles.wrapper} style={{ marginBottom: '3rem' }} id="diagnosis_step">
            <span>
                تشخیص خود را اینجا بنویسید. ( براساس{' '}
                <span style={{ fontFamily: 'initial' }}>ICD-11 </span>)
            </span>
            <label className={styles.inputWrapper}>
                <input
                    ref={searchRef}
                    className={styles.input}
                    defaultValue={diagnosis?.name ?? selectItem.name}
                    placeholder="تشخیص پزشک"
                    aria-hidden
                    style={{ direction: 'ltr' }}
                    onChange={e => {
                        setSearchValue(e.target.value);
                    }}
                    onFocus={() =>
                        setTimeout(() => {
                            setShowSearch(true);
                            tourState(false);
                        }, 200)
                    }
                    onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                    // readOnly
                />
                {/* <ChevronIcon className={styles.chevronIcon} dir={showSerch ? 'top' : 'bottom'} /> */}
            </label>
            <Diagnosis
                isOpen={showSerch}
                onClose={setShowSearch}
                serviceId={serviceId}
                setSelectItem={setSelectItem}
                type={type}
                searchValue={searchValue}
            />
        </div>
    );
};

export default DiagnosisFiled;
