/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from 'assets/styles/pages/drApp/workDays.module.scss';

import { useDuration } from '@paziresh24/context/drapp/duration';
import { Duration } from '@components/setting/duration';
import Button from '@paziresh24/shared/ui/button';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { useHistory } from 'react-router-dom';

const VisitTime = () => {
    const [, setDuration] = useDuration();
    const history = useHistory();

    const workdaysAction = () => {
        history.push('/fill-info/work-days');

        // Object.keys(workDays).forEach(dayKey => {
        //     Object.keys(workDays[dayKey]).forEach(key => {
        //         if (workDays[dayKey][key].from !== null || workDays[dayKey][key].to !== null)
        //             return workDaysTime.push({ ...workDays[dayKey][key], day: dayKey });
        //     });
        // });
        // workHours.mutate(
        //     {
        //         center_id: info.center.id,
        //         cost: 0,
        //         duration: duration,
        //         workHours: workDaysTime
        //     },
        //     {
        //         onSuccess: data => {
        //             setSuccess(true);
        //         },
        //         onError: err => {
        //             toast.error('ساعت کاری وارد شده نادرست می باشد.');
        //         }
        //     }
        // );
    };

    return (
        <div id={styles['workDays']}>
            <Duration value={setDuration} />
            <FixedWrapBottom>
                <Button block onClick={workdaysAction}>
                    تایید
                </Button>
            </FixedWrapBottom>
        </div>
    );
};

export { VisitTime };
