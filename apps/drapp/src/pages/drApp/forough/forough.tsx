import { Button, Chip, Skeleton } from '@mui/material';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { useSearchViewInfo } from 'apps/drapp/src/apis/forough/searchViewInfo';
import  round  from 'lodash/round';
import mean from 'lodash/mean'
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';
import { InfoIcon } from '@paziresh24/shared/icon';
import classNames from 'classnames';
import { useDrApp } from '@paziresh24/context/drapp';
import CONSULT_CENTER_ID from '@paziresh24/constants/consultCenterId';
import { useGetDeletedTurnsCount } from 'apps/drapp/src/apis/forough/deletedTurnsCount';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { useAverageWaitingTime } from 'apps/drapp/src/apis/forough/averageWaitingTime';
import moment from 'jalali-moment';

type InfoOption = {
    id: number;
    title: string;
    selected: boolean;
    wating_time: number;
    type: string;
    service: string;
};

export const Forough = () => {
    const searchViewInfo = useSearchViewInfo();
    const [isLoading, setIsLoading] = useState(true);
    const [dateInfo, setDateInfo] = useState({
        today:moment(),
        last_week: moment().subtract(7, 'days'),
        last_month: moment().subtract(30, 'days')
    });
    const [info] = useDrApp();
    const [data, setData] = useState<any>({});
    const router = useHistory();
    const [infoOptionDetails, setInfoOptionDetails] = useState<InfoOption[]>([]);
    const itemTitleList = useFeatureValue<any>('forough:item-title-list', {})
    const shouldShowDeletedTurnsCount = useFeatureIsOn('forough:show-deleted-book|doctor-list')
    const isActiveOnlineVisitCenter = info?.center?.id ===CONSULT_CENTER_ID ?? false
    const deletedTurn = useGetDeletedTurnsCount({user_center_id:info?.center?.user_center_id, from_greather_than:dateInfo.last_month.unix(), from_less_than:dateInfo.today.unix(), payment_status_in:4},  { enabled:isActiveOnlineVisitCenter && shouldShowDeletedTurnsCount})    
    const rolloutDoctor = useFeatureValue<any>('forough:average-waiting-time-api|doctor-list', {ids:['']})
    const isRolloutDoctor = rolloutDoctor?.ids?.includes?.(+info.doctor?.user_id)
    const averageWaitingTime = useAverageWaitingTime({slug:info.doctor.slug,  start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD')},{
        enabled: isRolloutDoctor
    })
    const onlineVisitWaitingTime = isRolloutDoctor ? averageWaitingTime?.data?.data?.result?.find?.((item:any) => item.center_id === '5532')?.waiting_time : data?.online_visit_waiting_time_info?.waiting_time;
    const presenseWaitingTime =isRolloutDoctor? mean(averageWaitingTime?.data?.data?.result?.filter((item:any) => item.center_id !=='5532')?.map((item:any) => item?.waiting_time)) : data?.waiting_time_info?.waiting_time
    
    const activeOptionSelectedDetails =
        infoOptionDetails.find((center: InfoOption) => center?.selected) ?? null;

    const promptSentences: Record<string, string> = {
        presence:
            "شما برای بهبود رتبه خود، نیاز به <span class='font-semibold text-secondary'>کاهش زمان انتظار</span> دارید.",
        online_visit:
            "شما برای بهبود رتبه خود، نیاز به <span class='font-semibold text-secondary'>کاهش زمان انتظار</span> دارید.",
        prescription:
            "بهبود رتبه شما، وابسته به کاهش زمان انتظار بیمار در <span class='font-semibold text-secondary'>دریافت نسخه</span> می باشد."
    };

    useEffect(() => {
        if (searchViewInfo.isSuccess) {
            if (shouldShowDeletedTurnsCount ? searchViewInfo.data?.data && deletedTurn.data?.data :searchViewInfo.data?.data ) {
                setIsLoading(false);
                setData(searchViewInfo.data?.data);
                !!data &&
                    setInfoOptionDetails(
                        [
                            data?.waiting_time_info && {
                                id: 1,
                                title: 'انتظار در مطب',
                                selected: !!data?.waiting_time_info,
                                service: 'مطب',
                                type: 'presence',
                                wating_time: presenseWaitingTime?? 0
                            },
                            data?.online_visit_waiting_time_info && {
                                id: 2,
                                title: 'انتظار برای ویزیت آنلاین',
                                selected:
                                    !data?.waiting_time_info &&
                                    !!data?.online_visit_waiting_time_info,
                                service: 'ویزیت آنلاین',
                                type: 'online_visit',
                                wating_time:onlineVisitWaitingTime ?? 0
                            },
                            data?.prescription_waiting_time_info && {
                                id: 3,
                                title: 'انتظار برای نسخه',
                                selected:
                                    !data?.online_visit_waiting_time_info &&
                                    !data?.waiting_time_info &&
                                    !!data.prescription_waiting_time_info,
                                service: 'نسخه نویسی',
                                type: 'prescription',
                                wating_time:
                                    data?.prescription_waiting_time_info?.average_waiting_time ?? 0
                            }
                        ].filter((details: any) => !!details)
                    );
            } else {
                setTimeout(() => {
                    searchViewInfo.refetch();
                }, 5000);
            }
        }
    }, [searchViewInfo.status, data, averageWaitingTime.status,onlineVisitWaitingTime,deletedTurn.data?.data]);


    const waitingTimeText = useMemo(() => {
        const watingTimeAvarageTime = activeOptionSelectedDetails?.wating_time ?? 0;
        if (watingTimeAvarageTime < 0.5) return 'حداکثر نیم ساعت';
        if (watingTimeAvarageTime >= 0.5 && watingTimeAvarageTime < 1) return 'نیم تا 1 ساعت';
        if (watingTimeAvarageTime >= 1 && watingTimeAvarageTime < 2) return '1 تا 2 ساعت';
        if (watingTimeAvarageTime >= 2) return 'بیشتر از 2 ساعت';
    }, [infoOptionDetails]);

    const handleButtonClick = (id: number) => {
        setInfoOptionDetails(prev =>
            prev.map(item => ({
                ...item,
                selected: item.id === id
            }))
        );
        getSplunkInstance().sendEvent({
            group: 'forogh',
            type: `waiting-time-${infoOptionDetails.find((item: any) => item.id === id)?.type}`,
            event: {
                event_action: 'click'
            }
        });
    };

    return (
        <div className="flex flex-col max-w-screen-sm p-5 mx-auto space-y-5">
            <span className="text-sm font-bold">امار مهم شما به شرح زیر می باشد:‌</span>
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
                                    '!rounded-t-md !rounded-b-none [&>span]:!whitespace-normal [&>span]:!text-center [&>span]:!text-gray-500 [&>span]:!m-1 [&>span]:!p-0 [&>span]:md:!p-4 [&>span]:!text-[0.8rem] [&>span]:!font-medium !cursor-pointer',
                                    {
                                        '!bg-transparent': !item.selected,
                                        '!bg-primary [&>span]:!text-white': item.selected
                                    }
                                )}
                            />
                        ))}
                    </div>
                    {!!activeOptionSelectedDetails && (
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
                                زمان انتظار بیمار در{activeOptionSelectedDetails?.service}
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
                                            ((activeOptionSelectedDetails?.wating_time ?? 0) * 2) /
                                            4
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
                                                {activeOptionSelectedDetails?.service} در بازه خیلی
                                                خوب قرار دارد.
                                            </span>
                                        </>
                                    ) : (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: promptSentences[
                                                    activeOptionSelectedDetails?.type
                                                ]
                                            }}
                                        />
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                    <span className="text-sm font-medium !mt-3 block">
                        {itemTitleList?.title ?? ''}
                    </span>
                    <div className="flex items-center justify-between p-3 bg-white border border-solid rounded-lg border-slate-200 space-s-2">
                        <span className="text-sm font-medium leading-6">
                            {itemTitleList?.profile_page_view ?? ''}
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
                        {itemTitleList?.search_position ?? ''}
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
                            {itemTitleList?.click_name_in_search ?? ''}
                        </span>
                        <div className="flex items-center space-s-2">
                            <div className="h-8 border border-solid border-slate-200" />
                            <div className="h-12 min-w-[3rem] font-bold flex items-center justify-center bg-teal-50 rounded-lg shadow-lg text-primary">
                                {data?.search_click_details?.count ?? '-'}
                            </div>
                        </div>
                    </div>
                    {!!isActiveOnlineVisitCenter  && shouldShowDeletedTurnsCount &&(
                             <div className="flex items-center justify-between p-3 bg-white border border-solid rounded-lg border-slate-200 space-s-2">
                             <span className="text-sm font-medium leading-6">
                             {itemTitleList?.deleted_turn ?? ''}
                             </span>
                             <div className="flex items-center space-s-2">
                                 <div className="h-8 border border-solid border-slate-200" />
                                 <div className="h-12 min-w-[3rem] font-bold flex items-center justify-center bg-teal-50 rounded-lg shadow-lg text-primary">
                                     {deletedTurn.data?.data?.count_book ?? '-'}
                                 </div>
                             </div>
                         </div>
                    )}
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

