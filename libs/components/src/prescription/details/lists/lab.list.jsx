import styles from './lists.module.scss';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import LabsItem from './lab.item';
import { Mobile, Default } from '@paziresh24/hooks/device';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';
import { Calendar, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import { useEffect, useState, Fragment } from 'react';
import moment from 'jalali-moment';
import { schema } from './schema';
import DrugItem from './drug.Item';
import { CalendarIcon } from '../../../icons';
import Modal from '../../../core/modal';
import Button from '../../../core/button';

const LabsList = ({ type }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const [services, setServices] = useServices();
    const [dateModal, setDateModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState();

    const isLabs = service => {
        if (serviceTypeList[type][prescriptionInfo.insuranceType].includes(+service.service_type)) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        dateModal && setSelectedDay(null);
    }, [dateModal]);

    const setDateServices = () => {
        const dateFormat = selectedDay
            ? moment
                  .from(
                      `${selectedDay.year}/${selectedDay.month}/${selectedDay.day}`,
                      'fa',
                      'YYYY/MM/DD'
                  )
                  .format('YYYY-MM-DD')
            : null;
        const changeDateServices = services.map(service =>
            serviceTypeList[type][prescriptionInfo.insuranceType].includes(+service.service_type)
                ? {
                      ...service,
                      ...(type !== 'drugs' && { date_do: dateFormat }),
                      ...(type === 'drugs' && { active_from: dateFormat })
                  }
                : service
        );
        setServices(changeDateServices);
        setDateModal(false);
    };

    return (
        <div className={styles.wrapper}>
            <Mobile>
                {services.map(
                    service =>
                        isLabs(service) &&
                        (type !== 'drugs' ? (
                            <LabsItem key={service.id} service={service} />
                        ) : (
                            <DrugItem key={service.id} service={service} />
                        ))
                )}
            </Mobile>
            <Default>
                <table width="100%" className={styles.servicesList}>
                    <colgroup>
                        {schema[type].map(item => (
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
                            {schema[type].map(item => (
                                <Fragment key={item.title}>
                                    {!item.meta?.provider && item.title !== 'تاریخ موثر' && (
                                        <th>{item.title}</th>
                                    )}
                                    {!item.meta?.provider && item.title === 'تاریخ موثر' && (
                                        <th>
                                            {
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        gap: '1rem',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => setDateModal(true)}
                                                    aria-hidden
                                                >
                                                    تاریخ موثر
                                                    <CalendarIcon />
                                                </div>
                                            }
                                        </th>
                                    )}
                                    {item.meta?.provider === prescriptionInfo.insuranceType &&
                                        item.title !== 'تاریخ موثر' && <th>{item.title}</th>}
                                    {item.meta?.provider === prescriptionInfo.insuranceType &&
                                        item.title === 'تاریخ موثر' && (
                                            <th>
                                                {
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            gap: '1rem',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setDateModal(true)}
                                                        aria-hidden
                                                    >
                                                        تاریخ موثر
                                                        <CalendarIcon />
                                                    </div>
                                                }
                                            </th>
                                        )}
                                </Fragment>
                            ))}
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(
                            service =>
                                isLabs(service) &&
                                (type !== 'drugs' ? (
                                    <LabsItem key={service.id} service={service} />
                                ) : (
                                    <DrugItem key={service.id} service={service} />
                                ))
                        )}
                    </tbody>
                </table>
            </Default>
            <Modal title="تغییر همگانی تاریخ موثر" isOpen={dateModal} onClose={setDateModal}>
                <Calendar
                    value={selectedDay}
                    onChange={setSelectedDay}
                    inputPlaceholder="Select a day"
                    minimumDate={utils('fa').getToday()}
                    shouldHighlightWeekends
                    colorPrimary="#27bda0"
                    locale="fa"
                    calendarClassName={styles['calendarWrap']}
                />
                <Button block onClick={setDateServices}>
                    تایید
                </Button>
            </Modal>
        </div>
    );
};

export default LabsList;
