import styles from './turnBoxes.module.scss';
import { TurnBox } from '../turnBox';
import Guy from '@paziresh24/shared/icon/public/guy';
import { addCommaPrice } from '@paziresh24/shared/utils/addCommaPrice';
import ConsultIcon from '@paziresh24/shared/icon/doctorApp/consult';
import { useDrApp } from '@paziresh24/context/drapp';

const TurnBoxes = ({ books }) => {
    const [info] = useDrApp();
    return (
        <div className={styles['turn-type-wrapper']}>
            {info.center.id === '5532' && (
                <TurnBox
                    title="مشاوره آنلاین"
                    link="#"
                    cardIcon={<ConsultIcon />}
                    loading={books.isLoading}
                    turnNumber={
                        books.isSuccess && books.data.consult_appointments
                            ? addCommaPrice(books.data.consult_appointments)
                            : 0
                    }
                />
            )}
            {info.center.id !== '5532' && (
                <TurnBox
                    title="نوبت حضوری"
                    link="/"
                    cardIcon={<Guy />}
                    loading={books.isLoading}
                    turnNumber={
                        books.isSuccess && books.data.in_person_appointments
                            ? addCommaPrice(books.data.in_person_appointments)
                            : 0
                    }
                />
            )}
        </div>
    );
};

export { TurnBoxes };
