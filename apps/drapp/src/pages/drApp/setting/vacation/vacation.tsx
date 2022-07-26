import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/lab/LoadingButton';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import TimeInput from '@paziresh24/shared/ui/timeInput';
import DateInput from '@paziresh24/shared/ui/dateInput';
import { useState } from 'react';
import { useDeleteTurns, useMoveTurns, useVacation } from '@paziresh24/hooks/drapp/turning';
import moment from 'jalali-moment';
import { useDrApp } from '@paziresh24/context/drapp';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from '@paziresh24/shared/ui/modal';
import { useHistory } from 'react-router-dom';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

export const Vacation = () => {
    const [{ center }] = useDrApp();
    const router = useHistory();
    const [fromDate, setFromDate] = useState<string>();
    const [toDate, setToDate] = useState<string>();
    const [targetMoveDate, setTargetMoveDate] = useState<string>();
    const [fromTime, setFromTime] = useState<string>();
    const [toTime, setToTime] = useState<string>();
    const [targetMoveTime, setTargetMoveTime] = useState<string>();

    const [shouldShowconfilitModal, setShouldShowconfilitModal] = useState<boolean>(false);
    const [shouldShowGetTargetMoveModal, setShouldShowGetTargetMoveModal] =
        useState<boolean>(false);

    const vacationRequest = useVacation();
    const deleteTurnsRequest = useDeleteTurns();
    const moveTurnsRequest = useMoveTurns();

    const handleSubmit = () => {
        getSplunkInstance().sendEvent({
            group: 'setting',
            type: 'vacation'
        });
        vacationRequest.mutate(
            {
                centerId: center.id,
                data: {
                    from: moment
                        .from(`${fromDate} ${fromTime}`, 'fa', 'JYYYY/JMM/JDD HH:mm')
                        .unix(),
                    to: moment.from(`${toDate} ${toTime}`, 'fa', 'JYYYY/JMM/JDD HH:mm').unix()
                }
            },
            {
                onError: err => {
                    if (axios.isAxiosError(err)) {
                        if (err?.response?.data?.status === 'BOOK_CONFLICT') {
                            return setShouldShowconfilitModal(true);
                        }
                        toast.error(err?.response?.data?.message);
                    }
                },
                onSuccess: () => {
                    toast.success('مرخصی شما ثبت شد.');
                    router.push('/setting');
                }
            }
        );
    };

    const deleteTurns = () => {
        deleteTurnsRequest.mutate(
            {
                centerId: center.id,
                data: {
                    from: moment
                        .from(`${fromDate} ${fromTime}`, 'fa', 'JYYYY/JMM/JDD HH:mm')
                        .unix(),
                    to: moment.from(`${toDate} ${toTime}`, 'fa', 'JYYYY/JMM/JDD HH:mm').unix()
                }
            },
            {
                onSuccess: () => {
                    toast.success('مرخصی شما ثبت شد.');
                    setShouldShowconfilitModal(false);
                    router.push('/setting');
                },
                onError: err => {
                    if (axios.isAxiosError(err)) {
                        toast.error(err?.response?.data?.message);
                    }
                }
            }
        );
    };

    const moveTurns = () => {
        moveTurnsRequest.mutate(
            {
                centerId: center.id,
                data: {
                    book_from: moment
                        .from(`${fromDate} ${fromTime}`, 'fa', 'JYYYY/JMM/JDD HH:mm')
                        .unix(),
                    book_to: moment.from(`${toDate} ${toTime}`, 'fa', 'JYYYY/JMM/JDD HH:mm').unix(),
                    target_from: moment
                        .from(`${targetMoveDate} ${targetMoveTime}`, 'fa', 'JYYYY/JMM/JDD HH:mm')
                        .unix(),
                    confirmed: true
                }
            },
            {
                onSuccess: () => {
                    toast.success('مرخصی شما ثبت شد.');
                    setShouldShowconfilitModal(false);
                    setShouldShowGetTargetMoveModal(false);
                    router.push('/setting');
                },
                onError: err => {
                    if (axios.isAxiosError(err)) {
                        toast.error(err?.response?.data?.message);
                    }
                }
            }
        );
    };

    return (
        <>
            <Container
                maxWidth="sm"
                className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-md space-y-5"
            >
                <Stack>
                    <p className="mb-5 font-bold">ﺑﺎ اﻧﺘﺨﺎب بازه مدنظر، مرخصی اعمال می شود.</p>
                    <span className="text-sm font-medium">از</span>
                    <Stack mt={2} mb={2} direction="row" spacing={2}>
                        <DateInput label="تاریخ" onCahnge={value => setFromDate(value)} />
                        <TimeInput label="ساعت" onCahnge={value => setFromTime(value)} />
                    </Stack>
                    <span className="text-sm font-medium">تا</span>
                    <Stack mt={2} mb={2} direction="row" spacing={2}>
                        <DateInput label="تاریخ" onCahnge={value => setToDate(value)} />
                        <TimeInput label="ساعت" onCahnge={value => setToTime(value)} />
                    </Stack>
                    <span className="text-sm font-medium">مرخصی اعمال شود.</span>
                </Stack>
                <FixedWrapBottom className="border-t border-solid border-[#e8ecf0]">
                    <Stack spacing={1} width="100%">
                        <Alert icon={false} className="!bg-[#F3F6F9]">
                            <Typography fontSize="0.9rem" fontWeight="medium">
                                درصورتی که در این بازه نوبتی وجود داشته باشد، می توانید آن را حذف یا
                                جابجا کنید.
                            </Typography>
                        </Alert>
                        <Button
                            loading={vacationRequest.isLoading}
                            onClick={handleSubmit}
                            fullWidth
                            variant="contained"
                            disabled={!fromDate || !fromTime || !toDate || !toTime}
                        >
                            ثبت
                        </Button>
                    </Stack>
                </FixedWrapBottom>
            </Container>
            <Modal
                title="مرخصی"
                isOpen={shouldShowconfilitModal}
                onClose={setShouldShowconfilitModal}
            >
                <span>
                    در این بازه{' '}
                    {vacationRequest.isError &&
                        (vacationRequest.error as any)?.response?.data?.data?.books_count}{' '}
                    نوبت وجود دارد، چگونه آنها را مدیریت می کنید؟
                </span>
                <Alert icon={false} className="!bg-[#F3F6F9]">
                    <Typography fontSize="0.9rem" fontWeight="medium">
                        درﻧﻈﺮ داﺷﺘﻪ ﺑﺎﺷﯿﺪ ﮐﻪ ﭘﺲ از ﺣﺬف یا جابجایی نوبت ﺑﺮای ﺑﯿﻤﺎران ﭘﯿﺎﻣﮏ ارﺳﺎل ﻣﯽ
                        ﺷﻮد.
                    </Typography>
                </Alert>
                <Stack direction="row" spacing={2}>
                    <Button
                        fullWidth
                        variant="outlined"
                        loading={deleteTurnsRequest.isLoading}
                        onClick={deleteTurns}
                    >
                        حذف نوبت
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setShouldShowGetTargetMoveModal(true)}
                    >
                        جابجا کردن نوبت
                    </Button>
                </Stack>
            </Modal>
            <Modal
                title="جابجایی نوبت"
                isOpen={shouldShowGetTargetMoveModal}
                onClose={setShouldShowGetTargetMoveModal}
            >
                <span className="text-sm font-medium">نوبت ها به</span>
                <Stack direction="row" spacing={2}>
                    <DateInput label="تاریخ" onCahnge={value => setTargetMoveDate(value)} />
                    <TimeInput label="ساعت" onCahnge={value => setTargetMoveTime(value)} />
                </Stack>
                <span className="text-sm font-medium">منتقل شود.</span>
                <Button
                    fullWidth
                    variant="contained"
                    loading={moveTurnsRequest.isLoading}
                    onClick={moveTurns}
                    disabled={!targetMoveDate || !targetMoveTime}
                >
                    تایید
                </Button>
            </Modal>
        </>
    );
};

export default Vacation;
