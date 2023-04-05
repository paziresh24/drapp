import Chip from '@mui/material/Chip';
import Button from '@mui/lab/LoadingButton';
import { useDrApp } from '@paziresh24/context/drapp';
import { useAddPrescription, useDeletePrescription } from '@paziresh24/hooks/prescription';
import { useUpdateDescription } from 'apps/drapp/src/apis/prescription/updateDescription';
import { toast } from 'react-toastify';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { addCommas, digitsFaToEn } from '@persian-tools/persian-tools';
import axios from 'axios';
import moment from 'jalali-moment';
import { useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Visit from '../visit';
import { ChevronIcon, DotsIcon, TrashIcon } from '@paziresh24/shared/icon';
import Stack from '@mui/material/Stack';
import DropDown from '@paziresh24/shared/ui/dropDown';
import Modal from '@paziresh24/shared/ui/modal';
import { CONSULT_CENTER_ID } from '@paziresh24/constants/consultCenterId';
import { Default, Mobile } from '@paziresh24/hooks/device';
import { chunk } from 'lodash';
import { useTurnsStore } from 'apps/drapp/src/store/turns.store';
import { TextField } from '@mui/material';
import { usePaziresh } from '@paziresh24/hooks/drapp/turning';

type Prescription = {
    id: string;
    finalized: boolean;
    status?: 'SUCCESS' | 'FAILED';
    issuerType: string;
    provider: 'salamat' | 'tamin';
    pdfName: string;
    trackingCode: string[];
    isReference: boolean;
    sequenceNumber: string;
};

interface TurnRowProps {
    id: string;
    number: number;
    name: string;
    family: string;
    nationalCode: string;
    mobileNumber: string;
    date: string;
    refId?: string;
    paymentStatus?: string;
    paymentPrice?: string;
    bookStatus?: string;
    type: 'book' | 'prescription';
    prescription: Prescription;
}

const TurnRow = (props: TurnRowProps) => {
    const [info] = useDrApp();
    const {
        number,
        prescription,
        name,
        family,
        mobileNumber,
        date,
        id,
        nationalCode,
        type,
        paymentStatus,
        paymentPrice,
        refId,
        bookStatus
    } = props;
    const router = useHistory();
    const queryClient = useQueryClient();
    const [visitModal, setVisitModal] = useState(false);
    const addPrescription = useAddPrescription();
    const updateDescription = useUpdateDescription();
    const deletePrescription = useDeletePrescription();
    const turns = useTurnsStore(state => state.turns);
    const [visitLoading, setVisitLoading] = useState(false);
    const [prescriptionLoading, setPrescriptionLoading] = useState(false);
    const [deletePrescriptionModal, setDeletePrescriptionModal] = useState(false);
    const [descriptionTreatmentModal, setDescriptionTreatmentModal] = useState(false);
    const [descriptionTreatment, setDescriptionTreatment] = useState('');
    const [nationalCodeModal, setNationalCodeModal] = useState<'prescription' | 'visit' | false>(
        false
    );
    const paziresh = usePaziresh();
    const [nationalCodeValue, setNationalCode] = useState('');
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const pdfLink = useRef(
        `${
            process.env.NODE_ENV === 'production'
                ? window.location.hostname === window._env_.P24_MAIN_DOMAIN
                    ? window._env_.P24_BASE_URL_PRESCRIPTION_API
                    : (info.center?.local_base_url ?? window.location.origin) +
                      process.env.REACT_APP_BASE_URL_PRESCRIPTION_ROUTE
                : window._env_.P24_BASE_URL_PRESCRIPTION_API
        }/pdfs/` + prescription.pdfName
    );
    const turn = useRef(turns.find(turn => turn.id === id));

    const handleOpenPrescription = async () => {
        getSplunkInstance().sendEvent({
            group: 'turning-list',
            type: 'prescription-action'
        });
        if (prescription.id)
            return router.push(`/prescription/patient/${prescription.id}`, {
                prescriptionInfo: type === 'book' ? turn.current.prescription : turn.current
            });
        try {
            setPrescriptionLoading(true);
            const { result } = (await createPrescription({
                mobileNumber,
                nationalCode: nationalCode ?? nationalCodeValue,
                id
            })) as any;
            setPrescriptionLoading(false);
            router.push(`/prescription/patient/${result.id}`, {
                prescriptionInfo: result
            });
        } catch (error) {
            errorCatch(error);
            setPrescriptionLoading(false);
        }
    };

    const handleUpdateDescription = async () => {
        try {
            await updateDescription.mutateAsync({
                bookId: id,
                centerId: info.center.id,
                params: {
                    description: descriptionTreatment
                }
            });
            queryClient.refetchQueries('turns');
            toast.success('درخواست شما با موفقیت ثبت شد!');
            setDescriptionTreatmentModal(false);
            getSplunkInstance().sendEvent({
                group: 'drapp-visit-online',
                type: 'description',
                event: {
                    action: descriptionTreatment,
                    doctor_name: info.doctor.name,
                    doctor_family: info.doctor.family,
                    medical_code: info.doctor.medical_code,
                    expertises: info.doctor.expertises[0].alias_title,
                    user_name: name,
                    user_family: family,
                    user_cell: mobileNumber
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    const handleVisit = async () => {
        if (info.center.id === CONSULT_CENTER_ID && type === 'book') return setVisitModal(true);
        if (prescription.id) return setVisitModal(true);
        try {
            setVisitLoading(true);
            (await createPrescription({
                mobileNumber,
                nationalCode: nationalCode ?? nationalCodeValue,
                id
            })) as any;
            setVisitModal(true);
            setVisitLoading(false);
        } catch (error) {
            errorCatch(error);
            setVisitLoading(false);
        }
    };

    const createPrescription = async ({
        nationalCode,
        mobileNumber,
        id
    }: {
        nationalCode: string;
        mobileNumber?: string;
        id: string;
    }) => {
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
        return addPrescription.mutateAsync({
            baseURL: info.center.local_base_url,
            patientCell: digitsFaToEn(mobileNumber ?? ''),
            patientNationalCode: digitsFaToEn(nationalCode),
            identifier: id,
            tags: tags
        });
    };

    const handleDeletePrescription = async () => {
        try {
            await deletePrescription.mutateAsync({
                baseURL: info.center.local_base_url,
                id: prescription.id
            });

            queryClient.refetchQueries('turns');
            setDeletePrescriptionModal(false);
        } catch (error) {
            if (axios.isAxiosError(error)) toast.error(error.response?.data?.message);
        }
    };

    const errorCatch = (error: any) => {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message);
            if (
                error.response?.data?.message ===
                'بیمار دارای بیمه تامین اجتماعی می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
            ) {
                router.push('/providers');
            }
            if (
                error.response?.data?.message ===
                'بیمار دارای بیمه سلامت می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
            ) {
                router.push('/providers');
            }
        }
    };

    const visitProvider = (): 'paziresh24' | 'salamat' | 'tamin' => {
        const insuranceProvider =
            prescription?.provider ??
            (addPrescription?.data as any)?.result?.insuranceType ??
            'paziresh24';

        if (info.center.id === CONSULT_CENTER_ID) return 'paziresh24';

        return insuranceProvider;
    };

    const VisitButton = () => (
        <Button
            variant="outlined"
            size="small"
            disabled={prescription.finalized}
            onClick={() => {
                if (info.center.id === CONSULT_CENTER_ID) return setDescriptionTreatmentModal(true);
                if (!nationalCode) return setNationalCodeModal('visit');
                handleVisit();
            }}
            loading={visitLoading}
            fullWidth
        >
            {info.center.id === CONSULT_CENTER_ID
                ? bookStatus === 'visited'
                    ? 'مراجعه شده'
                    : 'اعلام مراجعه'
                : prescription.finalized
                ? 'ویزیت شده'
                : 'ویزیت '}
        </Button>
    );

    const PrescriptionButton = () => (
        <Button
            size="small"
            variant="outlined"
            onClick={() => {
                if (!nationalCode) return setNationalCodeModal('prescription');
                handleOpenPrescription();
            }}
            loading={prescriptionLoading}
            fullWidth
        >
            {prescription.finalized ? 'مشاهده نسخه' : 'تجویز '}
        </Button>
    );

    const data = [
        {
            name: 'نام',
            component: (
                <div className="flex items-center space-s-3">
                    <ChevronIcon
                        onClick={() => setIsDetailsOpen(prev => !prev)}
                        color="#0070f3"
                        className="cursor-pointer"
                        dir={isDetailsOpen ? 'top' : 'bottom'}
                    />
                    {prescription?.provider === 'salamat' && prescription?.isReference && (
                        <Chip label="ارجاع" />
                    )}

                    <span>
                        {number}
                        {'- '}
                        {name + ' ' + family}
                    </span>
                </div>
            )
        },
        {
            name: 'شماره موبایل',
            component: <span>{mobileNumber ?? '-'}</span>
        },
        {
            name: 'وضعیت نسخه',
            component: (
                <>
                    {prescription?.status !== undefined &&
                        (prescription?.finalized ? (
                            <span data-tip="نسخه ثبت شده است" className="text-green-500">
                                ثبت شده
                            </span>
                        ) : !prescription?.status ? (
                            <span data-tip="نسخه ای هنوز ثبت نشده" className="text-red-500">
                                ثبت نشده
                            </span>
                        ) : prescription?.status === 'FAILED' ? (
                            <span className="text-red-500">خطا در ثبت</span>
                        ) : (
                            <span
                                data-tip="نسخه ای که به هر علتی با موفقیت صادر نشده اما در بکگراند برای ارسال آن درحال اقدام هستیم"
                                className="text-gray-500"
                            >
                                در صف ثبت
                            </span>
                        ))}
                </>
            )
        },
        {
            name: 'نوع بیمه',
            component: <span>{prescription?.issuerType ?? '-'}</span>
        },
        {
            name: 'تاریخ نوبت',
            component: (
                <span>
                    {moment.from(date, 'en').locale('fa').calendar(undefined, {
                        sameDay: '[امروز]',
                        nextDay: '[فردا]',
                        nextWeek: 'D MMMM',
                        lastDay: '[دیروز]',
                        lastWeek: 'D MMMM',
                        sameElse: 'D MMMM'
                    })}
                    {' ساعت '}
                    {moment.from(date, 'en').locale('fa').format('HH:mm')}
                </span>
            )
        }
    ];

    const turnDetails = [
        {
            name: 'کدملی',
            component: <span>{nationalCode ?? '-'}</span>
        },
        {
            name: 'وضعیت پرداخت',
            component: (
                <span>
                    {paymentStatus === 'paid' && <span>پرداخت شده</span>}
                    {paymentStatus === 'refunded' && <span>استرداد شده</span>}
                    {!paymentStatus && <span> - </span>}
                </span>
            ),
            isShow: type === 'book' && info.center.id === CONSULT_CENTER_ID
        },
        {
            name: 'مبلغ ویزیت',
            component: <span>{paymentPrice ? `${addCommas(+paymentPrice / 10)} تومان` : '-'}</span>,
            isShow: type === 'book' && info.center.id === CONSULT_CENTER_ID
        },
        {
            name: 'کد پیگیری نوبت',
            component: <span>{refId ?? '-'}</span>,
            isShow: type === 'book'
        },
        {
            name: 'کد پیگیری نسخه',
            component: (
                <span>
                    {prescription.trackingCode?.length > 0
                        ? prescription.trackingCode.join('-')
                        : '-'}
                </span>
            )
        },
        {
            name: 'کد توالی',
            component: <span>{prescription.sequenceNumber ?? '-'}</span>
        }
    ];

    const TurnDropDown = () => (
        <DropDown
            element={<DotsIcon color="#000" />}
            items={[
                {
                    id: 1,
                    icon: <TrashIcon />,
                    name: 'حذف نسخه',
                    action: () => setDeletePrescriptionModal(true),
                    diabled: prescription.finalized
                },
                {
                    id: 2,
                    icon: (
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.25 3.75331C13.0406 3.75062 12.7983 3.74997 12.5147 3.74997H11C9.56458 3.74997 8.56347 3.75156 7.80812 3.85312C7.07435 3.95177 6.68577 4.13222 6.40901 4.40898C6.13225 4.68574 5.9518 5.07432 5.85315 5.80809C5.75159 6.56344 5.75 7.56455 5.75 8.99997V15C5.75 16.4354 5.75159 17.4365 5.85315 18.1919C5.9518 18.9256 6.13225 19.3142 6.40901 19.591C6.68577 19.8677 7.07435 20.0482 7.80812 20.1468C8.56347 20.2484 9.56458 20.25 11 20.25H13C14.4354 20.25 15.4365 20.2484 16.1919 20.1468C16.9257 20.0482 17.3142 19.8677 17.591 19.591C17.8678 19.3142 18.0482 18.9256 18.1469 18.1919C18.2484 17.4365 18.25 16.4354 18.25 15V9.48525C18.25 9.20166 18.2494 8.95944 18.2467 8.75005H18L17.948 8.75006C17.0495 8.75008 16.3003 8.75011 15.7055 8.67014C15.0777 8.58574 14.5109 8.40007 14.0555 7.9446C13.6 7.48913 13.4143 6.92233 13.3299 6.29453C13.2499 5.69975 13.25 4.95053 13.25 4.05205L13.25 4.00006V3.75331ZM14.75 3.98285V4.00006C14.75 4.96407 14.7516 5.61163 14.8165 6.09466C14.8786 6.55612 14.9858 6.75362 15.1161 6.88394C15.2464 7.01425 15.4439 7.12148 15.9054 7.18352C16.3884 7.24846 17.036 7.25005 18 7.25005H18.0172C17.8431 6.9184 17.5168 6.57741 16.7123 5.77294L16.227 5.28766C15.4226 4.48326 15.0816 4.15692 14.75 3.98285ZM12.6573 2.24993C13.7451 2.24941 14.501 2.24905 15.1924 2.53542C15.8838 2.8218 16.4181 3.35659 17.1869 4.12613L17.2877 4.227L17.773 4.71228L17.8738 4.81308C18.6434 5.58189 19.1782 6.11617 19.4645 6.80755C19.7509 7.49892 19.7506 8.25487 19.75 9.34264V9.34265L19.75 9.48525V15V15.0548V15.0548V15.0549C19.75 16.4224 19.75 17.5248 19.6335 18.3917C19.5125 19.2918 19.2536 20.0497 18.6517 20.6516C18.0497 21.2535 17.2919 21.5124 16.3918 21.6334C15.5248 21.75 14.4225 21.75 13.0549 21.75H13H11H10.9451C9.57754 21.75 8.47522 21.75 7.60825 21.6334C6.70814 21.5124 5.95027 21.2535 5.34835 20.6516C4.74643 20.0497 4.48754 19.2918 4.36652 18.3917C4.24996 17.5248 4.24998 16.4224 4.25 15.0548V15V8.99997V8.9451C4.24998 7.57751 4.24996 6.47519 4.36652 5.60822C4.48754 4.70811 4.74643 3.95024 5.34835 3.34832C5.95027 2.7464 6.70814 2.48751 7.60825 2.36649C8.47522 2.24993 9.57754 2.24995 10.9451 2.24997L11 2.24997H12.5147L12.6573 2.24993ZM12 10.2501C12.4142 10.2501 12.75 10.5858 12.75 11.0001V15.1894L13.9697 13.9697C14.2626 13.6768 14.7374 13.6768 15.0303 13.9697C15.3232 14.2626 15.3232 14.7375 15.0303 15.0304L12.5303 17.5304C12.2374 17.8233 11.7626 17.8233 11.4697 17.5304L8.96967 15.0304C8.67678 14.7375 8.67678 14.2626 8.96967 13.9697C9.26256 13.6768 9.73744 13.6768 10.0303 13.9697L11.25 15.1894V11.0001C11.25 10.5858 11.5858 10.2501 12 10.2501Z"
                                fill="#22282F"
                            />
                        </svg>
                    ),
                    name: 'PDF نسخه',
                    action: () => window.open(pdfLink.current),
                    diabled: !prescription.finalized
                }
            ]}
        />
    );

    return (
        <>
            <Default>
                <tr className="font-medium text-gray-900 bg-white border-b border-solid border-b-gray-100">
                    {data.map((col, index) => (
                        <td key={index} className="px-6 py-3 align-middle">
                            {col.component}
                        </td>
                    ))}

                    <td className="px-6 py-3 pl-4 align-middle w-52 whitespace-nowrap">
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={1}
                        >
                            <VisitButton />
                            <PrescriptionButton />
                            <TurnDropDown />
                        </Stack>
                        <ReactTooltip />
                    </td>
                </tr>
                {isDetailsOpen && (
                    <tr className="border-b border-solid bg-gray-50 border-b-gray-100">
                        <td colSpan={6} className="px-6 py-3">
                            <div className="flex flex-wrap md:space-s-3">
                                {turnDetails
                                    .filter(col => col.isShow === undefined || col.isShow)
                                    .map((col, index) => (
                                        <div key={index}>
                                            {col.name}: {col.component}
                                        </div>
                                    ))}
                            </div>
                        </td>
                    </tr>
                )}
            </Default>
            <Mobile>
                <div className="flex flex-col w-full p-5 space-y-2 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="w-full font-bold">{data[0].component}</div>
                        <TurnDropDown />
                    </div>

                    {chunk(
                        data.filter((_, index) => index !== 0),
                        2
                    ).map((row, index) => (
                        <div key={index} className="flex items-center w-full">
                            {row.map(col => (
                                <div
                                    key={col.name}
                                    className="flex w-1/2 text-sm font-medium whitespace-nowrap space-s-1"
                                >
                                    <span>{col.name}</span>: {col.component}
                                </div>
                            ))}
                        </div>
                    ))}

                    {isDetailsOpen &&
                        chunk(
                            turnDetails.filter(col => col.isShow === undefined || col.isShow),
                            2
                        ).map((row, index) => (
                            <div key={index} className="flex items-center w-full">
                                {row.map(col => (
                                    <div
                                        key={col.name}
                                        className="flex w-1/2 text-sm font-medium whitespace-nowrap space-s-1"
                                    >
                                        <span>{col.name}</span>: {col.component}
                                    </div>
                                ))}
                            </div>
                        ))}

                    <div className="flex space-s-2">
                        <VisitButton />
                        <PrescriptionButton />
                    </div>
                </div>
            </Mobile>
            <Visit
                isOpen={visitModal}
                onClose={setVisitModal}
                provider={visitProvider()}
                prescriptionId={prescription.id ?? (addPrescription?.data as any)?.result?.id}
                bookId={id}
                refetchData={() => queryClient.refetchQueries('turns')}
            />
            <Modal
                title="آیا از حذف نسخه مطمئن می باشید؟"
                isOpen={deletePrescriptionModal}
                onClose={setDeletePrescriptionModal}
            >
                <Stack direction="row" spacing={1}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleDeletePrescription}
                        loading={deletePrescription.isLoading}
                    >
                        بله و حذف
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setDeletePrescriptionModal(false)}
                    >
                        انصراف
                    </Button>
                </Stack>
            </Modal>
            <Modal
                title="لطفا کدملی بیمار را وارد نمایید."
                isOpen={nationalCodeModal}
                onClose={setNationalCodeModal}
            >
                <TextField
                    label="کدملی"
                    onChange={e => {
                        setNationalCode(e.target.value);
                    }}
                />
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                        nationalCodeModal === 'prescription'
                            ? handleOpenPrescription()
                            : handleVisit();
                        setNationalCodeModal(false);
                    }}
                >
                    تایید
                </Button>
            </Modal>
            <Modal
                title="توضیحات درمان"
                isOpen={descriptionTreatmentModal}
                onClose={setDescriptionTreatmentModal}
            >
                <span className="text-sm leading-6">
                    پزشک گرامی لطفا در صورتی که برای بیمار نسخه الکترونیک ثبت کرده اید “کد پیگیری
                    نسخه” و در صورت نیاز “توضیحات درمان” خود را یادداشت نمایید.
                    <br /> (این متن برای بیمار پیامک خواهد شد و به منظور اتمام ویزیت می باشد.)
                </span>
                <TextField
                    multiline
                    minRows={7}
                    margin="normal"
                    placeholder="توضیحات خود را وارد کنید"
                    onChange={e => setDescriptionTreatment(e.target.value)}
                    className="[&>div>textarea]:!p-0 [&>div>textarea]:!text-sm [&>div>textarea]:placeholder:!text-sm [&>div>textarea]:placeholder:!text-black"
                />
                <Button
                    disabled={!descriptionTreatment.length}
                    fullWidth
                    variant="contained"
                    onClick={handleUpdateDescription}
                    loading={updateDescription.isLoading}
                >
                    ثبت
                </Button>
            </Modal>
        </>
    );
};

export default TurnRow;
