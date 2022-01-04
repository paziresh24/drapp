import styles from './lists.module.scss';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import LabsItem from './lab.item';
import { Mobile, Default } from '@paziresh24/hooks/device';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';

const ImagingList = () => {
    const [prescriptionInfo] = useSelectPrescription();
    const [services] = useServices();

    const isImaging = service => {
        if (
            serviceTypeList['imaging'][prescriptionInfo.insuranceType].includes(
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
                    service => isImaging(service) && <LabsItem key={service.id} service={service} />
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
                            <th>نام خدمت تصویربرداری</th>
                            <th>تعداد</th>
                            <th>تاریخ موثر</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(
                            service =>
                                isImaging(service) && (
                                    <LabsItem key={service.id} service={service} />
                                )
                        )}
                    </tbody>
                </table>
            </Default>
        </div>
    );
};

export default ImagingList;
