import styles from 'assets/styles/pages/drApp/visitCost.module.scss';
import TextField from '@paziresh24/shared/ui/textField';

const VisitCost = () => {
    return (
        <div id={styles['visitCost']}>
            <span>هزینه هر ویزیت خود را مشخص کنید.</span>
            <TextField label="تومان" type="number" />
        </div>
    );
};

export { VisitCost };
