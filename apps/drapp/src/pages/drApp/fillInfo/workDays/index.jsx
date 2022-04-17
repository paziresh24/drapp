/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import styles from 'assets/styles/pages/drApp/workDays.module.scss';
import Modal from '@paziresh24/shared/ui/modal';
import Button from '@paziresh24/shared/ui/button';
import { useWorkDays } from '@paziresh24/context/drapp/workDays';
import { useWorkHours } from '@paziresh24/hooks/drapp/fillInfo';
import { useDrApp } from '@paziresh24/context/drapp';
import { TimeRow } from '@components/molecules/setting/workDays';
import { toast } from 'react-toastify';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { useDuration } from '@paziresh24/context/drapp/duration';
import { Duration } from '@components/molecules/setting/duration';
import ReactCanvasConfetti from 'react-canvas-confetti';
import isEmpty from 'lodash/isEmpty';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const canvasStyles = {
    position: 'absolute',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
};

const WorkDays = () => {
    const [info] = useDrApp();
    const [duration, setDuration] = useDuration();
    const [success, setSuccess] = useState();

    const [workDays] = useWorkDays();
    const workHours = useWorkHours();
    const workDaysTime = [];
    const [animationInstance, setAnimationInstance] = useState(null);

    const makeShot = (particleRatio, opts) => {
        animationInstance &&
            setAnimationInstance({
                ...opts,
                origin: { y: 0.7 },
                particleCount: Math.floor(200 * particleRatio)
            });
    };

    const fire = () => {
        makeShot(0.25, {
            spread: 26,
            startVelocity: 55
        });

        makeShot(0.2, {
            spread: 60
        });

        makeShot(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });

        makeShot(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });

        makeShot(0.1, {
            spread: 120,
            startVelocity: 45
        });
    };

    const handlerFire = () => {
        fire();
    };

    const getInstance = instance => {
        setAnimationInstance(instance);
    };

    useEffect(() => handlerFire(), []);

    const weekDays = [
        { id: 6, day: 'شنبه' },
        { id: 7, day: 'یکشنبه' },
        { id: 1, day: 'دوشنبه' },
        { id: 2, day: 'سه‌شنبه' },
        { id: 3, day: 'چهارشنبه' },
        { id: 4, day: 'پنج‌شنبه' },
        { id: 5, day: 'جمعه' }
    ];
    const calculateDoctorSlot = (workDays, duration) => {
        //calculate doctor slot of first work day
        return ((workDays[0].to.slice(0, 2) - workDays[0].from.slice(0, 2)) * 60) / duration;
    };
    const submit = () => {
        Object.keys(workDays).forEach(dayKey => {
            Object.keys(workDays[dayKey]).forEach(key => {
                if (workDays[dayKey][key].from !== null || workDays[dayKey][key].to !== null)
                    return workDaysTime.push({ ...workDays[dayKey][key], day: dayKey });
            });
        });
        if (isEmpty(workDaysTime)) {
            return toast.warning('ساعت کاری نمی تواند خالی باشد.');
        }

        workHours.mutate(
            {
                center_id: info.center.id,
                cost: 0,
                duration: duration,
                workHours: workDaysTime
            },
            {
                onSuccess: () => {
                    getSplunkInstance().sendEvent({
                        group: 'workdays_active_booking',
                        type: 'successful',
                        event: {
                            slot: calculateDoctorSlot(workDaysTime, duration)
                        }
                    });
                    setSuccess(true);
                },
                onError: error => {
                    getSplunkInstance().sendEvent({
                        group: 'workdays_active_booking',
                        type: 'unsuccessful',
                        event: {
                            slot: calculateDoctorSlot(workDaysTime, duration),
                            error: error.response?.data
                        }
                    });
                    toast.error('ساعت کاری وارد شده نادرست می باشد.');
                }
            }
        );
    };

    return (
        <>
            <div id={styles['workDaysPage']}>
                <Duration value={setDuration} />

                <span>روز و ساعتی که در مطب هستید را مشخص کنید.</span>
                <div className={styles['time_wrapper']}>
                    {weekDays.map(day => (
                        <TimeRow key={day.id} day={day} data={{}} duration={duration} />
                    ))}
                </div>
                <FixedWrapBottom>
                    <Button type="submit" block onClick={submit} loading={workHours.isLoading}>
                        فعالسازی
                    </Button>
                </FixedWrapBottom>
            </div>
            <Modal isOpen={success} noHeader noBodyPadding fullPage>
                <div className={styles['hero-wrapper']}>
                    <div className={styles['hero-content']}>
                        <div className={styles['hero-info-wrapper']}>
                            <span className={styles['name']}>
                                دکتر {info.doctor.name} {info.doctor.family}
                            </span>
                            <span>خوش آمدید</span>
                        </div>
                        <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
                        <svg
                            width="77"
                            height="78"
                            viewBox="0 0 77 78"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M38.4996 71.1026C56.2187 71.1026 70.5829 56.7384 70.5829 39.0193C70.5829 21.3001 56.2187 6.93595 38.4996 6.93595C20.7805 6.93595 6.41626 21.3001 6.41626 39.0193C6.41626 56.7384 20.7805 71.1026 38.4996 71.1026ZM50.9662 32.2359C51.6496 31.5525 51.6496 30.4444 50.9662 29.761C50.2828 29.0776 49.1747 29.0776 48.4913 29.761L33.6871 44.5652L28.5079 39.386C27.8244 38.7026 26.7164 38.7026 26.033 39.386C25.3496 40.0694 25.3496 41.1775 26.033 41.8609L32.4497 48.2776C32.7778 48.6057 33.223 48.7901 33.6871 48.7901C34.1512 48.7901 34.5963 48.6057 34.9245 48.2776L50.9662 32.2359Z"
                                fill="#3f3f79"
                            />
                        </svg>
                        <span className={styles['hero-title']}>نوبت دهی شما فعال شد</span>
                        <span>پروفایل عمومی شما</span>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            className={styles['profile-link']}
                            href={`https://paziresh24.com/dr/${info.doctor.slug}`}
                        >
                            <span> https://paziresh24.com/dr/{info.doctor.slug}</span>

                            <svg
                                width="14"
                                height="15"
                                viewBox="0 0 14 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.83335 1.79627L5.73853 1.79626C4.82165 1.7961 4.25126 1.796 3.77062 1.9361C2.62237 2.27078 1.72453 3.16862 1.38985 4.31687C1.24975 4.79751 1.24985 5.3679 1.25001 6.28478L1.25002 6.37961V7.54627L1.25002 7.57426C1.25002 8.60389 1.25001 9.4149 1.31579 10.0615C1.38301 10.7223 1.52304 11.2666 1.83988 11.7408C2.09523 12.1229 2.42336 12.4511 2.80553 12.7064C3.27971 13.0233 3.82401 13.1633 4.4848 13.2305C5.13139 13.2963 5.9424 13.2963 6.97203 13.2963H7.00002H8.16669L8.26151 13.2963C9.1784 13.2964 9.74879 13.2965 10.2294 13.1564C11.3777 12.8218 12.2755 11.9239 12.6102 10.7757C12.7503 10.295 12.7502 9.72465 12.75 8.80777L12.75 8.71294C12.75 8.43679 12.5262 8.21294 12.25 8.21294C11.9739 8.21294 11.75 8.43679 11.75 8.71294C11.75 9.75567 11.745 10.1705 11.6501 10.4958C11.4111 11.316 10.7698 11.9573 9.94959 12.1964C9.62421 12.2912 9.20942 12.2963 8.16669 12.2963H7.00002C5.93627 12.2963 5.17609 12.2957 4.58601 12.2356C4.00429 12.1765 3.64358 12.0637 3.3611 11.8749C3.08812 11.6925 2.85374 11.4582 2.67135 11.1852C2.4826 10.9027 2.36983 10.542 2.31065 9.96028C2.25063 9.3702 2.25002 8.61002 2.25002 7.54627V6.37961C2.25002 5.33687 2.25506 4.92208 2.3499 4.5967C2.58896 3.77652 3.23027 3.13521 4.05045 2.89615C4.37583 2.80131 4.79062 2.79627 5.83335 2.79627C6.1095 2.79627 6.33335 2.57241 6.33335 2.29627C6.33335 2.02013 6.1095 1.79627 5.83335 1.79627ZM8.25002 2.29627C8.25002 2.57241 8.47388 2.79627 8.75002 2.79627H11.0429L6.64647 7.19272C6.45121 7.38798 6.45121 7.70456 6.64647 7.89982C6.84173 8.09509 7.15831 8.09509 7.35357 7.89982L11.75 3.50338V5.79627C11.75 6.07241 11.9739 6.29627 12.25 6.29627C12.5262 6.29627 12.75 6.07241 12.75 5.79627V2.29627C12.75 2.02013 12.5262 1.79627 12.25 1.79627H8.75002C8.47388 1.79627 8.25002 2.02013 8.25002 2.29627Z"
                                    fill="#252549"
                                />
                            </svg>
                        </a>

                        <Button
                            className={styles['button-hero']}
                            onClick={() => {
                                window.location.replace('/');
                                localStorage.setItem('shouldFillProfile', true);
                            }}
                        >
                            شروع نوبت دهی
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export { WorkDays };
