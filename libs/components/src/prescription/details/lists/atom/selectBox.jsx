import Consumption from './../../atom/Consumption';
import Instructions from './../../atom/Instructions';
import Amounts from './../../atom/Amounts';

import consumptionData from '@paziresh24/constants/drugData/consumption.json';
import amountData from '@paziresh24/constants/drugData/amounts.json';
import instructionsData from '@paziresh24/constants/drugData/instructions.json';

const SelectBox = ({
    serviceId,
    value,
    editable = true,
    field,
    type,
    service,
    simple = true,
    insuranceType,
    services,
    setServices
}) => {
    const changeAction = select => {
        if (select) {
            services[services.findIndex(item => item.id === serviceId)][field] = select.id;
            setServices(services);
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
                        insuranceType={insuranceType}
                    />
                ) : (
                    <span>
                        {
                            consumptionData[insuranceType].find(
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
                        insuranceType={insuranceType}
                    />
                ) : (
                    <span>
                        {
                            instructionsData[insuranceType].find(
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
                        shape={service?.service?.shape?.id}
                        insuranceType={insuranceType}
                    />
                ) : (
                    <span>
                        {amountData[insuranceType].find(amount => +amount.id === +value)?.name}
                    </span>
                ))}
        </>
    );
};

export default SelectBox;
