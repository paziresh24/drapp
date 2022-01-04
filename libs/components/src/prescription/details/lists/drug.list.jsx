import styles from './lists.module.scss';
import { useServices } from '@paziresh24/context/prescription/services-context';
import DrugItem from './drug.Item';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { schema } from './drug.schema';
import { Default, Mobile } from '@paziresh24/hooks/device';
import { Fragment } from 'react';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';

const DrugsList = () => {
    const [prescriptionInfo] = useSelectPrescription();
    const [services] = useServices();

    const isDrugs = service => {
        if (
            serviceTypeList['drugs'][prescriptionInfo.insuranceType].includes(+service.service_type)
        ) {
            return true;
        }
        return false;
    };

    return (
        <div className={styles.wrapper}>
            <Mobile>
                {services.map(
                    service => isDrugs(service) && <DrugItem key={service.id} service={service} />
                )}
            </Mobile>
            <Default>
                <table width="100%">
                    <colgroup>
                        {schema.map(item => (
                            <Fragment key={item.title}>
                                {!item.meta?.provider && (
                                    <col span="1" style={{ width: item.meta.width }} />
                                )}
                                {item.meta?.provider === prescriptionInfo.insuranceType && (
                                    <col span="1" style={{ width: item.meta.width }} />
                                )}
                            </Fragment>
                        ))}
                        <col span="1" style={{ width: '5%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            {schema.map(item => (
                                <Fragment key={item.title}>
                                    {!item.meta?.provider && <th>{item.title}</th>}
                                    {item.meta?.provider === prescriptionInfo.insuranceType && (
                                        <th>{item.title}</th>
                                    )}
                                </Fragment>
                            ))}
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(
                            service =>
                                isDrugs(service) && <DrugItem key={service.id} service={service} />
                        )}
                    </tbody>
                </table>
            </Default>
        </div>
    );
};

export default DrugsList;
