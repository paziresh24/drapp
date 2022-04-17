import consumptionData from '../../../constants/drugData/consumption.json';
import styles from './patientCase.module.scss';

import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';

const item = ({ service, setItemsSelect }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [prescriptionInfo] = useSelectPrescription();

    return (
        <div key={service.id} className={styles.service}>
            <input
                className={styles['inp-cbx']}
                id={service.id}
                type="checkbox"
                style={{ display: 'none' }}
                onChange={e =>
                    e.target.checked
                        ? setItemsSelect(prevState => [...prevState, service])
                        : setItemsSelect(prevState =>
                              prevState.filter(item2 => item2.id !== service.id)
                          )
                }
            />
            <label className={styles['cbx']} htmlFor={service.id}>
                <span>
                    <svg width="12px" height="9px" viewBox="0 0 12 9">
                        <polyline points="1 5 4 8 11 1" />
                    </svg>
                </span>
                <div className={styles.itemName}>
                    <span
                        //   onClick={() => addItemService(item)}
                        aria-hidden
                    >
                        {service.service.name}
                        {' | '}
                    </span>
                    <span>
                        {
                            consumptionData[prescriptionInfo.insuranceType].find(
                                item => item.id === service.use_time
                            )?.name
                        }
                    </span>
                    <span> {service.count} عدد</span>
                </div>
            </label>
        </div>
    );
};

export default item;
