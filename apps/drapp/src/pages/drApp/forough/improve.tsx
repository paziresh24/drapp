import { Button } from '@mui/material';
import { useDrApp } from '@paziresh24/context/drapp';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import isEmpty from 'lodash/isEmpty';
import { useHistory } from 'react-router-dom';

export const Forough = () => {
    const [{ centerConsult, centers }, setInfo] = useDrApp();
    const [info] = useDrApp();
    const router = useHistory();

    return (
        <div className="flex flex-col max-w-screen-sm p-5 mx-auto space-y-5">
            <div className="flex flex-col space-y-4">
                {isEmpty(centerConsult) ? (
                    <div className="flex flex-col space-y-2">
                        <span className="text-sm font-bold text-primary">مشاوره آنلاین</span>
                        <div className="flex items-center justify-between p-3 bg-gray-200 pointer-events-none border border-solid rounded-lg border-slate-200 space-s-2">
                            <span className="text-xs font-medium leading-6">
                                ظرفیت پزشکان ویزیت آنلاین تکمیل شده است
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-2">
                        <span className="text-sm font-bold text-primary">مشاوره آنلاین</span>
                        <div className="flex items-center justify-between p-3 bg-white border border-solid rounded-lg border-slate-200 space-s-2">
                            <span className="text-xs font-medium leading-6">
                                ساعات مشاوره آنلاین خود را بیشتر کنید و در زمان های بیشتری در دسترس
                                باشید.
                            </span>
                            <div className="flex items-center space-s-2">
                                <div className="h-8 border border-solid border-slate-200" />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    className="whitespace-nowrap"
                                    onClick={() => {
                                        localStorage.setItem('center_id', '5532');
                                        setInfo((prev: any) => ({
                                            ...prev,
                                            center: centers.find(
                                                (center: any) => center.id === '5532'
                                            )
                                        }));
                                        router.push('/setting/workHours');
                                        getSplunkInstance().sendEvent({
                                            group: 'forough',
                                            type: 'onlinevisit_available'
                                        });
                                    }}
                                >
                                    ویرایش
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {!centerConsult && <div className="w-full border border-solid border-slate-200" />}
                <div className="flex flex-col space-y-2">
                    <span className="text-sm font-bold text-primary">تغییر ساعت کاری</span>
                    <div className="flex items-center justify-between p-3 bg-white border border-solid rounded-lg border-slate-200 space-s-2">
                        <span className="text-xs font-medium leading-6">
                            ساعت کاری خود را برای روزهای بیشتری در هفته تنظیم کنید.
                        </span>
                        <div className="flex items-center space-s-2">
                            <div className="h-8 border border-solid border-slate-200" />
                            <Button
                                variant="outlined"
                                size="small"
                                className="whitespace-nowrap"
                                onClick={() => {
                                    localStorage.setItem(
                                        'center_id',
                                        centers.find((center: any) => center.type_id === 1)?.id
                                    );
                                    setInfo((prev: any) => ({
                                        ...prev,
                                        center: centers.find((center: any) => center.type_id === 1)
                                    }));
                                    router.push('/setting/workHours');
                                    getSplunkInstance().sendEvent({
                                        group: 'forough',
                                        type: 'availabletime'
                                    });
                                }}
                            >
                                ویرایش
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-full border border-solid border-slate-200" />
                <div className="flex flex-col space-y-2">
                    <span className="text-sm font-bold text-primary">تکمیل پروفایل</span>
                    <div className="flex items-center justify-between p-3 bg-white border border-solid rounded-lg border-slate-200 space-s-2">
                        <span className="text-xs font-medium leading-6">
                            پروفایل خود را کامل کنید تا بیماران بیشتری با شما آشنا شوند و نوبت ثبت
                            کنند.
                        </span>
                        <div className="flex items-center space-s-2">
                            <div className="h-8 border border-solid border-slate-200" />
                            <Button
                                variant="outlined"
                                size="small"
                                className="whitespace-nowrap"
                                onClick={() => {
                                    router.push('/profile');
                                    getSplunkInstance().sendEvent({
                                        group: 'forough',
                                        type: 'profile'
                                    });
                                }}
                            >
                                ویرایش
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forough;
