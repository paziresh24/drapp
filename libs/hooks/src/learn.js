import { useTour } from '@reactour/tour';
import { useIsActiveLearn } from '@paziresh24/context/core/isActiveLearn';

export const useLearnTour = () => {
    const [isActiveLearn] = useIsActiveLearn();
    const { isOpen: isTourOpen, currentStep, steps, setIsOpen, setCurrentStep } = useTour();

    const setSteps = step => {
        if (isActiveLearn) {
            setCurrentStep(step);
            setIsOpen(true);
        }
    };

    const tourState = state => {
        if (isActiveLearn) {
            setIsOpen(state);
            setSteps(null);
        }
    };

    return { isTourOpen, tourState, currentStep, steps, setSteps, isActiveLearn };
};
