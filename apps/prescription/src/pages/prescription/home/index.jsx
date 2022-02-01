/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from './home.module.scss';
// HOOKS
import {
    useAddPrescription,
    useDeletePrescription,
    useGetPrescriptionByPrintcode,
    useGetPrescriptionBySamadcode,
    useGetPrescriptionReference,
    useGetPrescriptions
} from '@paziresh24/hooks/prescription';

import classNames from 'classnames';

// COMPONENTS
import { Body } from '@paziresh24/components/prescription/panel/body';
import { EmptyState } from '@paziresh24/components/prescription/emptyState';
import SearchBar from '@paziresh24/components/prescription/search/searchBar';
import { createRef, useEffect, useState } from 'react';
import { FilterIcon } from '@paziresh24/components/icons/public/duotone/';
import Modal from '@paziresh24/components/core/modal';
import Button from '@paziresh24/components/core/button';
import { Calendar } from '@hassanmojab/react-modern-calendar-datepicker';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import moment from 'jalali-moment';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import TexFiled from '@paziresh24/components/core/textField';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useHistory, useLocation } from 'react-router-dom';
import { CalendarIcon } from '@paziresh24/components/icons';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { DeliverCase } from '@paziresh24/components/prescription/deliver/deliverCase';
import { v4 as uuid } from 'uuid';
import TurnsList from '@paziresh24/components/prescription/turnsList/default';
import { useInView } from 'react-intersection-observer';
import LoadingIcon from '@paziresh24/components/icons/public/loading';
import queryString from 'querystring';
import { useDrApp } from '@paziresh24/context/drapp';

const Home = props => {
    const [info] = useDrApp();
    const [params, setParams] = useState();
    const history = useHistory();
    const uuidInstance = uuid();
    const [page, setPage] = useState(0);
    const [results, setResults] = useState([]);

    const { search } = useLocation();
    const urlParams = queryString.parse(search);

    const [rangeDate, setRangeDate] = useState();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [prescriptionInfo] = useSelectPrescription();

    const [printCode, setPrintCode] = useState();
    const [samadCode, setSamadCode] = useState();
    const [nationalCode, setNationalCode] = useState();

    const prescriptions = useGetPrescriptions({
        finalized: 1,
        _start: page,
        _limit: 20,
        ...params
    });

    const [ref, inView] = useInView({
        threshold: 0
    });

    useEffect(() => {
        if (inView) {
            setPage(prevState => prevState + 20);
        }
    }, [inView]);
    const getPrescriptionByPrintcode = useGetPrescriptionByPrintcode({
        code: printCode,
        nationalCode: nationalCode,
        identifier: info.center.id
    });
    const getPrescriptionBySamadcode = useGetPrescriptionBySamadcode({
        code: samadCode,
        nationalCode: nationalCode
    });

    const [filterCount, setFilterCount] = useState(0);

    const [filterModal, setFilterModal] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [fetchPrescriptionModal, setFetchPrescriptionModal] = useState(false);

    const [gender, setGender] = useState('All');
    const [insuranceType, setInsuranceType] = useState('All');
    const [type, setType] = useState(null);

    const [searchValue, setSearchValue] = useState('');
    const [selectedDayRange, setSelectedDayRange] = useState({
        from: null,
        to: null
    });
    const deletePrescription = useDeletePrescription();

    const [pdfFetchPrescriptionLink, setPpdfFetchPrescriptionLink] = useState();
    const linkFetchPrescriptionClick = createRef();

    const [deletePrescriptionModal, setDeletePrescriptionModal] = useState(false);

    const addPrescription = useAddPrescription();

    const [deliverModal, setDeliverModal] = useState(false);
    const [deliverConfirmModal, setDeliverConfirmModal] = useState(false);

    const getPrescriptionReference = useGetPrescriptionReference();

    const [refrenceConfirmModal, setRefrenceConfirmModal] = useState(false);

    const [dropDownShow, setDropDownShow] = useState(false);

    // useEffect(() => {
    //     if (!prescriptionSuccessedModal) history.replace();
    // }, [prescriptionSuccessedModal]);

    const confirmRangeDate = () => {
        if (selectedDayRange.to !== null) {
            setOpenCalendar(false);

            setRangeDate({
                created_at_gte: moment
                    .from(
                        `${selectedDayRange.from.year}/${selectedDayRange.from.month}/${selectedDayRange.from.day}`,
                        'fa',
                        'YYYY/MM/DD'
                    )
                    .format('YYYY-MM-DD'),
                created_at_lte: moment
                    .from(
                        `${selectedDayRange.to.year}/${selectedDayRange.to.month}/${selectedDayRange.to.day}`,
                        'fa',
                        'YYYY/MM/DD'
                    )
                    .format('YYYY-MM-DD')
            });
        }
    };

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (prescriptions.isSuccess) {
            setIsLoading(false);
            setResults(prevState => prevState.concat(prescriptions.data));
        }
        if (prescriptions.isError) {
            console.clear();
            return setIsLoading(false);
        }
    }, [prescriptions.status]);

    useEffect(() => {
        prescriptions.remove();
        if (page > 0) prescriptions.refetch();
    }, [page]);

    useEffect(async () => {
        if (deletePrescription.isSuccess) {
            setDeletePrescriptionModal(false);
            await prescriptions.remove();
            prescriptions.refetch();
        }
        if (deletePrescription.isError) {
            setDeletePrescriptionModal(false);

            !toast.isActive('deletePrescription') &&
                toast.error(deletePrescription.error.response.data.message, {
                    toastId: 'deletePrescription'
                });
        }
    }, [deletePrescription.status]);

    useEffect(() => {
        if (
            (getPrescriptionByPrintcode.isSuccess || getPrescriptionBySamadcode.isSuccess) &&
            pdfFetchPrescriptionLink
        ) {
            linkFetchPrescriptionClick.current.click();
            getPrescriptionByPrintcode.remove();
            getPrescriptionBySamadcode.remove();
            setPpdfFetchPrescriptionLink(false);
        }
    }, [
        pdfFetchPrescriptionLink,
        getPrescriptionByPrintcode.status,
        getPrescriptionBySamadcode.status
    ]);

    useEffect(() => {
        // getPrescriptionReference.remove();
        // getPrescriptionReference.remove();

        if (getPrescriptionByPrintcode.isSuccess) {
            if (
                !isEmpty(getPrescriptionByPrintcode?.data?.data) &&
                !getPrescriptionByPrintcode?.data?.patientData?.isReferenceable
            ) {
                return setDeliverConfirmModal(true);
            }
            if (getPrescriptionByPrintcode.data.patientData?.isReferenceable) {
                return setRefrenceConfirmModal(true);
            }
            if (getPrescriptionByPrintcode.data?.prescription?.id) {
                return history.push(
                    `/prescription/patient/${getPrescriptionByPrintcode.data.prescription.id}`
                );
            }
            setPpdfFetchPrescriptionLink(
                `data:application/pdf;base64,${getPrescriptionByPrintcode.data.pdf}`
            );
        }
        if (getPrescriptionBySamadcode.isSuccess) {
            if (getPrescriptionBySamadcode.data?.prescription?.id) {
                return history.push(
                    `/prescription/patient/${getPrescriptionBySamadcode.data.prescription.id}`
                );
            }
            setPpdfFetchPrescriptionLink(
                `data:application/pdf;base64,${getPrescriptionBySamadcode.data.pdf}`
            );
        }

        if (getPrescriptionByPrintcode.isError) {
            !toast.isActive('getPrescriptionByPrintcode') &&
                toast.error(getPrescriptionByPrintcode.error.response.data.message, {
                    toastId: 'getPrescriptionByPrintcode'
                });
        }
        if (getPrescriptionBySamadcode.isError) {
            !toast.isActive('getPrescriptionBySamadcode') &&
                toast.error(getPrescriptionBySamadcode.error.response.data.message, {
                    toastId: 'getPrescriptionBySamadcode'
                });
        }
    }, [getPrescriptionByPrintcode.status, getPrescriptionBySamadcode.status]);

    useEffect(() => {
        if (getPrescriptionReference.isSuccess) {
            setRefrenceConfirmModal(false);
            return history.push(
                `/prescription/patient/${getPrescriptionReference.data.prescription.id}`
            );
        }
        if (getPrescriptionReference.isError) {
            setRefrenceConfirmModal(false);

            !toast.isActive('getPrescriptionReference') &&
                toast.info(getPrescriptionReference.error.response.data.message, {
                    toastId: 'getPrescriptionReference'
                });
            if (!isEmpty(getPrescriptionByPrintcode.data.data)) {
                return setDeliverConfirmModal(true);
            }
        }
    }, [getPrescriptionReference.status]);

    useEffect(() => {
        prescriptions.remove();
        prescriptions.refetch();
    }, [params]);

    useEffect(() => {
        if (searchValue.length > 0) {
            setResults([]);
            setPage(0);
            setIsLoading(true);

            setTimeout(
                setParams({
                    _q: searchValue
                }),
                0
            );
        } else {
            setResults([]);
            setPage(0);
            setIsLoading(true);

            setParams();
            setTimeout(() => prescriptions.refetch(), 0);
        }
    }, [searchValue]);

    // useEffect(() => {
    //     if (filterModal && prescriptions.isSuccess) {
    //         getTypes.refetch();
    //     }
    // }, [filterModal, prescriptions.status]);

    const setFilter = () => {
        setResults([]);
        setPage(0);
        setIsLoading(true);

        setFilterModal(false);
        let data = { ...params, ...rangeDate, gender, insuranceType, type };

        setFilterCount(0);
        if (gender === 'M' || gender === 'F') {
            setFilterCount(prev => prev + 1);
        }
        if (insuranceType === 'tamin' || insuranceType === 'salamat') {
            setFilterCount(prev => prev + 1);
        }
        if (type !== null) {
            setFilterCount(prev => prev + 1);
        }
        if (rangeDate !== undefined) {
            setFilterCount(prev => prev + 1);
        }

        if (gender === 'All') {
            data = omit(data, ['gender']);
        }

        if (insuranceType === 'All') {
            data = omit(data, ['insuranceType']);
        }

        if (type === null) {
            data = omit(data, ['type']);
        }

        setParams(data);
    };

    const clearFilter = () => {
        setResults([]);
        setPage(0);
        setIsLoading(true);

        setFilterModal(false);

        setFilterCount(0);
        setRangeDate();
        setSelectedDayRange({
            from: null,
            to: null
        });
        setGender('All');
        setInsuranceType('All');
        setType(null);
        setParams(omit(params, ['created_at_lte', 'created_at_gte', 'gender', 'type']));
    };

    const prescriptionByPrintcodeAction = data => {
        setPrintCode(data.code);
        setNationalCode(data.nationalCode);

        getPrescriptionByPrintcode.remove();
        setTimeout(() => {
            getPrescriptionByPrintcode.refetch();
        });
    };

    const prescriptionBySamadcodeAction = data => {
        setSamadCode(data.code);
        setNationalCode(data.nationalCode);

        setTimeout(() => {
            getPrescriptionBySamadcode.refetch();
        });
    };

    const deletePrescriptionAction = async () => {
        deletePrescription.mutate(deletePrescriptionModal);
    };

    const refrenceConfirmAction = bol => {
        if (bol) {
            const tags = [];
            tags.push({
                type: 'center_id',
                value: info.center.id
            });
            info.center?.referral_id &&
                tags.push({
                    type: 'siam',
                    value: info.center.referral_id
                });
            return getPrescriptionReference.mutate({
                code: printCode,
                nationalCode: nationalCode,
                identifier: info.center.id,
                tags
            });
        }

        addPrescription.mutate(
            {
                patientNationalCode: nationalCode,
                identifier: uuidInstance
            },
            {
                onSuccess: () => {
                    setRefrenceConfirmModal(false);
                    return history.push(`/prescription/patient/${addPrescription.data.result.id}`);
                },
                onError: () => {
                    setRefrenceConfirmModal(false);
                    !toast.isActive('add') &&
                        toast.error(
                            addPrescription.error.response?.data.message ||
                                'خطا در دریافت اطلاعات.',
                            {
                                toastId: 'add'
                            }
                        );
                }
            }
        );
    };

    document.querySelector('body').addEventListener('click', () => {
        if (dropDownShow) {
            setDropDownShow(false);
        }
    });

    return (
        <div className={styles.wrapper}>
            <DeliverCase
                isOpen={deliverModal}
                onClose={setDeliverModal}
                trackingCode={printCode}
                nationalCode={nationalCode}
            />

            <Modal
                title="آیا میخواهید خدمات در مطب ارائه نمائید؟"
                isOpen={deliverConfirmModal}
                onClose={setDeliverConfirmModal}
            >
                <div className={styles['confirmModal-row']}>
                    <Button
                        block
                        variant="primary"
                        onClick={() => {
                            setDeliverConfirmModal(false);
                            setDeliverModal(true);
                        }}
                    >
                        بله
                    </Button>
                    <Button block variant="secondary" onClick={() => setDeliverConfirmModal(false)}>
                        خیر
                    </Button>
                </div>
            </Modal>

            <Modal
                title="آیا از مسیر ارجاع آمده اید؟"
                isOpen={refrenceConfirmModal}
                onClose={setRefrenceConfirmModal}
            >
                <div className={styles['confirmModal-row']}>
                    <Button
                        block
                        variant="primary"
                        onClick={() => {
                            refrenceConfirmAction(true);
                        }}
                        loading={getPrescriptionReference.isLoading}
                    >
                        بله
                    </Button>
                    <Button
                        block
                        variant="secondary"
                        onClick={() => refrenceConfirmAction(false)}
                        loading={addPrescription.isLoading}
                    >
                        خیر
                    </Button>
                </div>
            </Modal>

            <div className={styles['search']}>
                <div className={styles['search-row']}>
                    <div className={styles.searchWrapper}>
                        <SearchBar label="جستجوی بین نسخه ها" value={setSearchValue} />
                    </div>
                    <button className={styles['filterButton']} onClick={() => setFilterModal(true)}>
                        <FilterIcon />
                        {filterCount !== 0 && (
                            <span className={styles['filter-count-badge']}>{filterCount}</span>
                        )}
                    </button>
                </div>
                <div className={styles['search-row']}>
                    <div
                        className={styles['option']}
                        onClick={() => setFetchPrescriptionModal(true)}
                        aria-hidden
                    >
                        واکشی نسخه
                    </div>
                </div>
            </div>
            <div
                className="flex-grow-0 overflow-auto w-full flex flex-col space-y-1"
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                    flexGrow: '0',
                    gap: '1rem',
                    alignItems: 'center'
                }}
            >
                <TurnsList
                    refetchData={() => prescriptions.refetch()}
                    turns={results}
                    loading={isLoading}
                />
                {prescriptions.isSuccess && prescriptions.data.length === 0 && (
                    <EmptyState text="نسخه ای وجود ندارد" />
                )}
                {prescriptions.isSuccess && prescriptions.data.length === 20 && (
                    <div ref={ref} className="flex justify-center w-full">
                        <LoadingIcon color="#3f3f79" width={30} height={30} />
                    </div>
                )}
            </div>
            <Modal title="انتخاب  تاریخ" isOpen={openCalendar} onClose={setOpenCalendar}>
                <Calendar
                    inputPlaceholder="Select a day"
                    shouldHighlightWeekends
                    colorPrimary="#27bda0"
                    locale="fa"
                    calendarClassName={styles['calendarWrap']}
                    value={selectedDayRange}
                    onChange={setSelectedDayRange}
                />
                <Button
                    block
                    variant="primary"
                    onClick={confirmRangeDate}
                    disabled={selectedDayRange.to === null}
                    calendarClassName={styles['calendarWrap']}
                >
                    تایید
                </Button>
            </Modal>
            <Modal title="فیلترها" isOpen={filterModal} onClose={setFilterModal}>
                <div className={styles['filterModal-wrapper']}>
                    {/* <Select label="نوع نسخه" searchble value={setType} default-value={type}>
                            {getTypes.data.map(item => (
                                <Option key={item.id} title={item.name} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select> */}

                    <div className={styles['select']}>
                        <div className={styles['select-option']}>
                            <div
                                className={classNames({
                                    [styles['checked']]: insuranceType === 'tamin',
                                    [styles['option']]: true
                                })}
                                onClick={() => setInsuranceType('tamin')}
                                aria-hidden
                            >
                                تامین اجتماعی
                            </div>
                            <div
                                className={classNames({
                                    [styles['checked']]: insuranceType === 'salamat',
                                    [styles['option']]: true
                                })}
                                onClick={() => setInsuranceType('salamat')}
                                aria-hidden
                            >
                                سلامت
                            </div>
                        </div>
                        <div
                            className={classNames({
                                [styles['checked']]: insuranceType === 'All',
                                [styles['option']]: true
                            })}
                            onClick={() => setInsuranceType('All')}
                            aria-hidden
                        >
                            همه
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        className={styles['calandar-button']}
                        onClick={() => setOpenCalendar(true)}
                        icon={<CalendarIcon />}
                    >
                        {selectedDayRange.from && selectedDayRange.to
                            ? ` از ${moment
                                  .from(
                                      `${selectedDayRange.from.year}/${selectedDayRange.from.month}/${selectedDayRange.from.day}`,
                                      'fa',
                                      'YYYY/MM/DD'
                                  )
                                  .locale('fa')
                                  .format('D MMM')} تا ${moment
                                  .from(
                                      `${selectedDayRange.to.year}/${selectedDayRange.to.month}/${selectedDayRange.to.day}`,
                                      'fa',
                                      'YYYY/MM/DD'
                                  )
                                  .locale('fa')
                                  .format('D MMM')}`
                            : 'انتخاب بازه زمانی'}
                    </Button>

                    <div className={styles['select']}>
                        <div className={styles['select-option']}>
                            <div
                                className={classNames({
                                    [styles['checked']]: gender === 'M',
                                    [styles['option']]: true
                                })}
                                onClick={() => setGender('M')}
                                aria-hidden
                            >
                                آقا
                            </div>
                            <div
                                className={classNames({
                                    [styles['checked']]: gender === 'F',
                                    [styles['option']]: true
                                })}
                                onClick={() => setGender('F')}
                                aria-hidden
                            >
                                خانم
                            </div>
                        </div>
                        <div
                            className={classNames({
                                [styles['checked']]: gender === 'All',
                                [styles['option']]: true
                            })}
                            onClick={() => setGender('All')}
                            aria-hidden
                        >
                            همه
                        </div>
                    </div>

                    <div className={styles['buttonsWrapper']}>
                        <Button block variant="primary" onClick={setFilter}>
                            اعمال فیلتر
                        </Button>
                        <Button variant="secondary" onClick={clearFilter}>
                            حذف فیلتر
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal
                title="واکشی نسخه"
                isOpen={fetchPrescriptionModal}
                onClose={setFetchPrescriptionModal}
            >
                <form
                    onSubmit={handleSubmit(prescriptionByPrintcodeAction)}
                    className={styles['fetch-rescription-wrapper']}
                >
                    <TexFiled
                        type="tel"
                        label="کد پیگیری"
                        name="code"
                        error={errors.code}
                        {...register('code', {
                            required: true
                        })}
                    />
                    <TexFiled
                        type="tel"
                        label="کدملی/کداتباع بیمار"
                        name="nationalCode"
                        error={errors.nationalCode}
                        {...register('nationalCode', {
                            required: true,
                            maxLength: 12,
                            minLength: 10
                        })}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        block
                        loading={
                            getPrescriptionByPrintcode.isLoading ||
                            getPrescriptionReference.isLoading
                        }
                    >
                        جستجو
                    </Button>
                </form>
            </Modal>
            <Modal
                title="آیا از حذف نسخه مطمئن می باشید؟"
                isOpen={deletePrescriptionModal}
                onClose={setDeletePrescriptionModal}
            >
                <div className={styles['confirmModal-row']}>
                    <Button
                        block
                        variant="primary"
                        theme="error"
                        onClick={deletePrescriptionAction}
                        loading={deletePrescription.isLoading}
                    >
                        بله و حذف
                    </Button>
                    <Button
                        block
                        variant="secondary"
                        theme="error"
                        onClick={() => setDeletePrescriptionModal(false)}
                    >
                        لغو عملیات
                    </Button>
                </div>
            </Modal>
            {/* <Prescriptionsuccessed
                isOpen={prescriptionSuccessedModal}
                onClose={setPrescriptionSuccessedModal}
                trackingCode={location.state?.trackingCode}
                sequenceNumber={location.state?.sequenceNumber}
            /> */}
            {/* {prescriptions.isSuccess && <AddPrescription />} */}
        </div>
    );
};

export default Home;
