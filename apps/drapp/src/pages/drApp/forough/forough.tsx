import { Button, Chip, Skeleton } from '@mui/material';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { useSearchViewInfo } from 'apps/drapp/src/apis/forough/searchViewInfo';
import { round } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';
import { InfoIcon } from '@paziresh24/shared/icon';
import classNames from 'classnames';
import { useDrApp } from '@paziresh24/context/drapp';
import CONSULT_CENTER_ID from '@paziresh24/constants/consultCenterId';

type InfoOption = {
    id: number;
    title: string;
    selected: boolean;
    wating_time: number;
};

export const Forough = () => {
    const searchViewInfo = useSearchViewInfo();
    const [isLoading, setIsLoading] = useState(true);
    const [info] = useDrApp();
    const [data, setData] = useState<any>({});
    const router = useHistory();
    const [infoOptionDetails, SetInfoOptionDetails] = useState<InfoOption[]>([]);
    const activeOptionSelectedDetails =
        infoOptionDetails.find((center: InfoOption) => center?.selected) ?? null;

    useEffect(() => {
        if (searchViewInfo.isSuccess) {
            if (searchViewInfo.data?.data) {
                setIsLoading(false);
                setData(searchViewInfo.data?.data);
                SetInfoOptionDetails(
                    [
                        searchViewInfo.data?.data?.waiting_time_info && {
                            id: 1,
                            title: 'انتظار در مطب',
                            selected: true,
                            wating_time:
                                searchViewInfo.data?.data?.waiting_time_info?.waiting_time ?? 0
                        },
                        searchViewInfo.data?.data?.online_visit_waiting_time_info && {
                            id: 2,
                            title: 'انتظار برای ویزیت آنلاین',
                            selected: false,
                            wating_time:
                                searchViewInfo.data?.data?.online_visit_waiting_time_info
                                    ?.waiting_time ?? 0
                        },
                        searchViewInfo.data?.data?.prescription_waiting_time_info && {
                            id: 3,
                            title: 'انتظار برای نسخه',
                            selected: false,
                            wating_time:
                                searchViewInfo.data?.data?.prescription_waiting_time_info
                                    ?.average_waiting_time ?? 0
                        }
                    ].filter((details: any) => !!details)
                );
            } else {
                setTimeout(() => {
                    searchViewInfo.refetch();
                }, 5000);
            }
        }
    }, [searchViewInfo.status, searchViewInfo.data]);

    const waitingTimeText = useMemo(() => {
        const watingTimeAvarageTime = activeOptionSelectedDetails?.wating_time ?? 0;
        if (watingTimeAvarageTime < 0.5) return 'حداکثر نیم ساعت';
        if (watingTimeAvarageTime >= 0.5 && watingTimeAvarageTime < 1) return 'نیم تا 1 ساعت';
        if (watingTimeAvarageTime >= 1 && watingTimeAvarageTime < 2) return '1 تا 2 ساعت';
        if (watingTimeAvarageTime >= 2) return 'بیشتر از 2 ساعت';
    }, [infoOptionDetails]);

    const handleButtonClick = (id: number) => {
        SetInfoOptionDetails(prev =>
            prev.map(item => ({
                ...item,
                selected: item.id === id
            }))
        );
    };

    return (
        <div className="flex flex-col max-w-screen-sm p-5 mx-auto space-y-5">
            <span className="text-sm font-bold">
                آمار مهم شما در 30 روز گذشته به شرح زیر می باشد:
            </span>
            {isLoading ? (
                <Skeleton width="100%" height="16rem" className="!scale-100" />
            ) : (
                <div className="flex flex-col space-y-2">
                    <div className="flex -mb-2 justify-between md:justify-start">
                        {infoOptionDetails.map((item: any) => (
                            <Chip
                                key={item.id}
                                label={item.title}
                                onClick={() => handleButtonClick(item.id)}
                                className={classNames(
                                    '!rounded-t-md !rounded-b-none  [&>span]:!text-gray-500 [&>span]:!text-sm [&>span]:!font-medium !cursor-pointer',
                                    {
                                        '!bg-transparent': !item.selected,
                                        '!bg-primary [&>span]:!text-white': item.selected
                                    }
                                )}
                            />
                        ))}
                    </div>
                    <div
                        className={classNames(
                            'flex flex-col p-3 space-y-3 bg-white border border-solid rounded-lg border-stone-200',
                            {
                                '!rounded-b-lg !rounded-t-none !border-primary':
                                    !!infoOptionDetails.length
                            }
                        )}
                    >
                        <span className="text-sm font-medium leading-6">
                            میانگین زمان انتظار بیماران در مرکز درمانی شما
                        </span>
                        <div className="flex items-center justify-between space-s-2">
                            <ul className="space-y-2 text-xs text-slate-500">
                                <li className="before:content-['\2022'] before:text-[#8FBB13] before:font-bold before:text-4xl before:absolute relative before:-top-[0.5rem] before:right-0 pr-4">
                                    حداکثر نیم ساعت
                                </li>
                                <li className="before:content-['\2022'] before:text-[#F1DB18] before:font-bold before:text-4xl before:absolute relative before:-top-[0.5rem] before:right-0 pr-4">
                                    نیم تا 1 ساعت
                                </li>
                                <li className="before:content-['\2022'] before:text-[#FF8E01] before:font-bold before:text-4xl before:absolute relative before:-top-[0.5rem] before:right-0 pr-4">
                                    1 تا 2 ساعت
                                </li>
                                <li className="before:content-['\2022'] before:text-[#E82929] before:font-bold before:text-4xl before:absolute relative before:-top-[0.5rem] before:right-0 pr-4">
                                    بیشتر از 2 ساعت
                                </li>
                            </ul>
                            <div className="flex flex-col">
                                <GaugeChart
                                    animate={false}
                                    arcWidth={0.2}
                                    className="!w-56 !-ml-5"
                                    nrOfLevels={4}
                                    cornerRadius={3}
                                    arcPadding={0.03}
                                    percent={
                                        ((activeOptionSelectedDetails?.wating_time ?? 0) * 2) / 4
                                    }
                                    hideText={true}
                                    colors={['#8FBB13', '#F1DB18', '#FF8E01', '#E82929']}
                                />
                                <div className="py-2 mr-4 text-xs text-center rounded-md bg-slate-100">
                                    {waitingTimeText}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center p-2 rounded-md space-s-2 bg-slate-100">
                            <InfoIcon color="#0070f3" width={18} />
                            <span className="text-xs font-medium">
                                {(activeOptionSelectedDetails?.wating_time ?? 0) < 0.5 ? (
                                    <>
                                        <span className="font-semibold text-secondary">
                                            زمان انتظار بیمار در{' '}
                                            {activeOptionSelectedDetails?.id === 2
                                                ? 'ویزیت آنلاین'
                                                : 'مطب شما،'}{' '}
                                            در بازه خیلی خوب قرار دارد.
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        شما برای بهبود رتبه خود، نیاز به{' '}
                                        <span className="font-semibold text-secondary">
                                            کاهش زمان انتظار
                                        </span>{' '}
                                        دارید.
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white border border-solid rounded-lg border-slate-200 space-s-2">
                        <span className="text-sm font-medium leading-6">
                            تعداد بیمارانی که از پروفایل شما در پذیرش24 بازدید کردند.
                        </span>
                        <div className="flex items-center space-s-2">
                            <div className="h-8 border border-solid border-slate-200" />
                            <div className="h-12 min-w-[3rem] font-bold flex items-center justify-center bg-teal-50 rounded-lg shadow-lg text-primary">
                                {data?.page_view_statistics?.count ?? '-'}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white border border-solid rounded-lg border-slate-200 space-s-2">
                        <span className="text-sm font-medium leading-6">
                            میانگین جایگاه شما در لیست سرچ پذیرش24 نسبت به سایر پزشکان گروه تخصصی
                            شما
                        </span>
                        <div className="flex items-center space-s-2">
                            <div className="h-8 border border-solid border-slate-200" />
                            <div className="h-12 min-w-[3rem] font-bold flex items-center justify-center bg-teal-50 rounded-lg shadow-lg text-primary">
                                {data?.search_click_details?.acp
                                    ? round(+data?.search_click_details?.acp, 1)
                                    : '-'}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white border border-solid rounded-lg border-slate-200 space-s-2">
                        <span className="text-sm font-medium leading-6">
                            تعداد بیمارانی که از مسیر سرچ در پذیرش۲۴ روی نام شما کلیک کرده اند.
                        </span>
                        <div className="flex items-center space-s-2">
                            <div className="h-8 border border-solid border-slate-200" />
                            <div className="h-12 min-w-[3rem] font-bold flex items-center justify-center bg-teal-50 rounded-lg shadow-lg text-primary">
                                {data?.search_click_details?.count ?? '-'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full border border-solid border-slate-200" />

            <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium leading-6 text-justify">
                    شما میتوانید برای بهبود نتایج خود در قسمت سرچ و پروفایل پذیرش۲۴، روی{' '}
                    <span className="text-secondary">دکمه</span> زیر کلیک کنید.
                </span>
                <span className="!mb-2 text-sm font-medium leading-6 text-justify">
                    بهبود رتبه، منجر به افزایش تعداد بیمار و مراجعین شما خواهد شد.
                </span>
                <Button
                    color="success"
                    variant="contained"
                    onClick={() => {
                        router.push('/forough/improve');
                        getSplunkInstance().sendEvent({
                            group: 'forough',
                            type: 'increase'
                        });
                    }}
                >
                    بهبود رتبه من
                </Button>
            </div>
        </div>
    );
};

export default Forough;
