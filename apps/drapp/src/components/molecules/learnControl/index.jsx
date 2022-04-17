import { useLearnTour } from '@paziresh24/hooks/learn';
import styles from './learnControl.module.scss';
import CloseIcon from '@paziresh24/shared/icon/public/close';
import { useIsActiveLearn } from '@paziresh24/context/core/isActiveLearn';

const LearnControl = () => {
    const [isActiveLearn, setIsActiveLearn] = useIsActiveLearn();
    const { isTourOpen, steps, currentStep, tourState } = useLearnTour();

    return (
        isTourOpen &&
        isActiveLearn && (
            <div
                className={styles.wrapper}
                onClick={() => {
                    tourState(false);
                    setIsActiveLearn(false);
                }}
                aria-hidden
            >
                <CloseIcon />
                <span>بستن آموزش</span>
                {/* <div>
                {currentStep + 1}/{steps.length}
            </div> */}
            </div>
        )
    );
};

export default LearnControl;
