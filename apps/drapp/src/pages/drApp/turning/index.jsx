import styles from '@assets/styles/pages/drApp/turning.module.scss';
import { SelectDate } from '@components/turning/selectDate';
import { useGetTurns } from '@paziresh24/hooks/drapp/turning';
import { useDrApp } from '@paziresh24/context/drapp';
import { EmptyState } from '@paziresh24/shared/ui/emptyState';
import Modal from '@paziresh24/shared/ui/modal';
import { useEffect, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'jalali-moment';
import Error from '@paziresh24/shared/ui/error';
import { useMediaQuery } from 'react-responsive';
import TurnsList from '@components/turning/tutnsList/default';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import ReferenceModal from '@paziresh24/apps/prescription/components/molecules/referenceModal';
import NewTurn from '@components/turning/newTurn/newTurn';
import Statistics from '@components/turning/statistics';
import { useTurnsStore } from 'apps/drapp/src/store/turns.store';

const Turning = () => {
    const history = useHistory();
    const location = useLocation();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [info] = useDrApp();
    const [date, setDate] = useState(moment().startOf('day').unix());
    const [searchValue, setSearchValue] = useState('');
    const getTurn = useGetTurns({
        baseURL: info.center.local_base_url,
        ...((info.center.local_base_url || window._env_.P24_IS_LOCAL_CENTER) && {
            is_direct: 1
        }),
        center_id: info.center.id,
        date,
        search: searchValue,
        user_id: info.center.user_info_id
    });
    const setTurns = useTurnsStore(state => state.setTurns);
    const setStatistics = useTurnsStore(state => state.setStatistics);
    const taminPrescriptionsType = {
        1: 'دارو',
        2: 'پاراکلينيک',
        3: 'ويزيت',
        4: 'ويزيت و خدمات',
        5: 'خدمات'
    };
    const [prescriptionSuccessedModal, setPrescriptionSuccessedModal] = useState(false);
    const nationalCodeRef = useRef();
    const [prescriptionPendingModal, setPrescriptionPendingModal] = useState(false);
    const [referenceModal, setReferenceModal] = useState(false);

    useEffect(() => {
        if (location.state?.prescriptionInfo?.finalized) {
            setPrescriptionSuccessedModal(location.state?.prescriptionInfo);
            history.replace();
        }

        if (
            !location.state?.prescriptionInfo?.finalized &&
            location.state?.prescriptionInfo?.status === 'SUBMITTED'
        ) {
            setPrescriptionPendingModal(location.state?.prescriptionInfo);
            history.replace();
        }
    }, [location.state]);

    useEffect(() => {
        getTurn.refetch();
    }, [info.center, date, searchValue]);

    useEffect(() => {
        setTurns(getTurn?.data?.data ?? []);
        setStatistics({
            total: getTurn?.data?.data?.length ?? 0,
            activePatients: getTurn?.data?.data?.filter(item =>
                item.type === 'prescription'
                    ? !item.finalized
                    : !item.prescription?.finalized && item.book_status !== 'visited'
            )?.length,
            visitedPatients: getTurn?.data?.data?.filter(turn =>
                turn.type === 'prescription'
                    ? turn.finalized
                    : turn.prescription?.finalized ?? turn.book_status === 'visited'
            )?.length
        });
    }, [getTurn]);

    const onChangeSearch = debounce(
        e => {
            setSearchValue(e.target.value);
        },
        500,
        500,
        { leading: true, trailing: false }
    );

    return (
        <>
            <div className={styles['wrapper']}>
                <Statistics loading={getTurn.isLoading || getTurn.isIdle} />
                <div className={styles['head-bar']}>
                    <div className={styles.selectDate}>
                        <SelectDate
                            today
                            unix
                            value={setDate}
                            nagivateDate={isMobile}
                            defaultValue={date}
                        />
                    </div>
                    <hr />

                    <div className={styles.filterWrapper}>
                        <div className={styles['search-wrapper']}>
                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 19 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18.0867 16.785L14.6858 13.4117C16.0059 11.7657 16.6452 9.67652 16.4722 7.57368C16.2993 5.47085 15.3272 3.51421 13.7559 2.10608C12.1846 0.697956 10.1335 -0.0546237 8.02434 0.00309005C5.91519 0.0608038 3.90832 0.924424 2.41637 2.41637C0.924424 3.90832 0.0608038 5.91519 0.00309005 8.02434C-0.0546237 10.1335 0.697956 12.1846 2.10608 13.7559C3.51421 15.3272 5.47085 16.2993 7.57368 16.4722C9.67651 16.6452 11.7657 16.0059 13.4117 14.6858L16.785 18.0592C16.8702 18.1451 16.9716 18.2133 17.0833 18.2598C17.195 18.3063 17.3148 18.3303 17.4358 18.3303C17.5568 18.3303 17.6766 18.3063 17.7884 18.2598C17.9001 18.2133 18.0014 18.1451 18.0867 18.0592C18.2519 17.8882 18.3442 17.6598 18.3442 17.4221C18.3442 17.1844 18.2519 16.9559 18.0867 16.785ZM8.26916 14.6858C7.00006 14.6858 5.75946 14.3095 4.70425 13.6044C3.64903 12.8994 2.82659 11.8972 2.34093 10.7247C1.85527 9.55222 1.7282 8.26204 1.97579 7.01733C2.22337 5.77262 2.8345 4.62928 3.73189 3.73189C4.62928 2.8345 5.77262 2.22338 7.01733 1.97579C8.26204 1.7282 9.55222 1.85527 10.7247 2.34093C11.8972 2.82659 12.8994 3.64903 13.6044 4.70425C14.3095 5.75947 14.6858 7.00006 14.6858 8.26916C14.6858 9.97097 14.0098 11.6031 12.8064 12.8064C11.6031 14.0098 9.97096 14.6858 8.26916 14.6858Z"
                                    fill="#3F3F79"
                                    opacity="0.5"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="نام بیمار، شماره موبایل یا کد ملی ..."
                                onChange={onChangeSearch}
                            />
                        </div>
                    </div>
                    <NewTurn />
                </div>

                <div
                    className={styles['turn-cards']}
                    style={{
                        overflow: getTurn.isLoading && 'hidden'
                    }}
                >
                    {getTurn.isSuccess && isEmpty(getTurn?.data?.data) && (
                        <EmptyState text="نوبتی وجود ندارد" />
                    )}

                    {getTurn.isError && (
                        <Error
                            error={getTurn.error?.response?.data?.message}
                            message={`خطا در دریافت نوبت های ${info.center.name}`}
                        />
                    )}

                    <TurnsList loading={getTurn.isLoading || getTurn.isIdle} />
                </div>
            </div>

            <Modal
                title="نسخه با موفقیت ثبت شد"
                isOpen={prescriptionSuccessedModal}
                onClose={setPrescriptionSuccessedModal}
            >
                <span style={{ lineHeight: '2.5rem' }}>
                    نسخه{' '}
                    {prescriptionSuccessedModal?.patientAdditionalData?.name +
                        ' ' +
                        prescriptionSuccessedModal?.patientAdditionalData?.lastName}{' '}
                    با کد پیگیری{' '}
                    {prescriptionSuccessedModal?.insuranceType === 'tamin' &&
                        prescriptionSuccessedModal?.[
                            prescriptionSuccessedModal?.insuranceType + '_prescriptions'
                        ]?.[0]?.head_EPRSC_ID}
                    {prescriptionSuccessedModal?.insuranceType === 'salamat' &&
                        prescriptionSuccessedModal[
                            prescriptionSuccessedModal?.insuranceType + '_prescription'
                        ]?.trackingCode}{' '}
                    با موفقیت ثبت شد.
                </span>
                {prescriptionSuccessedModal?.insuranceType === 'salamat' && (
                    <span>
                        کدتوالی: {prescriptionSuccessedModal?.salamat_prescription?.sequenceNumber}
                    </span>
                )}
            </Modal>

            <Modal
                title="نسخه شما در صف ارسال قرار گرفت"
                isOpen={prescriptionPendingModal}
                onClose={setPrescriptionPendingModal}
            >
                {prescriptionPendingModal?.insuranceType === 'tamin' ? (
                    <span style={{ textAlign: 'justify', lineHeight: '2.5rem' }}>
                        {prescriptionPendingModal?.tamin_prescriptions?.filter(
                            item => item.finalized
                        ) > 0 && (
                            <>
                                نسخه{' '}
                                {prescriptionPendingModal?.tamin_prescriptions
                                    ?.filter(item => item.finalized)
                                    ?.map(
                                        taminP =>
                                            taminPrescriptionsType[taminP.taminPrescriptionType]
                                    )
                                    .join(' و ')}{' '}
                                {prescriptionPendingModal?.patientAdditionalData?.name +
                                    ' ' +
                                    prescriptionPendingModal?.patientAdditionalData?.lastName}{' '}
                                با کد پیگیری{' '}
                                {prescriptionPendingModal?.insuranceType === 'tamin' &&
                                    prescriptionPendingModal?.[
                                        prescriptionPendingModal?.insuranceType + '_prescriptions'
                                    ]?.[0]?.head_EPRSC_ID}
                                {''}
                                با موفقیت ثبت شد.
                                {'  '}
                            </>
                        )}
                        خطا در ثبت نسخه{' '}
                        {prescriptionPendingModal?.tamin_prescriptions
                            ?.filter(item => !item.finalized)
                            .map(taminP => taminPrescriptionsType[taminP.taminPrescriptionType])
                            .join(' و ')}{' '}
                        به دلیل خطا از سمت سازمان بیمه گر در صف ارسال قرار گرفت{''}
                    </span>
                ) : (
                    <span style={{ textAlign: 'justify', lineHeight: '2.5rem' }}>
                        به محض اتصال مجدد ارتباط با سازمان بیمه گر، نسخه ارسال و به وسیله پیامک به
                        شما و بیمار اطلاع داده خواهد شد.
                    </span>
                )}
            </Modal>

            <ReferenceModal
                isOpen={referenceModal}
                onClose={setReferenceModal}
                nationalCodeDefaultValue={nationalCodeRef.current?.value}
            />
        </>
    );
};

export default Turning;
