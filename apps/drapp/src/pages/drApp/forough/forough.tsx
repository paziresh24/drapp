import { Button, Skeleton } from '@mui/material';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { useSearchViewInfo } from 'apps/drapp/src/apis/forough/searchViewInfo';
import { round } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const Forough = () => {
    const searchViewInfo = useSearchViewInfo();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>({});
    const router = useHistory();

    useEffect(() => {
        if (searchViewInfo.data?.data) {
            setIsLoading(false);
            setData(searchViewInfo.data?.data);
        } else {
            setTimeout(() => {
                searchViewInfo.refetch();
            }, 5000);
        }
    }, [searchViewInfo.data]);

    return (
        <div className="flex flex-col max-w-screen-sm p-5 mx-auto space-y-5">
            <span className="text-sm font-bold">
                آمار مهم شما در 30 روز گذشته به شرح زیر می باشد:
            </span>
            {isLoading ? (
                <Skeleton width="100%" height="16rem" className="!scale-100" />
            ) : (
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white border border-solid rounded-lg border-slate-200 space-s-2">
                        <span className="text-sm font-medium leading-6">
                            تعداد بیمارانی که از پروفایل شما در پذیرش24 بازدید کردند.
                        </span>
                        <div className="flex items-center space-s-2">
                            <div className="h-8 border border-solid border-slate-200" />
                            <div className="h-12 min-w-[3rem] font-bold flex items-center justify-center bg-teal-50 rounded-lg shadow-lg text-primary">
                                {data?.page_view_statistics?.unique_count_by_terminal_id ??
                                    data?.page_view_statistics?.count ??
                                    '-'}
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
