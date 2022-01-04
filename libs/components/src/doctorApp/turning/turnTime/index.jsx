import { Calendar } from '@hassanmojab/react-modern-calendar-datepicker';
import Modal from '../../../core/modal';
import { Tabs, Tab } from '../../../core/tab';
import Button from '../../../core/button';
import styles from './turnTime.module.scss';

const TurnTime = ({ isOpen, setIsOpen }) => {
    const morning = [
        '12:00',
        '12:20',
        '12:40',
        '14:00',
        '15:00',
        '16:00',
        '12:00',
        '12:20',
        '12:40',
        '14:00',
        '15:00',
        '16:00',
        '12:00',
        '12:20',
        '12:40',
        '14:00',
        '15:00',
        '16:00',
        '12:00',
        '12:20',
        '12:40',
        '14:00',
        '15:00',
        '16:00',
        '12:00',
        '12:20',
        '12:40',
        '14:00',
        '15:00',
        '16:00',
        '12:00',
        '12:20',
        '12:40',
        '14:00',
        '15:00',
        '16:00',
        '12:00',
        '12:20',
        '12:40',
        '14:00',
        '15:00',
        '16:00',
        '12:00',
        '12:20',
        '12:40',
        '14:00',
        '15:00',
        '16:00'
    ];

    const evvning = ['20:00', '21:20', '21:40', '22:00', '23:00'];
    const disabledDays = [
        {
            year: 1400,
            month: 5,
            day: 17
        },
        {
            year: 1400,
            month: 5,
            day: 20
        },
        {
            year: 1400,
            month: 5,
            day: 21
        },
        {
            year: 1400,
            month: 5,
            day: 22
        },
        {
            year: 1400,
            month: 5,
            day: 23
        },
        {
            year: 1400,
            month: 5,
            day: 14
        },
        {
            year: 1400,
            month: 5,
            day: 15
        },
        {
            year: 1400,
            month: 5,
            day: 7
        },
        {
            year: 1400,
            month: 5,
            day: 8
        },
        {
            year: 1400,
            month: 5,
            day: 1
        },
        {
            year: 1400,
            month: 5,
            day: 29
        }
    ];

    return (
        <Modal title="انتخاب زمان" isOpen={isOpen} onClose={setIsOpen} maxWidth="75rem">
            <div className={styles['wrapper']}>
                <Calendar
                    // value={selectedDay}
                    // onChange={setSelectedDay}
                    inputPlaceholder="یک روز انتخاب کنید"
                    shouldHighlightWeekends
                    colorPrimary="#27bda0"
                    disabledDays={disabledDays} // here we pass them
                    locale="fa"
                    calendarClassName={styles['calendarWrap']}
                />

                <div className={styles['timeBox-wrapper']}>
                    <Tabs>
                        <Tab title="صبح">
                            <div className={styles['timeBox-blocks']}>
                                {morning.map(time => (
                                    <div className={styles['timeBox']} key={Math.random()}>
                                        {time}
                                    </div>
                                ))}
                            </div>
                        </Tab>
                        <Tab title="عصر">
                            <div className={styles['timeBox-blocks']}>
                                {evvning.map(time => (
                                    <div className={styles['timeBox']} key={Math.random()}>
                                        {time}
                                    </div>
                                ))}
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <div className={styles['footer']}>
                <Button size="small">ثبت نوبت</Button>
            </div>
        </Modal>
    );
};

export { TurnTime };
