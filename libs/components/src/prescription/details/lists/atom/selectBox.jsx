import styles from '../lists.module.scss';
import { useServices } from '@paziresh24/context/prescription/services-context';
import Consumption from './../../atom/Consumption';
import Instructions from './../../atom/Instructions';
import Amounts from './../../atom/Amounts';

import consumptionData from '@paziresh24/constants/drugData/consumption.json';
import amountData from '@paziresh24/constants/drugData/amounts.json';
import instructionsData from '@paziresh24/constants/drugData/instructions.json';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { useState, useEffect } from 'react';

const SelectBox = ({ serviceId, value, editable = true, field, type, service, simple = true }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!value) {
            return setError(true);
        }
        setError(false);
    }, [value]);

    const [services, setServices] = useServices();
    const changeAction = select => {
        if (select.id) {
            services[services.findIndex(item => item.id === serviceId)][field] = select.id;
            setServices(services);
            setError(false);
        }
    };

    return (
        <>
            {type === 'Consumption' &&
                (editable ? (
                    <Consumption
                        simple={simple}
                        onChange={value => changeAction(value)}
                        defaultValue={value}
                        error={error}
                    />
                ) : (
                    <span>
                        {
                            consumptionData[prescriptionInfo.insuranceType].find(
                                consumption => +consumption.id === +value
                            )?.name
                        }
                    </span>
                ))}

            {type === 'Instructions' &&
                (editable ? (
                    <Instructions
                        simple={simple}
                        onChange={value => changeAction(value)}
                        defaultValue={value}
                        error={error}
                    />
                ) : (
                    <span>
                        {
                            instructionsData[prescriptionInfo.insuranceType].find(
                                instructions => +instructions.id === +value
                            )?.name
                        }
                    </span>
                ))}

            {type === 'Amounts' &&
                (editable ? (
                    <Amounts
                        simple={simple}
                        onChange={value => changeAction(value)}
                        defaultValue={value}
                        shape={+service?.service?.shape?.id === 9 && service.service.shape.id}
                        error={error}
                    />
                ) : (
                    <span>
                        {
                            amountData[prescriptionInfo.insuranceType].find(
                                amount => +amount.id === +value
                            )?.name
                        }
                    </span>
                ))}
        </>
    );
};

export default SelectBox;
