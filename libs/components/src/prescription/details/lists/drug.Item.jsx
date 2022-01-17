import styles from './lists.module.scss';
import { useEffect, useRef, useState } from 'react';
import Modal from '../../../core/modal';
import TextArea from '../../../core/textArea';
import Button from './../../../core/button/index';
import ServiceName from './atom/serviceName';
import Number from './atom/number';
import SelectBox from './atom/selectBox';
import { Mobile, Default } from '@paziresh24/hooks/device';
import Description from './atom/description';
import SelectDate from '../../selectDate';
import moment from 'jalali-moment';
import { utils } from '@hassanmojab/react-modern-calendar-datepicker';

const DrugItem = ({
    service,
    insuranceType,
    readOnly,
    services,
    setServices,
    noDate,
    noFavorite
}) => {
    const [isOpenDescription, setIsOpenDescription] = useState(false);
    const [isOpenDetailsForm, setIsOpenDetailsForm] = useState(false);
    const [date, setDate] = useState(service?.date_do ?? null);

    const rowServiceRef = useRef();

    const removeService = service => {
        rowServiceRef.current.style.transform = 'translateX(100%)';
        rowServiceRef.current.style.opacity = '0';

        setTimeout(() => setServices(services.filter(item => item.id !== service.id)), 450);
    };

    const descriptionRef = useRef();
    const editDescription = () => {
        services[services.findIndex(item => item.id === service.id)].description =
            descriptionRef.current.value;
        setServices(services);
        setIsOpenDescription(false);
    };

    useEffect(() => {
        if (!service.date_do && insuranceType === 'salamat') {
            editDate(utils('fa').getToday());
        }
    }, []);

    const deleteHover = event => {
        if (event.type === 'mouseenter') {
            rowServiceRef.current.style.background = 'rgb(200, 80, 80, 0.1)';
        } else {
            rowServiceRef.current.style.background = '';
        }
    };

    const editDate = date => {
        if (date && setServices) {
            const dateFormat = date
                ? moment
                      .from(`${date.year}/${date.month}/${date.day}`, 'fa', 'YYYY/MM/DD')
                      .format('YYYY-MM-DD')
                : null;
            setDate(dateFormat);
            services[services.findIndex(item => item.id === service.id)].date_do = dateFormat;
            setServices(services);
        }
    };

    return (
        <>
            <Default>
                <tr ref={rowServiceRef}>
                    <td data-label="نام دارو">
                        <ServiceName
                            service={service}
                            name={service.service.name}
                            insuranceType={insuranceType}
                            favorite={!noFavorite}
                        />
                    </td>
                    <td data-label="تعداد">
                        <Number
                            serviceId={service.id}
                            value={service.count}
                            field="count"
                            insuranceType={insuranceType}
                            services={services}
                            setServices={setServices}
                            editable={!readOnly}
                        />
                    </td>
                    {insuranceType === 'tamin' && (
                        <td data-label="دوره تکرار">
                            <Number
                                serviceId={service.id}
                                value={service.number_of_period}
                                field="number_of_period"
                                insuranceType={insuranceType}
                                services={services}
                                setServices={setServices}
                                editable={!readOnly}
                            />
                        </td>
                    )}
                    <td data-label="زمان مصرف">
                        <SelectBox
                            serviceId={service.id}
                            service={service}
                            value={service.use_time}
                            field="use_time"
                            type="Consumption"
                            insuranceType={insuranceType}
                            services={services}
                            setServices={setServices}
                            editable={!readOnly}
                        />
                    </td>
                    <td data-label="طریقه مصرف">
                        <SelectBox
                            serviceId={service.id}
                            service={service}
                            value={service.how_to_use}
                            field="how_to_use"
                            type="Instructions"
                            insuranceType={insuranceType}
                            services={services}
                            setServices={setServices}
                            editable={!readOnly}
                        />
                    </td>
                    <td data-label="مقادیر مصرف">
                        <SelectBox
                            serviceId={service.id}
                            service={service}
                            value={service.use_instruction}
                            field="use_instruction"
                            type="Amounts"
                            insuranceType={insuranceType}
                            services={services}
                            setServices={setServices}
                            editable={!readOnly}
                        />
                    </td>
                    {insuranceType === 'salamat' && !readOnly && !noDate && (
                        <td data-label="تاریخ موثر">
                            <SelectDate
                                label="تاریخ موثر"
                                simple
                                onChange={value => editDate(value)}
                                // today
                                default-value={service.date_do}
                            />
                        </td>
                    )}
                    <td>
                        <div className={styles.action}>
                            {readOnly && service.description && (
                                <div
                                    onClick={() => setIsOpenDescription(true)}
                                    aria-hidden
                                    className={styles.descriptionAction}
                                >
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M3 11C3 7.22876 3 5.34315 4.17157 4.17157C5.34315 3 7.22876 3 11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11V14.1716C21 15.3253 21 15.9021 20.8468 16.4396C20.7626 16.7349 20.6447 17.0196 20.4954 17.2879C20.2237 17.7763 19.8158 18.1842 19 19C18.1842 19.8158 17.7763 20.2237 17.2879 20.4954C17.0196 20.6447 16.7349 20.7626 16.4396 20.8468C15.9021 21 15.3253 21 14.1716 21H11C7.22876 21 5.34315 21 4.17157 19.8284C3 18.6569 3 16.7712 3 13V11Z"
                                            fill="#F2994A"
                                            fillOpacity={service.description ? 0.2 : 0}
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M10.9436 2.25H11H13H13.0564C14.8942 2.24998 16.3498 2.24997 17.489 2.40313C18.6614 2.56076 19.6104 2.89288 20.3588 3.64124C21.1071 4.38961 21.4392 5.33856 21.5969 6.51098C21.75 7.65018 21.75 9.1058 21.75 10.9435V10.9436V11V14.1716L21.75 14.2818C21.7502 15.3298 21.7504 16.0056 21.568 16.6452C21.4681 16.9959 21.3281 17.3339 21.1508 17.6525C20.8275 18.2337 20.3495 18.7115 19.6083 19.4524L19.5303 19.5303L19.4524 19.6083C18.7115 20.3495 18.2337 20.8275 17.6525 21.1508C17.3339 21.3281 16.9959 21.4681 16.6452 21.568C16.0056 21.7504 15.3298 21.7502 14.2818 21.75L14.1716 21.75H11H10.9436H10.9435C9.1058 21.75 7.65018 21.75 6.51098 21.5969C5.33856 21.4392 4.38961 21.1071 3.64124 20.3588C2.89288 19.6104 2.56076 18.6614 2.40313 17.489C2.24997 16.3498 2.24998 14.8942 2.25 13.0564V13V11V10.9436C2.24998 9.10582 2.24997 7.65019 2.40313 6.51098C2.56076 5.33856 2.89288 4.38961 3.64124 3.64124C4.38961 2.89288 5.33856 2.56076 6.51098 2.40313C7.65019 2.24997 9.10582 2.24998 10.9436 2.25ZM6.71085 3.88976C5.70476 4.02502 5.12511 4.27869 4.7019 4.7019C4.27869 5.12511 4.02502 5.70476 3.88976 6.71085C3.75159 7.73851 3.75 9.09318 3.75 11V13C3.75 14.9068 3.75159 16.2615 3.88976 17.2892C4.02502 18.2952 4.27869 18.8749 4.7019 19.2981C5.12511 19.7213 5.70476 19.975 6.71085 20.1102C7.73851 20.2484 9.09318 20.25 11 20.25H14.1716C14.6251 20.25 14.9718 20.249 15.25 20.2414V20L15.25 19.948C15.25 19.0495 15.2499 18.3003 15.3299 17.7055C15.4143 17.0777 15.6 16.5109 16.0555 16.0554C16.5109 15.6 17.0777 15.4143 17.7055 15.3299C18.3003 15.2499 19.0495 15.2499 19.948 15.25L20 15.25H20.2414C20.249 14.9718 20.25 14.6251 20.25 14.1716V11C20.25 9.09318 20.2484 7.73851 20.1102 6.71085C19.975 5.70476 19.7213 5.12511 19.2981 4.7019C18.8749 4.27869 18.2952 4.02502 17.2892 3.88976C16.2615 3.75159 14.9068 3.75 13 3.75H11C9.09318 3.75 7.73851 3.75159 6.71085 3.88976ZM19.9297 16.75C19.0044 16.7501 18.3766 16.7532 17.9054 16.8165C17.4439 16.8785 17.2464 16.9858 17.1161 17.1161C16.9858 17.2464 16.8786 17.4439 16.8165 17.9054C16.7532 18.3766 16.7501 19.0043 16.75 19.9297C16.8086 19.9016 16.8664 19.8717 16.9232 19.84C17.2988 19.6311 17.624 19.3154 18.4697 18.4697C19.3154 17.624 19.6311 17.2988 19.84 16.9232C19.8717 16.8664 19.9016 16.8086 19.9297 16.75ZM6.25 7C6.25 6.58579 6.58579 6.25 7 6.25H15C15.4142 6.25 15.75 6.58579 15.75 7C15.75 7.41421 15.4142 7.75 15 7.75H7C6.58579 7.75 6.25 7.41421 6.25 7ZM7 10.25C6.58579 10.25 6.25 10.5858 6.25 11C6.25 11.4142 6.58579 11.75 7 11.75H13C13.4142 11.75 13.75 11.4142 13.75 11C13.75 10.5858 13.4142 10.25 13 10.25H7ZM6.25 15C6.25 14.5858 6.58579 14.25 7 14.25H9C9.41421 14.25 9.75 14.5858 9.75 15C9.75 15.4142 9.41421 15.75 9 15.75H7C6.58579 15.75 6.25 15.4142 6.25 15Z"
                                            fill="#F2994A"
                                        />
                                    </svg>
                                </div>
                            )}
                            {!readOnly && (
                                <div
                                    onClick={() => setIsOpenDescription(true)}
                                    aria-hidden
                                    className={styles.descriptionAction}
                                >
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M3 11C3 7.22876 3 5.34315 4.17157 4.17157C5.34315 3 7.22876 3 11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11V14.1716C21 15.3253 21 15.9021 20.8468 16.4396C20.7626 16.7349 20.6447 17.0196 20.4954 17.2879C20.2237 17.7763 19.8158 18.1842 19 19C18.1842 19.8158 17.7763 20.2237 17.2879 20.4954C17.0196 20.6447 16.7349 20.7626 16.4396 20.8468C15.9021 21 15.3253 21 14.1716 21H11C7.22876 21 5.34315 21 4.17157 19.8284C3 18.6569 3 16.7712 3 13V11Z"
                                            fill="#F2994A"
                                            fillOpacity={service.description ? 0.2 : 0}
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M10.9436 2.25H11H13H13.0564C14.8942 2.24998 16.3498 2.24997 17.489 2.40313C18.6614 2.56076 19.6104 2.89288 20.3588 3.64124C21.1071 4.38961 21.4392 5.33856 21.5969 6.51098C21.75 7.65018 21.75 9.1058 21.75 10.9435V10.9436V11V14.1716L21.75 14.2818C21.7502 15.3298 21.7504 16.0056 21.568 16.6452C21.4681 16.9959 21.3281 17.3339 21.1508 17.6525C20.8275 18.2337 20.3495 18.7115 19.6083 19.4524L19.5303 19.5303L19.4524 19.6083C18.7115 20.3495 18.2337 20.8275 17.6525 21.1508C17.3339 21.3281 16.9959 21.4681 16.6452 21.568C16.0056 21.7504 15.3298 21.7502 14.2818 21.75L14.1716 21.75H11H10.9436H10.9435C9.1058 21.75 7.65018 21.75 6.51098 21.5969C5.33856 21.4392 4.38961 21.1071 3.64124 20.3588C2.89288 19.6104 2.56076 18.6614 2.40313 17.489C2.24997 16.3498 2.24998 14.8942 2.25 13.0564V13V11V10.9436C2.24998 9.10582 2.24997 7.65019 2.40313 6.51098C2.56076 5.33856 2.89288 4.38961 3.64124 3.64124C4.38961 2.89288 5.33856 2.56076 6.51098 2.40313C7.65019 2.24997 9.10582 2.24998 10.9436 2.25ZM6.71085 3.88976C5.70476 4.02502 5.12511 4.27869 4.7019 4.7019C4.27869 5.12511 4.02502 5.70476 3.88976 6.71085C3.75159 7.73851 3.75 9.09318 3.75 11V13C3.75 14.9068 3.75159 16.2615 3.88976 17.2892C4.02502 18.2952 4.27869 18.8749 4.7019 19.2981C5.12511 19.7213 5.70476 19.975 6.71085 20.1102C7.73851 20.2484 9.09318 20.25 11 20.25H14.1716C14.6251 20.25 14.9718 20.249 15.25 20.2414V20L15.25 19.948C15.25 19.0495 15.2499 18.3003 15.3299 17.7055C15.4143 17.0777 15.6 16.5109 16.0555 16.0554C16.5109 15.6 17.0777 15.4143 17.7055 15.3299C18.3003 15.2499 19.0495 15.2499 19.948 15.25L20 15.25H20.2414C20.249 14.9718 20.25 14.6251 20.25 14.1716V11C20.25 9.09318 20.2484 7.73851 20.1102 6.71085C19.975 5.70476 19.7213 5.12511 19.2981 4.7019C18.8749 4.27869 18.2952 4.02502 17.2892 3.88976C16.2615 3.75159 14.9068 3.75 13 3.75H11C9.09318 3.75 7.73851 3.75159 6.71085 3.88976ZM19.9297 16.75C19.0044 16.7501 18.3766 16.7532 17.9054 16.8165C17.4439 16.8785 17.2464 16.9858 17.1161 17.1161C16.9858 17.2464 16.8786 17.4439 16.8165 17.9054C16.7532 18.3766 16.7501 19.0043 16.75 19.9297C16.8086 19.9016 16.8664 19.8717 16.9232 19.84C17.2988 19.6311 17.624 19.3154 18.4697 18.4697C19.3154 17.624 19.6311 17.2988 19.84 16.9232C19.8717 16.8664 19.9016 16.8086 19.9297 16.75ZM6.25 7C6.25 6.58579 6.58579 6.25 7 6.25H15C15.4142 6.25 15.75 6.58579 15.75 7C15.75 7.41421 15.4142 7.75 15 7.75H7C6.58579 7.75 6.25 7.41421 6.25 7ZM7 10.25C6.58579 10.25 6.25 10.5858 6.25 11C6.25 11.4142 6.58579 11.75 7 11.75H13C13.4142 11.75 13.75 11.4142 13.75 11C13.75 10.5858 13.4142 10.25 13 10.25H7ZM6.25 15C6.25 14.5858 6.58579 14.25 7 14.25H9C9.41421 14.25 9.75 14.5858 9.75 15C9.75 15.4142 9.41421 15.75 9 15.75H7C6.58579 15.75 6.25 15.4142 6.25 15Z"
                                            fill="#F2994A"
                                        />
                                    </svg>
                                </div>
                            )}
                            {!readOnly && (
                                <div
                                    onClick={() => removeService(service)}
                                    onMouseEnter={deleteHover}
                                    onMouseLeave={deleteHover}
                                    aria-hidden
                                    className={styles.removeAction}
                                >
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M5.62661 15.3991L5 6H19L18.3734 15.3991C18.1964 18.054 18.1079 19.3815 17.2429 20.1907C16.3779 21 15.0475 21 12.3867 21H11.6133C8.95252 21 7.62212 21 6.75711 20.1907C5.8921 19.3815 5.8036 18.054 5.62661 15.3991Z"
                                            fill="#EB5757"
                                            fillOpacity="0"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M10.4062 2.25C10.418 2.25 10.4297 2.25 10.4415 2.25H13.5585L13.5938 2.25C13.9112 2.24996 14.2092 2.24992 14.459 2.27844C14.7371 2.31019 15.0296 2.38361 15.3025 2.58033C15.5754 2.77704 15.7375 3.03124 15.8556 3.28508C15.9617 3.513 16.0559 3.79577 16.1562 4.0969L16.1674 4.13037L16.5406 5.25H19H21C21.4142 5.25 21.75 5.58579 21.75 6C21.75 6.41421 21.4142 6.75 21 6.75H19.7017L19.1217 15.449L19.1182 15.5016C19.0327 16.7844 18.9637 17.8205 18.8017 18.6336C18.6333 19.4789 18.3469 20.185 17.7553 20.7384C17.1637 21.2919 16.4401 21.5307 15.5855 21.6425C14.7634 21.75 13.725 21.75 12.4394 21.75H12.3867H11.6133H11.5606C10.275 21.75 9.23655 21.75 8.41451 21.6425C7.55986 21.5307 6.83631 21.2919 6.24472 20.7384C5.65312 20.185 5.3667 19.4789 5.19831 18.6336C5.03633 17.8205 4.96727 16.7844 4.88178 15.5016L4.87827 15.449L4.29834 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H5H7.45943L7.83264 4.13037C7.83637 4.11918 7.84009 4.10802 7.8438 4.09688C7.94414 3.79575 8.03835 3.513 8.14438 3.28508C8.26246 3.03124 8.42459 2.77704 8.69752 2.58033C8.97045 2.38361 9.26287 2.31019 9.54102 2.27844C9.79077 2.24992 10.0888 2.24996 10.4062 2.25ZM9.04057 5.25H14.9594L14.7443 4.60472C14.6289 4.25832 14.5611 4.05863 14.4956 3.91778C14.466 3.85423 14.4457 3.82281 14.4348 3.80824C14.4298 3.80149 14.427 3.79862 14.4264 3.79801L14.4254 3.79719L14.4243 3.79654C14.4236 3.79616 14.42 3.79439 14.412 3.79174C14.3947 3.78604 14.3585 3.7767 14.2888 3.76875C14.1345 3.75113 13.9236 3.75 13.5585 3.75H10.4415C10.0764 3.75 9.86551 3.75113 9.71117 3.76875C9.64154 3.7767 9.60531 3.78604 9.58804 3.79174C9.58005 3.79439 9.57643 3.79616 9.57566 3.79654L9.57458 3.79719L9.57363 3.79801C9.57302 3.79862 9.57019 3.80149 9.56516 3.80824C9.55428 3.82281 9.53397 3.85423 9.50441 3.91778C9.43889 4.05863 9.37113 4.25832 9.25566 4.60472L9.04057 5.25ZM5.80166 6.75L6.37495 15.3492C6.4648 16.6971 6.52883 17.6349 6.6694 18.3405C6.80575 19.025 6.99608 19.3873 7.2695 19.6431C7.54291 19.8988 7.91707 20.0647 8.60907 20.1552C9.32247 20.2485 10.2625 20.25 11.6133 20.25H12.3867C13.7375 20.25 14.6775 20.2485 15.3909 20.1552C16.0829 20.0647 16.4571 19.8988 16.7305 19.6431C17.0039 19.3873 17.1943 19.025 17.3306 18.3405C17.4712 17.6349 17.5352 16.6971 17.6251 15.3492L18.1983 6.75H16H8H5.80166Z"
                                            fill="#EB5757"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            </Default>
            <Mobile>
                <div
                    className={styles.card}
                    ref={rowServiceRef}
                    onClick={() => setIsOpenDetailsForm(true)}
                    aria-hidden
                >
                    {(!readOnly || insuranceType === 'salamat') && (
                        <div className={styles.actionBar}>
                            <div onClick={() => setIsOpenDetailsForm(true)} aria-hidden>
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16.5001 4.49999L6.56688 14.4331C5.78827 15.2117 5.39896 15.601 5.13106 16.0742C4.86316 16.5474 4.72963 17.0815 4.46257 18.1497L4 20L5.85029 19.5374C6.91852 19.2704 7.45264 19.1368 7.9258 18.8689C8.39895 18.601 8.78825 18.2117 9.56685 17.4331L9.56686 17.4331L19.5001 7.49994C19.5797 7.42031 19.6195 7.3805 19.6515 7.34525C20.3449 6.58244 20.345 5.41755 19.6516 4.65472C19.6195 4.61948 19.5797 4.57967 19.5001 4.50006L19.5001 4.50003C19.4205 4.4204 19.3807 4.38059 19.3454 4.34854C18.5826 3.6551 17.4177 3.65509 16.6548 4.34851C16.6196 4.38054 16.5798 4.42034 16.5002 4.49992L16.5001 4.49999Z"
                                        fill="#F2994A"
                                        fillOpacity="0.16"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M17.1593 4.90353C17.6361 4.47014 18.3642 4.47015 18.8409 4.90355C18.8596 4.92055 18.884 4.94465 18.9698 5.03039C19.0555 5.11613 19.0796 5.14053 19.0966 5.15923C19.53 5.63599 19.53 6.36405 19.0966 6.84081C19.0796 6.85951 19.0555 6.88391 18.9697 6.96965L18.1627 7.77671C17.0865 7.80098 16.1991 6.91362 16.2233 5.83749L17.0305 5.03036C17.1162 4.94462 17.1406 4.92052 17.1593 4.90353ZM14.9524 7.10838L7.09722 14.9635C6.29045 15.7703 5.98987 16.0797 5.78372 16.4438C5.57758 16.8079 5.46691 17.2248 5.19019 18.3317L5.03079 18.9693L5.6684 18.8099C6.77527 18.5331 7.1922 18.4225 7.55629 18.2163C7.92038 18.0102 8.22978 17.7096 9.03654 16.9029L16.8917 9.04765C16.0064 8.70201 15.2981 7.99371 14.9524 7.10838ZM19.8499 3.79362C18.801 2.84014 17.1993 2.84011 16.1504 3.79357C16.1016 3.83793 16.0497 3.88978 15.9824 3.95712L15.9698 3.96969L6.03657 13.9028L5.96302 13.9764C5.25466 14.6844 4.79718 15.1417 4.47843 15.7047C4.15967 16.2677 4.00291 16.8953 3.76019 17.867L3.73498 17.9679L3.27241 19.8181C3.20851 20.0737 3.2834 20.3441 3.46969 20.5304C3.65597 20.7167 3.92634 20.7915 4.18192 20.7276L6.03221 20.2651L6.1331 20.2399C7.1048 19.9971 7.73236 19.8404 8.29534 19.5216C8.85831 19.2029 9.31561 18.7454 10.0237 18.0371L10.0972 17.9635L20.0304 8.03031L20.043 8.01769C20.1103 7.95039 20.1622 7.89856 20.2065 7.84977C21.16 6.80091 21.16 5.19918 20.2066 4.15029C20.1622 4.10151 20.1104 4.04969 20.0431 3.98241L20.043 3.98234L20.0305 3.96975L20.0179 3.9572L20.0179 3.95716C19.9506 3.88983 19.8987 3.83798 19.8499 3.79362Z"
                                        fill="#F2994A"
                                    />
                                </svg>
                            </div>
                            <div
                                onClick={e => {
                                    e.stopPropagation();
                                    removeService(service);
                                }}
                                aria-hidden
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5.62661 15.3991L5 6H19L18.3734 15.3991C18.1964 18.054 18.1079 19.3815 17.2429 20.1907C16.3779 21 15.0475 21 12.3867 21H11.6133C8.95252 21 7.62212 21 6.75711 20.1907C5.8921 19.3815 5.8036 18.054 5.62661 15.3991Z"
                                        fill="#EB5757"
                                        fillOpacity="0.16"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M10.4062 2.25C10.418 2.25 10.4297 2.25 10.4415 2.25H13.5585L13.5938 2.25C13.9112 2.24996 14.2092 2.24992 14.459 2.27844C14.7371 2.31019 15.0296 2.38361 15.3025 2.58033C15.5754 2.77704 15.7375 3.03124 15.8556 3.28508C15.9617 3.513 16.0559 3.79577 16.1562 4.0969L16.1674 4.13037L16.5406 5.25H19H21C21.4142 5.25 21.75 5.58579 21.75 6C21.75 6.41421 21.4142 6.75 21 6.75H19.7017L19.1217 15.449L19.1182 15.5016C19.0327 16.7844 18.9637 17.8205 18.8017 18.6336C18.6333 19.4789 18.3469 20.185 17.7553 20.7384C17.1637 21.2919 16.4401 21.5307 15.5855 21.6425C14.7634 21.75 13.725 21.75 12.4394 21.75H12.3867H11.6133H11.5606C10.275 21.75 9.23655 21.75 8.41451 21.6425C7.55986 21.5307 6.83631 21.2919 6.24472 20.7384C5.65312 20.185 5.3667 19.4789 5.19831 18.6336C5.03633 17.8205 4.96727 16.7844 4.88178 15.5016L4.87827 15.449L4.29834 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H5H7.45943L7.83264 4.13037C7.83637 4.11918 7.84009 4.10802 7.8438 4.09688C7.94414 3.79575 8.03835 3.513 8.14438 3.28508C8.26246 3.03124 8.42459 2.77704 8.69752 2.58033C8.97045 2.38361 9.26287 2.31019 9.54102 2.27844C9.79077 2.24992 10.0888 2.24996 10.4062 2.25ZM9.04057 5.25H14.9594L14.7443 4.60472C14.6289 4.25832 14.5611 4.05863 14.4956 3.91778C14.466 3.85423 14.4457 3.82281 14.4348 3.80824C14.4298 3.80149 14.427 3.79862 14.4264 3.79801L14.4254 3.79719L14.4243 3.79654C14.4236 3.79616 14.42 3.79439 14.412 3.79174C14.3947 3.78604 14.3585 3.7767 14.2888 3.76875C14.1345 3.75113 13.9236 3.75 13.5585 3.75H10.4415C10.0764 3.75 9.86551 3.75113 9.71117 3.76875C9.64154 3.7767 9.60531 3.78604 9.58804 3.79174C9.58005 3.79439 9.57643 3.79616 9.57566 3.79654L9.57458 3.79719L9.57363 3.79801C9.57302 3.79862 9.57019 3.80149 9.56516 3.80824C9.55428 3.82281 9.53397 3.85423 9.50441 3.91778C9.43889 4.05863 9.37113 4.25832 9.25566 4.60472L9.04057 5.25ZM5.80166 6.75L6.37495 15.3492C6.4648 16.6971 6.52883 17.6349 6.6694 18.3405C6.80575 19.025 6.99608 19.3873 7.2695 19.6431C7.54291 19.8988 7.91707 20.0647 8.60907 20.1552C9.32247 20.2485 10.2625 20.25 11.6133 20.25H12.3867C13.7375 20.25 14.6775 20.2485 15.3909 20.1552C16.0829 20.0647 16.4571 19.8988 16.7305 19.6431C17.0039 19.3873 17.1943 19.025 17.3306 18.3405C17.4712 17.6349 17.5352 16.6971 17.6251 15.3492L18.1983 6.75H16H8H5.80166Z"
                                        fill="#EB5757"
                                    />
                                </svg>
                            </div>
                        </div>
                    )}
                    <ServiceName
                        favorite={false}
                        service={service}
                        name={service.service.name}
                        insuranceType={insuranceType}
                    />
                    <div className={styles.amounts}>
                        <span>
                            <Number value={service.count} editable={false} />
                            عدد
                        </span>
                        <SelectBox
                            value={service.use_time}
                            editable={false}
                            type="Consumption"
                            insuranceType={insuranceType}
                        />
                        <SelectBox
                            value={service.how_to_use}
                            editable={false}
                            type="Instructions"
                            insuranceType={insuranceType}
                        />
                        <SelectBox
                            value={service.use_instruction}
                            editable={false}
                            type="Amounts"
                            insuranceType={insuranceType}
                        />
                    </div>
                </div>
            </Mobile>

            <Modal
                title={service.service.name}
                isOpen={isOpenDetailsForm}
                onClose={setIsOpenDetailsForm}
            >
                <div className={styles.detailsForm}>
                    <Number
                        simple={false}
                        serviceId={service.id}
                        value={service.count}
                        field="count"
                        insuranceType={insuranceType}
                        services={services}
                        setServices={setServices}
                        editable={!readOnly}
                    />
                    {insuranceType === 'tamin' && (
                        <Number
                            label="دوره تکرار"
                            simple={false}
                            serviceId={service.id}
                            value={service.number_of_period}
                            field="number_of_period"
                            insuranceType={insuranceType}
                            services={services}
                            setServices={setServices}
                            editable={!readOnly}
                        />
                    )}
                    <SelectBox
                        serviceId={service.id}
                        service={service}
                        value={service.use_time}
                        field="use_time"
                        type="Consumption"
                        simple={false}
                        insuranceType={insuranceType}
                        services={services}
                        setServices={setServices}
                        editable={!readOnly}
                    />
                    <SelectBox
                        serviceId={service.id}
                        service={service}
                        value={service.how_to_use}
                        field="how_to_use"
                        type="Instructions"
                        simple={false}
                        insuranceType={insuranceType}
                        services={services}
                        setServices={setServices}
                        editable={!readOnly}
                    />
                    <SelectBox
                        serviceId={service.id}
                        service={service}
                        value={service.use_instruction}
                        field="use_instruction"
                        type="Amounts"
                        simple={false}
                        insuranceType={insuranceType}
                        services={services}
                        setServices={setServices}
                        editable={!readOnly}
                    />
                    {insuranceType === 'salamat' && !readOnly && !noDate && (
                        <SelectDate
                            label="تاریخ موثر"
                            onChange={value => editDate(value)}
                            default-value={service.date_do}
                            today
                        />
                    )}
                </div>

                <Description
                    serviceId={service.id}
                    field="description"
                    description={service.description}
                />

                <Button block onClick={() => setIsOpenDetailsForm(false)}>
                    تایید
                </Button>
            </Modal>

            <Modal title="توضیحات" onClose={setIsOpenDescription} isOpen={isOpenDescription}>
                <TextArea ref={descriptionRef} default-value={service.description} />
                <Button variant="secondary" block onClick={editDescription}>
                    تایید
                </Button>
            </Modal>
        </>
    );
};

export default DrugItem;
