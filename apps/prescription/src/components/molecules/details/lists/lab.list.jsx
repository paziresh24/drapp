import styles from './lists.module.scss';
import LabsItem from './lab.item';
import { Mobile, Default } from '@paziresh24/hooks/device';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';
import { Calendar, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import { useEffect, useState, Fragment } from 'react';
import moment from 'jalali-moment';
import { schema } from './schema';
import DrugItem from './drug.Item';
import { CalendarIcon } from '@paziresh24/shared/icon';
import Modal from '@paziresh24/shared/ui/modal';
import Button from '@paziresh24/shared/ui/button';
import ReactTooltip from 'react-tooltip';

const LabsList = ({
    type,
    insuranceType,
    services,
    setServices,
    readOnly = false,
    noDate = false,
    noFavorite = false
}) => {
    const [dateModal, setDateModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState();
    const [removeAllModal, setRemoveAllModal] = useState(false);

    const isLabs = service => {
        if (serviceTypeList[type][insuranceType].includes(+service.service_type)) {
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
            serviceTypeList[type][insuranceType].includes(+service.service_type)
                ? {
                      ...service,
                      date_do: dateFormat
                  }
                : service
        );
        setServices(changeDateServices);
        setDateModal(false);
    };

    const removeAllServices = () => {
        setServices(services.filter(service => !isLabs(service)));
        setRemoveAllModal(false);
    };

    return (
        <div className={styles.wrapper}>
            <Mobile>
                {services.map(
                    service =>
                        isLabs(service) &&
                        (type !== 'drugs' ? (
                            <LabsItem
                                key={service.id}
                                service={service}
                                services={services}
                                setServices={setServices}
                                insuranceType={insuranceType}
                                readOnly={readOnly}
                                noFavorite={noFavorite}
                            />
                        ) : (
                            <DrugItem
                                key={service.id}
                                service={service}
                                services={services}
                                setServices={setServices}
                                insuranceType={insuranceType}
                                readOnly={readOnly}
                                noFavorite={noFavorite}
                            />
                        ))
                )}
            </Mobile>
            <Default>
                <table width="100%" className={styles.servicesList}>
                    <colgroup>
                        {schema[type].map(item => (
                            <Fragment key={item.title}>
                                {item.meta?.provider === undefined &&
                                    item.meta?.notShowReadOnly !== noDate && (
                                        <col span="1" style={{ width: item.meta.width }} />
                                    )}
                                {item.meta?.provider === insuranceType &&
                                    item.meta.notShowReadOnly !== noDate && (
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
                                    {!item.meta?.provider &&
                                        !noDate &&
                                        item.title === 'تاریخ موثر' && (
                                            <th>
                                                {
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            gap: '1rem',
                                                            ...(!readOnly && { cursor: 'pointer' })
                                                        }}
                                                        onClick={() =>
                                                            !readOnly && setDateModal(true)
                                                        }
                                                        aria-hidden
                                                    >
                                                        تاریخ موثر
                                                        {!readOnly && (
                                                            <>
                                                                <CalendarIcon
                                                                    color="#000"
                                                                    data-tip
                                                                    data-for="dateAll"
                                                                />
                                                                <ReactTooltip
                                                                    id="dateAll"
                                                                    place="top"
                                                                    type="dark"
                                                                    effect="solid"
                                                                >
                                                                    برای یکسان کردن همه تاریخ های
                                                                    موثر، از اینجا یک تاریخ انتخاب
                                                                    کنید
                                                                </ReactTooltip>
                                                            </>
                                                        )}
                                                    </div>
                                                }
                                            </th>
                                        )}
                                    {item.meta?.provider === insuranceType &&
                                        item.title !== 'تاریخ موثر' && <th>{item.title}</th>}
                                    {item.meta?.provider === insuranceType &&
                                        item.title === 'تاریخ موثر' &&
                                        !noDate && (
                                            <th>
                                                {
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            gap: '1rem',
                                                            ...(!readOnly && { cursor: 'pointer' })
                                                        }}
                                                        onClick={() =>
                                                            !readOnly && setDateModal(true)
                                                        }
                                                        aria-hidden
                                                    >
                                                        تاریخ موثر
                                                        {!readOnly && (
                                                            <>
                                                                <CalendarIcon
                                                                    color="#000"
                                                                    data-tip
                                                                    data-for="dateAll"
                                                                />
                                                                <ReactTooltip
                                                                    id="dateAll"
                                                                    place="top"
                                                                    type="dark"
                                                                    effect="solid"
                                                                >
                                                                    برای یکسان کردن همه تاریخ های
                                                                    موثر، از اینجا یک تاریخ انتخاب
                                                                    کنید
                                                                </ReactTooltip>
                                                            </>
                                                        )}
                                                    </div>
                                                }
                                            </th>
                                        )}
                                </Fragment>
                            ))}
                            <th>
                                {!readOnly && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        <div
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setRemoveAllModal(true)}
                                            aria-hidden
                                        >
                                            <ReactTooltip
                                                id="deleteAll"
                                                place="top"
                                                type="dark"
                                                effect="solid"
                                            >
                                                حذف دسته جمعی همه اقلام
                                            </ReactTooltip>
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                data-tip
                                                data-for="deleteAll"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M10.4062 2.25C10.418 2.25 10.4297 2.25001 10.4415 2.25001H13.5585L13.5938 2.25C13.9112 2.24996 14.2092 2.24993 14.459 2.27844C14.7371 2.3102 15.0296 2.38362 15.3025 2.58033C15.5754 2.77705 15.7375 3.03125 15.8556 3.28509C15.9617 3.51301 16.0559 3.79577 16.1562 4.09691L16.1674 4.13038L16.5406 5.25001H19H21C21.4142 5.25001 21.75 5.58579 21.75 6.00001C21.75 6.41422 21.4142 6.75001 21 6.75001H19.7017L19.1217 15.449L19.1182 15.5016C19.0327 16.7844 18.9637 17.8205 18.8017 18.6336C18.6333 19.4789 18.3469 20.185 17.7553 20.7384C17.1637 21.2919 16.4401 21.5307 15.5855 21.6425C14.7634 21.75 13.725 21.75 12.4394 21.75H12.3867H11.6133H11.5606C10.275 21.75 9.23655 21.75 8.41451 21.6425C7.55986 21.5307 6.83631 21.2919 6.24472 20.7384C5.65312 20.185 5.3667 19.4789 5.19831 18.6336C5.03633 17.8205 4.96727 16.7844 4.88178 15.5016L4.87827 15.449L4.29834 6.75001H3C2.58579 6.75001 2.25 6.41422 2.25 6.00001C2.25 5.58579 2.58579 5.25001 3 5.25001H5H7.45943L7.83264 4.13038C7.83637 4.11919 7.84009 4.10802 7.8438 4.09688C7.94414 3.79576 8.03835 3.513 8.14438 3.28509C8.26246 3.03125 8.42459 2.77705 8.69752 2.58033C8.97045 2.38362 9.26287 2.3102 9.54102 2.27844C9.79077 2.24993 10.0888 2.24996 10.4062 2.25ZM9.04057 5.25001H14.9594L14.7443 4.60472C14.6289 4.25832 14.5611 4.05863 14.4956 3.91778C14.466 3.85424 14.4457 3.82282 14.4348 3.80824C14.4298 3.8015 14.427 3.79862 14.4264 3.79802L14.4254 3.7972L14.4243 3.79655C14.4236 3.79616 14.42 3.79439 14.412 3.79175C14.3947 3.78604 14.3585 3.77671 14.2888 3.76876C14.1345 3.75114 13.9236 3.75001 13.5585 3.75001H10.4415C10.0764 3.75001 9.86551 3.75114 9.71117 3.76876C9.64154 3.77671 9.60531 3.78604 9.58804 3.79175C9.58005 3.79439 9.57643 3.79616 9.57566 3.79655L9.57458 3.7972L9.57363 3.79802C9.57302 3.79862 9.57019 3.8015 9.56516 3.80824C9.55428 3.82282 9.53397 3.85424 9.50441 3.91778C9.43889 4.05863 9.37113 4.25832 9.25566 4.60472L9.04057 5.25001ZM5.80166 6.75001L6.37495 15.3492C6.4648 16.6971 6.52883 17.6349 6.6694 18.3405C6.80575 19.025 6.99608 19.3873 7.2695 19.6431C7.54291 19.8989 7.91707 20.0647 8.60907 20.1552C9.32247 20.2485 10.2625 20.25 11.6133 20.25H12.3867C13.7375 20.25 14.6775 20.2485 15.3909 20.1552C16.0829 20.0647 16.4571 19.8989 16.7305 19.6431C17.0039 19.3873 17.1943 19.025 17.3306 18.3405C17.4712 17.6349 17.5352 16.6971 17.6251 15.3492L18.1983 6.75001H16H8H5.80166Z"
                                                    fill="#EB5757"
                                                />
                                                <path
                                                    d="M10.1934 11.4708L13.8061 15.0836"
                                                    stroke="#EB5757"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M13.8066 11.4708L10.1939 15.0836"
                                                    stroke="#EB5757"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(
                            service =>
                                isLabs(service) &&
                                (type !== 'drugs' && type !== 'equipment' ? (
                                    <LabsItem
                                        key={service.id}
                                        service={service}
                                        services={services}
                                        setServices={setServices}
                                        insuranceType={insuranceType}
                                        readOnly={readOnly}
                                        noDate={noDate}
                                        noFavorite={noFavorite}
                                    />
                                ) : (
                                    <DrugItem
                                        key={service.id}
                                        service={service}
                                        services={services}
                                        setServices={setServices}
                                        insuranceType={insuranceType}
                                        readOnly={readOnly}
                                        noDate={noDate}
                                        noFavorite={noFavorite}
                                        noInstructions={type === 'equipment'}
                                    />
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
            <Modal
                title="آیا از حذف این لیست مطمئن هستید؟"
                isOpen={removeAllModal}
                onClose={setRemoveAllModal}
            >
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button theme="error" block onClick={removeAllServices}>
                        بله و حذف
                    </Button>
                    <Button
                        variant="secondary"
                        theme="error"
                        block
                        onClick={() => setRemoveAllModal(false)}
                    >
                        انصراف
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default LabsList;
