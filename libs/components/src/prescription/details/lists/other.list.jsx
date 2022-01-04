import styles from './lists.module.scss';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import LabsItem from './lab.item';
import { Mobile, Default } from '@paziresh24/hooks/device';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';

const OthersList = () => {
    const [prescriptionInfo] = useSelectPrescription();
    const [services] = useServices();

    const isOthers = service => {
        if (
            serviceTypeList['others'][prescriptionInfo.insuranceType].includes(
                +service.service_type
            )
        ) {
            return true;
        }
        return false;
    };

    return (
        <div className={styles.wrapper}>
            <Mobile>
                {services.map(
                    service => isOthers(service) && <LabsItem key={service.id} service={service} />
                )}
            </Mobile>
            <Default>
                <table width="100%">
                    <colgroup>
                        <col span="1" style={{ width: '55%' }} />
                        <col span="1" style={{ width: '2%' }} />
                        <col span="1" style={{ width: '5%' }} />
                        <col span="1" style={{ width: '5%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>نام پاراکلینیک</th>
                            <th>تعداد</th>
                            <th>تاریخ موثر</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(
                            service =>
                                isOthers(service) && <LabsItem key={service.id} service={service} />
                        )}
                    </tbody>
                </table>
            </Default>
        </div>
    );
};

export default OthersList;
