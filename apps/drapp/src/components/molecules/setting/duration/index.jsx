import styles from 'assets/styles/pages/drApp/visitTime.module.scss';
import Counter from '@paziresh24/shared/ui/counter';

const Duration = ({ value, defaultValue }) => {
    return (
        <div id={styles['visitTime']}>
            <span>هر ویزیت تقریبا چقدر طول می کشد؟</span>
            <Counter
                defaultValue={defaultValue ?? 5}
                defaultCount={5}
                exclude={[25, 35, 40, 45, 50, 55]}
                max={60}
                type="دقیقه"
                value={value}
            />
        </div>
    );
};

export { Duration };
