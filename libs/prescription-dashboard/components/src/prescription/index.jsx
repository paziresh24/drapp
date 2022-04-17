import styles from './prescription.module.scss';
import { useState, useEffect, useRef } from 'react';

import LevelSelect from '../levelSelect';
import Filter from '../filter';
import Pie from '../charts/pie';
import Bar from '../charts/bar';
import { useStatisticsFilters } from '../../../contexts/filters.context';
import { useStatistics } from '../../../contexts/statistics.context';
import { Overlay } from '@paziresh24/shared/ui/overlay';
import Result from '../result';
import ExportExcel from '../exportExcel';
import { resultSchema } from '../../../schemas/result.schema';
import { digitsFaToEn } from '@paziresh24/shared/utils/digitsFaToEn';
import LiveMode from '../liveMode';
import { useGetPrescriptionStatistics } from './../../../apis/getPrescriptionStatistics/useGetPrescriptionStatistics.hook';
import { useGetDoctorCenter } from './../../../apis/getDoctorCenter/useGetDoctorCenter.hook';
import { useGetCenterName } from './../../../apis/getCenterName/useGetCenterName.hook';
import { useGetDoctors } from './../../../apis/getDoctors/useGetDoctors.hook';
import sumBy from 'lodash/sumBy';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';

const levelConstants = {
    doctor: 'DOCTOR'
};

const PrescriptionStatistics = ({ level }) => {
    // store
    const [filters, setFilters] = useStatisticsFilters();
    const [statistics, setStatistics] = useStatistics();
    const [centerId, setCenterId] = useState();

    // api
    const getPrescriptionStatistics = useGetPrescriptionStatistics({
        ...filters,
        ...(level !== levelConstants.doctor && { hospital_center_id: centerId }),
        level
    });
    const getPrescriptionStatisticsAggregated = useGetPrescriptionStatistics({
        ...filters,
        is_aggregated: 1,
        ...(level !== levelConstants.doctor && { hospital_center_id: centerId }),
        level
    });
    const getDoctors = useGetDoctors({
        hospital_center_id: centerId
    });
    const getDoctorCenter = useGetDoctorCenter();
    const getCenterName = useGetCenterName({
        center_ids: Object.keys(groupBy(statistics.data, 'center_id'))
    });

    useEffect(() => {
        if (getDoctorCenter.isSuccess && level !== levelConstants.doctor)
            setCenterId(getDoctorCenter.data[0].center_id);
    }, [getDoctorCenter.status, level]);

    useEffect(() => {
        if (!isEmpty(statistics.data)) {
            getCenterName.refetch();
        }
    }, [statistics]);

    const firstUpdate = useRef(true);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        getPrescriptionStatistics.remove();
        getPrescriptionStatisticsAggregated.remove();

        if (centerId && level !== levelConstants.doctor) {
            refetch();
        }
        if (level === levelConstants.doctor) {
            refetch();
        }
    }, [filters, centerId]);

    useEffect(() => {
        if (getPrescriptionStatistics.isSuccess) {
            setStatistics(prev => ({
                ...prev,
                data: getPrescriptionStatistics?.data?.data
            }));
        }
        if (getPrescriptionStatisticsAggregated.isSuccess) {
            setStatistics(prev => ({
                ...prev,
                aggregated: getPrescriptionStatisticsAggregated?.data?.data
            }));
        }
    }, [getPrescriptionStatistics.status, getPrescriptionStatisticsAggregated.status]);

    useEffect(() => {
        getDoctorCenter.refetch();
    }, []);

    const refetch = () => {
        setTimeout(() => {
            getPrescriptionStatistics.refetch();
            getPrescriptionStatisticsAggregated.refetch();
        }, 0);
    };

    const CountAllPrescriptionStatisitics = () => (
        <div
            style={{
                alignSelf: 'flex-start',
                padding: '0 1rem',
                paddingBottom: '0'
            }}
        >
            تعداد کل نسخه ها در بازه ی {new Date(filters.starts_at * 1000).toLocaleDateString('fa')}{' '}
            تا {new Date(filters.ends_at * 1000).toLocaleDateString('fa')}:{' '}
            <span style={{ fontWeight: 'bold' }}>
                {sumBy(
                    Object.keys(groupBy(statistics?.data, 'starts_at')).map(key => ({
                        total: sumBy(
                            statistics?.data.filter(item => item.starts_at === key),
                            'total'
                        ),
                        starts_at_with_year: digitsFaToEn(new Date(key).toLocaleDateString('fa')),
                        starts_at: digitsFaToEn(
                            new Date(key).toLocaleDateString('fa').substr(5, 10)
                        )
                    })),
                    'total'
                )}
            </span>{' '}
            نسخه
        </div>
    );

    return (
        <div className={styles.wrapper}>
            <div className={styles.filterWrapper}>
                <div className="flex gap-3 flex-col w-full">
                    {level === levelConstants.doctor && (
                        <LevelSelect
                            icon={
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15.8298 15.8926H1.66309C1.37267 15.8926 1.13184 16.1334 1.13184 16.4238C1.13184 16.7142 1.37267 16.9551 1.66309 16.9551H15.8298C16.1202 16.9551 16.361 16.7142 16.361 16.4238C16.361 16.1334 16.1202 15.8926 15.8298 15.8926Z"
                                        fill="#3f3f79"
                                    />
                                    <path
                                        d="M12.2882 2.25732H5.20492C3.07992 2.25732 2.37158 3.52524 2.37158 5.09066V16.424H6.62158V12.1315C6.62158 11.7632 6.91908 11.4657 7.28742 11.4657H10.2128C10.5741 11.4657 10.8787 11.7632 10.8787 12.1315V16.424H15.1287V5.09066C15.1216 3.52524 14.4132 2.25732 12.2882 2.25732ZM10.5174 7.39274H9.27783V8.63232C9.27783 8.92274 9.037 9.16357 8.74658 9.16357C8.45617 9.16357 8.21533 8.92274 8.21533 8.63232V7.39274H6.97575C6.68533 7.39274 6.4445 7.15191 6.4445 6.86149C6.4445 6.57107 6.68533 6.33024 6.97575 6.33024H8.21533V5.09066C8.21533 4.80024 8.45617 4.55941 8.74658 4.55941C9.037 4.55941 9.27783 4.80024 9.27783 5.09066V6.33024H10.5174C10.8078 6.33024 11.0487 6.57107 11.0487 6.86149C11.0487 7.15191 10.8078 7.39274 10.5174 7.39274Z"
                                        fill="#3f3f79"
                                    />
                                </svg>
                            }
                            label="انتخاب مرکز"
                            items={getDoctorCenter.data}
                            valueField="center_id"
                            onChange={value => {
                                if (value) {
                                    setCenterId(value);
                                    setFilters(prev => ({ ...prev, center_id: value }));
                                }
                            }}
                        />
                    )}
                    {level !== levelConstants.doctor && getDoctorCenter.isSuccess && (
                        <>
                            <LevelSelect
                                icon={
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15.8298 15.8926H1.66309C1.37267 15.8926 1.13184 16.1334 1.13184 16.4238C1.13184 16.7142 1.37267 16.9551 1.66309 16.9551H15.8298C16.1202 16.9551 16.361 16.7142 16.361 16.4238C16.361 16.1334 16.1202 15.8926 15.8298 15.8926Z"
                                            fill="#3f3f79"
                                        />
                                        <path
                                            d="M12.2882 2.25732H5.20492C3.07992 2.25732 2.37158 3.52524 2.37158 5.09066V16.424H6.62158V12.1315C6.62158 11.7632 6.91908 11.4657 7.28742 11.4657H10.2128C10.5741 11.4657 10.8787 11.7632 10.8787 12.1315V16.424H15.1287V5.09066C15.1216 3.52524 14.4132 2.25732 12.2882 2.25732ZM10.5174 7.39274H9.27783V8.63232C9.27783 8.92274 9.037 9.16357 8.74658 9.16357C8.45617 9.16357 8.21533 8.92274 8.21533 8.63232V7.39274H6.97575C6.68533 7.39274 6.4445 7.15191 6.4445 6.86149C6.4445 6.57107 6.68533 6.33024 6.97575 6.33024H8.21533V5.09066C8.21533 4.80024 8.45617 4.55941 8.74658 4.55941C9.037 4.55941 9.27783 4.80024 9.27783 5.09066V6.33024H10.5174C10.8078 6.33024 11.0487 6.57107 11.0487 6.86149C11.0487 7.15191 10.8078 7.39274 10.5174 7.39274Z"
                                            fill="#3f3f79"
                                        />
                                    </svg>
                                }
                                label="انتخاب مرکز"
                                items={getDoctorCenter.data}
                                defaultValue={centerId}
                                valueField="center_id"
                                onChange={value => {
                                    if (value) {
                                        setCenterId(value);
                                        setTimeout(() => getDoctors.refetch(), 0);
                                        setFilters(prev => ({ ...prev, center_id: value }));
                                    }
                                }}
                            />
                            <LevelSelect
                                icon={
                                    <svg
                                        width="17"
                                        height="15"
                                        viewBox="0 0 17 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M5.66699 0.408691C3.68797 0.408691 2.08366 2.013 2.08366 3.99203C2.08366 5.97105 3.68797 7.57536 5.66699 7.57536C7.64601 7.57536 9.25033 5.97105 9.25033 3.99203C9.25033 2.013 7.64601 0.408691 5.66699 0.408691ZM9.41699 1.15869C9.41699 0.882549 9.64085 0.658691 9.91699 0.658691C11.7579 0.658691 13.2503 2.15108 13.2503 3.99203C13.2503 5.83297 11.7579 7.32536 9.91699 7.32536C9.64085 7.32536 9.41699 7.1015 9.41699 6.82536C9.41699 6.54922 9.64085 6.32536 9.91699 6.32536C11.2057 6.32536 12.2503 5.28069 12.2503 3.99203C12.2503 2.70336 11.2057 1.65869 9.91699 1.65869C9.64085 1.65869 9.41699 1.43483 9.41699 1.15869ZM4.25033 8.90869C2.2713 8.90869 0.666992 10.513 0.666992 12.492C0.666992 13.6886 1.63704 14.6587 2.83366 14.6587H8.50033C9.69694 14.6587 10.667 13.6886 10.667 12.492C10.667 10.513 9.06268 8.90869 7.08366 8.90869H4.25033ZM11.3337 9.15869C11.0575 9.15869 10.8337 9.38255 10.8337 9.65869C10.8337 9.93483 11.0575 10.1587 11.3337 10.1587H12.7503C14.039 10.1587 15.0837 11.2034 15.0837 12.492C15.0837 12.9983 14.6733 13.4087 14.167 13.4087H11.3337C11.0575 13.4087 10.8337 13.6325 10.8337 13.9087C10.8337 14.1848 11.0575 14.4087 11.3337 14.4087H14.167C15.2255 14.4087 16.0837 13.5506 16.0837 12.492C16.0837 10.6511 14.5913 9.15869 12.7503 9.15869H11.3337Z"
                                            fill="#3f3f79"
                                        />
                                    </svg>
                                }
                                allLabel="همه دکترها"
                                label="انتخاب دکتر"
                                items={
                                    getDoctors.isSuccess && getDoctors?.data
                                        ? getDoctors.data
                                              .filter(item => item?.doctor_id)
                                              .filter(
                                                  (v, i, a) =>
                                                      a.findIndex(
                                                          t => t.doctor_id === v.doctor_id
                                                      ) === i
                                              )
                                              .map(item => ({
                                                  ...item,
                                                  name: item.name + ' ' + item.family
                                              }))
                                        : []
                                }
                                valueField="doctor_id"
                                onChange={value =>
                                    setFilters(prev => ({ ...prev, doctor_id: value }))
                                }
                            />
                        </>
                    )}
                </div>
                <Filter noPrescriptionType={true} />
            </div>
            <div className={styles.mainWrapper}>
                <div className={styles.header}>
                    <span className="text-lg font-bold">گزارش نسخه های ثبت شده</span>
                    <div className="flex justify-end space-s-3">
                        <LiveMode refetch={refetch} />
                        <ExportExcel
                            data={
                                getCenterName.isSuccess
                                    ? statistics?.data.map(item => ({
                                          ...item,
                                          starts_at: digitsFaToEn(
                                              new Date(item.starts_at).toLocaleDateString('fa')
                                          ),
                                          center_name: getCenterName.data[item.center_id],
                                          ...(level !== levelConstants.doctor && {
                                              doctor_id:
                                                  getDoctors.isSuccess &&
                                                  getDoctors.data.find(
                                                      doctor => doctor.doctor_id === item.doctor_id
                                                  )?.name +
                                                      ' ' +
                                                      getDoctors.data.find(
                                                          doctor =>
                                                              doctor.doctor_id === item.doctor_id
                                                      )?.family
                                          }),
                                          insurance_type:
                                              item.insurance_type === 'salamat'
                                                  ? 'سلامت'
                                                  : 'تامین احتماعی',
                                          gender: item.gender === 'F' ? 'زن' : 'مرد'
                                      }))
                                    : []
                            }
                            schema={resultSchema[level.toLowerCase()]}
                        />
                    </div>
                </div>
                <div>
                    <CountAllPrescriptionStatisitics />
                </div>
                <div className={styles.chartsWrapper}>
                    <div className={styles.chartBlock}>
                        {getPrescriptionStatistics.isLoading && <Overlay opacity="0.5" />}
                        {statistics.data && (
                            <Bar
                                data={Object.keys(groupBy(statistics?.data, 'starts_at')).map(
                                    key => ({
                                        total: sumBy(
                                            statistics?.data.filter(item => item.starts_at === key),
                                            'total'
                                        ),
                                        starts_at_with_year: digitsFaToEn(
                                            new Date(key).toLocaleDateString('fa')
                                        ),
                                        starts_at: digitsFaToEn(
                                            new Date(key).toLocaleDateString('fa').substr(5, 10)
                                        )
                                    })
                                )}
                            />
                        )}
                    </div>
                    <div className={`${styles.chartBlock} ${styles.left}`}>
                        {getPrescriptionStatisticsAggregated.isLoading && <Overlay opacity="0.5" />}
                        {statistics.aggregated && (
                            <>
                                <Pie
                                    data={[
                                        {
                                            id: 'زن',
                                            label: 'زن',
                                            value: statistics.aggregated
                                                ? sumBy(
                                                      statistics.aggregated.filter(
                                                          item => item.gender === 'F'
                                                      ),
                                                      'total'
                                                  )
                                                : 0,
                                            color: 'hsl(303, 70%, 50%)'
                                        },
                                        {
                                            id: 'مرد',
                                            label: 'مرد',
                                            value: statistics.aggregated
                                                ? sumBy(
                                                      statistics.aggregated.filter(
                                                          item => item.gender === 'M'
                                                      ),
                                                      'total'
                                                  )
                                                : 0,
                                            color: 'hsl(37, 70%, 50%)'
                                        }
                                    ]}
                                    fill={[
                                        {
                                            match: {
                                                id: 'زن'
                                            },
                                            id: 'dots'
                                        },
                                        {
                                            match: {
                                                id: 'مرد'
                                            },
                                            id: 'lines'
                                        }
                                    ]}
                                    colors={{ scheme: 'set2' }}
                                />
                                <Pie
                                    data={[
                                        {
                                            id: 'سلامت',
                                            label: 'سلامت',
                                            value: statistics.aggregated
                                                ? sumBy(
                                                      statistics.aggregated.filter(
                                                          item => item.insurance_type === 'salamat'
                                                      ),
                                                      'total'
                                                  )
                                                : 0,
                                            color: 'hsl(303, 70%, 50%)'
                                        },
                                        {
                                            id: 'تامین احتماعی',
                                            label: 'تامین احتماعی',
                                            value: statistics.aggregated
                                                ? sumBy(
                                                      statistics.aggregated.filter(
                                                          item => item.insurance_type === 'tamin'
                                                      ),
                                                      'total'
                                                  )
                                                : 0,
                                            color: 'hsl(37, 70%, 50%)'
                                        }
                                    ]}
                                    fill={[
                                        {
                                            match: {
                                                id: 'سلامت'
                                            },
                                            id: 'dots'
                                        },
                                        {
                                            match: {
                                                id: 'تامین احتماعی'
                                            },
                                            id: 'lines'
                                        }
                                    ]}
                                    colors={{ scheme: 'paired' }}
                                />
                            </>
                        )}
                    </div>
                </div>
                <div
                    className={styles.chartsWrapper}
                    style={{
                        height: '100%',
                        marginBottom: '5rem',
                        maxHeight: 'unset',
                        minHeight: 'unset'
                    }}
                >
                    <div className={styles.tableWrapper}>
                        {statistics?.data && (
                            <Result
                                level={level.toLowerCase()}
                                data={
                                    getCenterName.isSuccess
                                        ? statistics?.data.map(item => ({
                                              ...item,
                                              starts_at: digitsFaToEn(
                                                  new Date(item.starts_at).toLocaleDateString('fa')
                                              ),
                                              center_name: getCenterName.data[item.center_id],
                                              ...(level !== levelConstants.doctor && {
                                                  doctor_id:
                                                      getDoctors.isSuccess &&
                                                      getDoctors.data.find(
                                                          doctor =>
                                                              doctor.doctor_id === item.doctor_id
                                                      )?.name +
                                                          ' ' +
                                                          getDoctors.data.find(
                                                              doctor =>
                                                                  doctor.doctor_id ===
                                                                  item.doctor_id
                                                          )?.family
                                              }),
                                              insurance_type:
                                                  item.insurance_type === 'salamat'
                                                      ? 'سلامت'
                                                      : 'تامین احتماعی',
                                              gender: item.gender === 'F' ? 'زن' : 'مرد'
                                          }))
                                        : []
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionStatistics;
