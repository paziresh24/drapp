import styles from './filter.module.scss';
import DateSelect from './../atom/filters/date';
import Select from './../atom/filters/select';
import { useState, useEffect } from 'react';
import moment from 'jalali-moment';
import { useStatisticsFilters } from '../../../contexts/filters.context';

const Filter = ({ noGender, noPrescriptionType, insurance_type = null, removeble }) => {
    const [isOpenSelect, setIsOpenSelect] = useState(false);
    const [filters, setFilters] = useStatisticsFilters();
    const [prescriptionTypeList, setPrescriptionTypeList] = useState([]);

    useEffect(() => {
        if (filters.insurance_type?.value === 'tamin' || insurance_type?.value === 'tamin') {
            setPrescriptionTypeList([
                {
                    value: 1,
                    name: 'دارو'
                },
                {
                    value: 2,
                    name: 'پاراکلينيک'
                },
                {
                    value: 3,
                    name: 'ويزيت'
                },
                {
                    value: 4,
                    name: 'ويزيت و خدمات'
                },
                {
                    value: 5,
                    name: 'خدمات'
                }
            ]);
        } else {
            setPrescriptionTypeList([
                {
                    value: 1,
                    name: 'دارو'
                },
                {
                    value: 2,
                    name: 'آزمایش'
                },
                {
                    value: 3,
                    name: 'تصویر برداری'
                },
                {
                    value: 4,
                    name: 'فیزیوتراپی'
                },
                {
                    value: 5,
                    name: 'خدمات پزشکان'
                },
                {
                    value: 6,
                    name: 'ارجاع'
                },
                {
                    value: 7,
                    name: 'داروی ترکیبی'
                }
            ]);
        }
    }, [filters.insurance_type]);

    document.body.addEventListener('click', e => {
        e.stopPropagation();
        isOpenSelect && setIsOpenSelect(false);
    });

    const setStartDate = date => {
        const formatedDate =
            moment
                .from(`${date?.year}/${date?.month}/${date?.day}`, 'fa', 'JYYYY/JMM/JDD')
                .format('x') / 1000;
        setFilters(prev => ({ ...prev, starts_at: formatedDate }));
    };

    const setEndDate = date => {
        const formatedDate = new Date(
            moment
                .from(`${date?.year}/${date?.month}/${date?.day}`, 'fa', 'JYYYY/JMM/JDD')
                .format('x') / 1000
        ).setHours(23, 59, 59, 59);
        setFilters(prev => ({ ...prev, ends_at: formatedDate }));
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.dateWrapper}>
                <DateSelect onChange={date => setStartDate(date)} label="تاریخ شروع" />
                <DateSelect onChange={date => setEndDate(date)} label="تاریخ پایان" />
            </div>

            {/* <hr /> */}
            <div style={{ display: 'flex', width: '100%', gap: '1rem', flexFlow: 'row wrap' }}>
                <Select
                    setIsOpen={setIsOpenSelect}
                    isOpen={isOpenSelect}
                    label="نوع بیمه"
                    items={[
                        {
                            name: 'تامین اجتماعی',
                            value: 'tamin'
                        },
                        {
                            name: 'سلامت',
                            value: 'salamat'
                        }
                    ]}
                    defaultValue={insurance_type}
                    onChange={value => setFilters(prev => ({ ...prev, insurance_type: value }))}
                    removeble={removeble?.insurance_type ?? true}
                />

                {!noGender && (
                    <Select
                        isOpen={isOpenSelect}
                        setIsOpen={setIsOpenSelect}
                        label="جنسیت"
                        items={[
                            {
                                name: 'مرد',
                                value: 'M'
                            },
                            {
                                name: 'زن',
                                value: 'F'
                            }
                        ]}
                        onChange={value => setFilters(prev => ({ ...prev, gender: value }))}
                        removeble={removeble?.gender ?? true}
                    />
                )}
                {!noPrescriptionType && (
                    <Select
                        isOpen={isOpenSelect}
                        setIsOpen={setIsOpenSelect}
                        label="نوع نسخه"
                        items={prescriptionTypeList}
                        onChange={value =>
                            setFilters(prev => ({ ...prev, prescription_type: value }))
                        }
                        removeble={removeble?.prescription_type ?? true}
                    />
                )}
            </div>
        </div>
    );
};

export default Filter;
