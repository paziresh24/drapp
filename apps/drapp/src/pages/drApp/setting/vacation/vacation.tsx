/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/lab/LoadingButton';
import TimeInput from '@paziresh24/shared/ui/timeInput';
import DateInput from '@paziresh24/shared/ui/dateInput';
import { useEffect, useState } from 'react';
import {
    useDeleteTurns,
    useMoveTurns,
    useVacation,
    useGetVacation,
    useDeleteVacation,
    useChangeVacation
} from '@paziresh24/hooks/drapp/turning';
import moment from 'jalali-moment';
import { useDrApp } from '@paziresh24/context/drapp';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from '@paziresh24/shared/ui/modal';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { Calendar, DayValue, utils } from '@hassanmojab/react-modern-calendar-datepicker';
import { formattedDateToDateObject } from '@paziresh24/shared/ui/dateInput/dateInput';
import { dateObjectToFormattedDate } from '@paziresh24/shared/ui/dateInput/dateInput';
import monthData from '@paziresh24/constants/month.json';
import VacationCard from 'apps/drapp/src/components/vacationCard/vacationCard';
import { EditIcon, TrashIcon } from '@paziresh24/shared/icon';
import { isMobile } from 'react-device-detect';
import { convertTimestampToDate } from '@paziresh24/shared/utils/convertTimestampToDate';
import { convertTimeStampToFormattedTime } from '@paziresh24/shared/utils';
import { Checkbox, MenuItem, Select, Skeleton } from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import getFirstAndLastMonthDay from 'apps/drapp/src/functions/getFirstAndLastMonthDay';
import { VacationToggle } from './toggle';
import { useFeatureValue } from '@growthbook/growthbook-react';

type VacationDate = {
    from: DayValue | any;
    to: DayValue | any;
};

export const Vacation = () => {
    const [{ center }] = useDrApp();
    const [isFullDayVacation, setIsFullDayVacation] = useState<boolean>(false);
    const [fromTime, setFromTime] = useState<string>();
    const [toTime, setToTime] = useState<string>();
    const [targetMoveDate, setTargetMoveDate] = useState<string>();
    const [targetMoveTime, setTargetMoveTime] = useState<string>();
    const [vacationModal, setVacationModal] = useState<boolean>(false);
    const [shouldShowconfilitModal, setShouldShowconfilitModal] = useState<boolean>(false);
    const [shouldShowDeleteVacationModal, setShouldShowDeleteVacationModal] =
        useState<boolean>(false);
    const [selectedDay, setSelectedDay] = useState<VacationDate>({
        from: null,
        to: null
    });
    const [vacationInfoForDelete, setVacationInfoForDelete] = useState<VacationDate>({
        from: null,
        to: null
    });
    const [monthInfo, setMonthInfo] = useState<VacationDate>({
        from: null,
        to: null
    });
    const [shouldShowGetTargetMoveModal, setShouldShowGetTargetMoveModal] =
        useState<boolean>(false);
    const [currentVacationDate, setCurrentVacationData] = useState<any>({});
    const [selectedMonth, setSelectedMonth] = useState<any>(
        monthData.find((month: any) => month.monthNum === moment().jMonth() + 1)?.persian_name
    );
    const [selectedYear, setSelectedYear] = useState<any>(moment().locale('fa').year());

    useEffect(() => {
        const currentMonthInfo = getFirstAndLastMonthDay(selectedYear, moment().jMonth() + 1);
        setMonthInfo({
            from: currentMonthInfo.firstDayOfMonth,
            to: currentMonthInfo.lastDayOfMonth
        });
    }, []);

    const vacationRequest = useVacation();
    const deleteTurnsRequest = useDeleteTurns();
    const moveTurnsRequest = useMoveTurns();
    const getVacation = useGetVacation({
        center_id: center.id,
        filter: {
            from: monthInfo.from,
            to: monthInfo.to
        }
    });
    const deleteVacation = useDeleteVacation();
    const changeVacationDate = useChangeVacation();
    const changeTurInfoBox = useFeatureValue<any>('vacation:change-turn-modal', {});
    const isDisableSubmitButton =
        !isFullDayVacation &&
        (!selectedDay.from || !fromTime || !toTime) &&
        isEmpty(currentVacationDate);

    const closeVacationModal = () => {
        setVacationModal(false);
        setSelectedDay({
            from: null,
            to: null
        });
        setFromTime('');
        setToTime('');
        setCurrentVacationData(null);
        setIsFullDayVacation(false);
    };

    const convertDateAndTimeToTimeStamp = (date: DayValue, time: string) => {
        return moment
            .from(`${dateObjectToFormattedDate(date)} ${time}`, 'fa', 'JYYYY/JMM/JDD HH:mm')
            .unix();
    };

    const handleSubmit = () => {
        vacationRequest.mutate(
            {
                centerId: center.id,
                data: {
                    from: convertDateAndTimeToTimeStamp(
                        selectedDay.from,
                        isFullDayVacation ? '00:00' : fromTime!
                    ),
                    to: convertDateAndTimeToTimeStamp(
                        selectedDay.to ?? selectedDay.from,
                        isFullDayVacation ? '23:59' : toTime!
                    )
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
                    getVacation.refetch();
                    closeVacationModal();
                    getSplunkInstance().sendEvent({
                        group: 'vacation',
                        type: 'submit-vacation',
                        event: {
                            centerId: center.id,
                            from: convertDateAndTimeToTimeStamp(
                                selectedDay.from,
                                isFullDayVacation ? '00:00' : fromTime!
                            ),
                            to: convertDateAndTimeToTimeStamp(
                                selectedDay.to ?? selectedDay.from,
                                isFullDayVacation ? '23:59' : toTime!
                            )
                        }
                    });
                }
            }
        );
    };

    const deleteTurns = () => {
        deleteTurnsRequest.mutate(
            {
                centerId: center.id,
                data: {
                    from: convertDateAndTimeToTimeStamp(
                        selectedDay.from,
                        isFullDayVacation ? '00:00' : fromTime!
                    ),
                    to: convertDateAndTimeToTimeStamp(
                        selectedDay.to ?? selectedDay.from,
                        isFullDayVacation ? '23:59' : toTime!
                    )
                }
            },
            {
                onSuccess: () => {
                    toast.success('مرخصی شما ثبت شد.');
                    setShouldShowconfilitModal(false);
                    getVacation.refetch();
                    closeVacationModal();
                    getSplunkInstance().sendEvent({
                        group: 'vacation',
                        type: 'submit-vacation',
                        event: {
                            centerId: center.id,
                            from: convertDateAndTimeToTimeStamp(
                                selectedDay.from,
                                isFullDayVacation ? '00:00' : fromTime!
                            ),
                            to: convertDateAndTimeToTimeStamp(
                                selectedDay.to ?? selectedDay.from,
                                isFullDayVacation ? '23:59' : toTime!
                            )
                        }
                    });
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
                    book_from: convertDateAndTimeToTimeStamp(
                        selectedDay.from,
                        isFullDayVacation ? '00:00' : fromTime!
                    ),
                    book_to: convertDateAndTimeToTimeStamp(
                        selectedDay.to ?? selectedDay.from,
                        isFullDayVacation ? '23:59' : toTime!
                    ),
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
                    closeVacationModal();
                    getVacation.refetch();
                    getSplunkInstance().sendEvent({
                        group: 'vacation',
                        type: 'submit-vacation',
                        event: {
                            centerId: center.id,
                            from: convertDateAndTimeToTimeStamp(
                                selectedDay.from,
                                isFullDayVacation ? '00:00' : fromTime!
                            ),
                            to: convertDateAndTimeToTimeStamp(
                                selectedDay.to ?? selectedDay.from,
                                isFullDayVacation ? '23:59' : toTime!
                            )
                        }
                    });
                },
                onError: err => {
                    if (axios.isAxiosError(err)) {
                        toast.error(err?.response?.data?.message);
                    }
                }
            }
        );
    };

    const deleteVacationHandler = (from: number, to: number) => {
        deleteVacation.mutate(
            {
                center_id: center.id,
                from,
                to
            },
            {
                onSuccess: () => {
                    toast.success('مرخصی شما حذف شد.');
                    getVacation.refetch();
                    setShouldShowDeleteVacationModal(false);
                    getSplunkInstance().sendEvent({
                        group: 'vacation',
                        type: 'remove-vacation',
                        event: {
                            centerId: center.id,
                            from,
                            to
                        }
                    });
                    getVacation.refetch();
                },
                onError: err => {
                    if (axios.isAxiosError(err)) {
                        toast.error(err?.response?.data?.message);
                    }
                }
            }
        );
    };

    const changeVacationDateHandler = () => {
        changeVacationDate.mutate(
            {
                center_id: center.id,
                from: convertDateAndTimeToTimeStamp(
                    selectedDay.from,
                    isFullDayVacation ? '00:00' : fromTime!
                ),
                to: convertDateAndTimeToTimeStamp(
                    selectedDay.to ?? selectedDay.from,
                    isFullDayVacation ? '23:59' : toTime!
                ),
                old_from: convertDateAndTimeToTimeStamp(
                    currentVacationDate.date.from,
                    currentVacationDate.time.from!
                ),
                old_to: convertDateAndTimeToTimeStamp(
                    currentVacationDate.date.to,
                    currentVacationDate.time.to!
                )
            },
            {
                onSuccess: () => {
                    toast.success('تغییرات شما با موفقیت اعمال شد.');
                    getVacation.refetch();
                    getSplunkInstance().sendEvent({
                        group: 'vacation',
                        type: 'change-vacation',
                        event: {
                            centerId: center.id,
                            from: convertDateAndTimeToTimeStamp(
                                selectedDay.from,
                                isFullDayVacation ? '00:00' : fromTime!
                            ),
                            to: convertDateAndTimeToTimeStamp(
                                selectedDay.to ?? selectedDay.from,
                                isFullDayVacation ? '23:59' : toTime!
                            ),
                            old_from: convertDateAndTimeToTimeStamp(
                                currentVacationDate.date.from,
                                currentVacationDate.time.from!
                            ),
                            old_to: convertDateAndTimeToTimeStamp(
                                currentVacationDate.date.to,
                                currentVacationDate.time.to!
                            )
                        }
                    });
                    closeVacationModal();
                },
                onError: err => {
                    if (axios.isAxiosError(err)) {
                        toast.error(err?.response?.data?.message);
                    }
                }
            }
        );
    };

    const filterVacationAccordingToMonth = (monthName: string) => {
        setSelectedMonth(monthName);
        const monthNumber = monthData.find(
            (month: any) => month.persian_name === monthName
        )?.monthNum;
        const getMonthTimestamp = getFirstAndLastMonthDay(selectedYear, monthNumber!);
        setMonthInfo({
            from: getMonthTimestamp.firstDayOfMonth,
            to: getMonthTimestamp.lastDayOfMonth
        });
    };

    const filterVacationAccordingToYear = (year: string) => {
        setSelectedYear(year);
        const monthNumber = monthData.find(
            (month: any) => month.persian_name === selectedMonth
        )?.monthNum;
        const getMonthTimestamp = getFirstAndLastMonthDay(+year, monthNumber!);
        setMonthInfo({
            from: getMonthTimestamp.firstDayOfMonth,
            to: getMonthTimestamp.lastDayOfMonth
        });
    };

    const openEditVacationModal = (from: string, to: string) => {
        const currentVacationInfo = {
            time: {
                from: convertTimeStampToFormattedTime(+from),
                to: convertTimeStampToFormattedTime(+to)
            },
            date: {
                from: formattedDateToDateObject(
                    moment
                        .from(convertTimestampToDate(+from), 'YYYY/MM/DD')
                        .locale('fa')
                        .format('YYYY/MM/DD')
                ),
                to: formattedDateToDateObject(
                    moment
                        .from(convertTimestampToDate(+to), 'YYYY/MM/DD')
                        .locale('fa')
                        .format('YYYY/MM/DD')
                )
            }
        };
        setCurrentVacationData(currentVacationInfo);
        setSelectedDay(currentVacationInfo.date);
        setFromTime(currentVacationInfo.time.from);
        setToTime(currentVacationInfo.time.to);
        setVacationModal(true);
    };

    const isExpireVacation = (vacationTime: string) => {
        return +vacationTime < Math.floor(Date.now() / 1000);
    };

    return (
        <>
            <Container
                maxWidth="sm"
                className="min-h-full pb-4 space-y-5 bg-white rounded-md md:min-h-max md:h-auto md:p-5 md:mt-8 md:shadow-md"
            >
                <Stack spacing={1} width="100%">
                    <Alert
                        icon={false}
                        className="!bg-white [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div]:!p-0 !p-0 mt-4 md:mt-0 [&>div]:!w-full"
                    >
                        <Typography fontSize="0.9rem" fontWeight="bold">
                            ثبت مرخصی
                        </Typography>
                        <Typography fontSize="0.8rem" lineHeight={2} fontWeight="small">
                            شما می توانید برای ساعاتی که طبق ساعت کاری خود حضور ندارید، مرخصی اعمال
                            کنید.
                        </Typography>
                        <Button
                            loading={vacationRequest.isLoading}
                            onClick={() => setVacationModal(true)}
                            fullWidth
                            variant="outlined"
                            className="w-2/4 !text-[0.8rem]"
                        >
                            اضافه کردن مرخصی
                        </Button>
                    </Alert>
                </Stack>
                <Stack
                    alignItems={isMobile ? 'center' : 'start'}
                    flexDirection={{ sm: 'column', md: 'row', lg: 'row' }}
                >
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[0.9rem] font-medium">
                                لیست مرخصی های ثبت شده:
                            </span>
                            <div className="flex items-center w-2/5 space-s-2">
                                <Select
                                    className="!w-[40%]"
                                    variant="standard"
                                    label="جستجو"
                                    value={selectedYear}
                                    onChange={(e: any) =>
                                        filterVacationAccordingToYear(e.target.value)
                                    }
                                    inputProps={{ placeholder: 'فیلتر بر حسب تاریخ' }}
                                >
                                    {[
                                        moment().locale('fa').year() - 1,
                                        moment().locale('fa').year(),
                                        moment().locale('fa').year() + 1
                                    ].map((year: any) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    className="!w-[60%]"
                                    variant="standard"
                                    label="جستجو"
                                    value={selectedMonth}
                                    onChange={(e: any) =>
                                        filterVacationAccordingToMonth(e.target.value)
                                    }
                                    inputProps={{ placeholder: 'فیلتر بر حسب تاریخ' }}
                                >
                                    {monthData.map((month: any) => (
                                        <MenuItem key={month.monthNum} value={month.persian_name}>
                                            {month.persian_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        {!getVacation.isRefetching && getVacation.isSuccess && (
                            <div className="h-auto md:h-[21rem] overflow-auto flex flex-col gap-2">
                                {getVacation?.data?.data.map((vacationInfo: any, index: number) => (
                                    <>
                                        <VacationCard
                                            key={index}
                                            title={`${vacationInfo.formatted_from} الی ${vacationInfo.formatted_to}`}
                                            detailes={{
                                                'مدت زمان': vacationInfo.formatted_duration
                                            }}
                                            icon={
                                                !isExpireVacation(vacationInfo.to) && (
                                                    <div className="flex flex-col items-center gap-4">
                                                        <EditIcon
                                                            className="cursor-pointer w-5 h-[1.1rem] text-[#000000]"
                                                            onClick={() =>
                                                                openEditVacationModal(
                                                                    vacationInfo.from,
                                                                    vacationInfo.to
                                                                )
                                                            }
                                                        />
                                                        <TrashIcon
                                                            color="#000"
                                                            className="cursor-pointer w-5 hover:!text-red-500"
                                                            onClick={() => {
                                                                setVacationInfoForDelete({
                                                                    from: vacationInfo.from,
                                                                    to: vacationInfo.to
                                                                });
                                                                setShouldShowDeleteVacationModal(
                                                                    true
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            }
                                        />
                                    </>
                                ))}
                                {!getVacation.data?.data.length && (
                                    <div className="w-full h-[25rem] md:min-h-[20rem] lg:h-80 flex justify-center items-center rounded-md border border-solid border-[#aeaeae]">
                                        <span className="text-[0.8rem] font-medium">
                                            مرخصی وجود ندارد
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                        {(getVacation.isLoading || getVacation.isRefetching) && (
                            <Skeleton width="100%" height="20rem" className="!scale-100" />
                        )}
                    </div>
                </Stack>
            </Container>
            <Modal
                title="مرخصی"
                isOpen={shouldShowconfilitModal}
                onClose={setShouldShowconfilitModal}
            >
                <span>
                    در این بازه
                    <b className="mr-1">
                        {vacationRequest.isError &&
                            (vacationRequest.error as any)?.response?.data?.data?.books_count}{' '}
                    </b>
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
                {changeTurInfoBox.isShowBox && (
                    <Alert icon={false} className="!bg-amber-100">
                        <Typography fontSize="0.8rem" fontWeight="medium">
                            {changeTurInfoBox?.text ?? ''}
                        </Typography>
                    </Alert>
                )}
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
            <Modal
                title="حذف مرخصی"
                isOpen={shouldShowDeleteVacationModal}
                onClose={setShouldShowDeleteVacationModal}
            >
                <span className="text-sm">آیا از حذف مرخصی خود اطمینان دارید؟</span>
                <div className="flex justify-between gap-2 mt-4">
                    <Button
                        fullWidth
                        variant="outlined"
                        loading={deleteVacation.isLoading}
                        color="error"
                        onClick={() =>
                            deleteVacationHandler(
                                vacationInfoForDelete.from,
                                vacationInfoForDelete.to
                            )
                        }
                    >
                        حذف مرخصی
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setShouldShowGetTargetMoveModal(true)}
                    >
                        انصراف
                    </Button>
                </div>
            </Modal>
            <Modal title="ثبت مرخصی" isOpen={vacationModal} onClose={closeVacationModal}>
                <div className="flex flex-col items-center w-full">
                    <Calendar
                        value={selectedDay}
                        onChange={setSelectedDay}
                        shouldHighlightWeekends
                        minimumDate={utils('fa').getToday()}
                        colorPrimary="#0070f3"
                        locale="fa"
                        calendarRangeStartClassName="!rounded-md"
                        calendarRangeEndClassName="!rounded-md"
                        calendarRangeBetweenClassName="!rounded-md"
                        calendarClassName="!shadow-none !py-0 !bg-transparent"
                    />
                    {(!!selectedDay.from || !isEmpty(currentVacationDate)) && (
                        <>
                            {!isFullDayVacation && (
                                <div className="flex gap-2 -translate-y-3">
                                    <TimeInput
                                        label="از ساعت"
                                        defaultValue={fromTime}
                                        onCahnge={value => setFromTime(value)}
                                    />
                                    <TimeInput
                                        label="تا ساعت"
                                        defaultValue={toTime}
                                        onCahnge={value => setToTime(value)}
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-start w-full">
                                <Checkbox
                                    size="small"
                                    onChange={e => setIsFullDayVacation(e.target.checked)}
                                />
                                <span className="text-[0.8rem]">ثبت مرخصی برای تمام روز</span>
                            </div>
                        </>
                    )}
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={
                            !isEmpty(currentVacationDate) ? changeVacationDateHandler : handleSubmit
                        }
                        loading={vacationRequest.isLoading || changeVacationDate.isLoading}
                        disabled={isDisableSubmitButton}
                    >
                        ثبت مرخصی
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default Vacation;
