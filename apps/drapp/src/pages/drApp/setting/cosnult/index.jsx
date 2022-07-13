/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from 'assets/styles/pages/drApp/workDays.module.scss';
import Button from '@paziresh24/shared/ui/button';
import { useWorkDays } from '@paziresh24/context/drapp/workDays';
import { useGetWorkHours, useWorkHours } from '@paziresh24/hooks/drapp/fillInfo';
import { useDrApp } from '@paziresh24/context/drapp';
import { TimeRow } from '@components/setting/workDays';
import { Duration } from '@components/setting/duration';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useMenu } from '@paziresh24/context/core/menu';
import { Overlay } from '@paziresh24/shared/ui/overlay';
import { ChevronIcon } from '@paziresh24/shared/icon';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const Setting = () => {
    const [info] = useDrApp();
    const getWorkDays = useGetWorkHours({ center_id: info.center.id });
    const history = useHistory();

    const [workDays] = useWorkDays();
    const [duration, setDuration] = useState();
    const workHours = useWorkHours();
    const workDaysTime = [];
    const [isOpen] = useMenu();

    useEffect(() => {
        getWorkDays.remove();
        setTimeout(() => {
            getWorkDays.refetch();
        }, 0);
    }, [info.center]);

    const workdaysAction = () => {
        Object.keys(workDays).forEach(dayKey => {
            Object.keys(workDays[dayKey]).forEach(key => {
                if (workDays[dayKey][key].from !== null || workDays[dayKey][key].to !== null)
                    return workDaysTime.push({ ...workDays[dayKey][key], day: dayKey });
            });
        });
        workHours.mutate(
            {
                center_id: info.center.id,
                cost: 0,
                duration: duration ?? 10,
                workHours: workDaysTime
            },
            {
                onSuccess: data => {
                    toast.success(data.message);
                    getWorkDays.refetch();
                    history.push('/');
                    getSplunkInstance().sendEvent({
                        group: 'setting',
                        type: 'change-work-hours'
                    });
                },
                onError: err => {
                    toast.error('ساعت کاری وارد شده نادرست می باشد.');
                }
            }
        );
    };

    const weekDays = [
        { id: 6, day: 'شنبه' },
        { id: 7, day: 'یکشنبه' },
        { id: 1, day: 'دوشنبه' },
        { id: 2, day: 'سه‌شنبه' },
        { id: 3, day: 'چهارشنبه' },
        { id: 4, day: 'پنج‌شنبه' },
        { id: 5, day: 'جمعه' }
    ];

    return (
        <div id={styles['workDays']}>
            <div className={styles['header']}>
                <Button
                    variant="secondary"
                    size="small"
                    onClick={() => history.push('/')}
                    icon={<ChevronIcon dir="left" color="#27bda0" />}
                >
                    بازگشت
                </Button>
            </div>

            {getWorkDays.isSuccess && (
                <>
                    {info.center.id !== '5532' && (
                        <Duration
                            value={setDuration}
                            defaultValue={getWorkDays.data.data.duration}
                        />
                    )}

                    <span>
                        لطفا روزها و ساعات کاری که در مطب خود آماده حضور بیماران هستید را مشخص کنید.
                    </span>
                    <div className={styles['time_wrapper']}>
                        {weekDays.map(day => (
                            <TimeRow
                                key={day.id}
                                day={day}
                                data={getWorkDays.data.data.workhours.filter(
                                    item => item.day === day.id
                                )}
                                duration={duration}
                            />
                        ))}
                    </div>
                    <FixedWrapBottom>
                        <Button
                            type="submit"
                            block
                            onClick={workdaysAction}
                            loading={workHours.isLoading}
                        >
                            ذخیره
                        </Button>
                    </FixedWrapBottom>
                </>
            )}
            {(getWorkDays.isLoading || getWorkDays.isIdle) && <Overlay />}
        </div>
    );
};

export default Setting;
