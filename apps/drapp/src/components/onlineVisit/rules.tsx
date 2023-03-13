import checklistImage from '@assets/image/checklist.png';
import { Button, Checkbox } from '@mui/material';
import Modal from '@paziresh24/shared/ui/modal';
import { useEffect, useState } from 'react';

interface RulesProps {
    onSubmit: () => void;
    title?: string;
    modalCancelButtonAction: () => void;
    terms: string[];
    submitText: string;
    cancelText: string;
    modalTitle: string;
    modalDescription: string;
}

export const Rules = (props: RulesProps) => {
    const {
        onSubmit,
        title,
        modalCancelButtonAction,
        terms,
        cancelText,
        submitText,
        modalDescription,
        modalTitle
    } = props;
    const [checkedCount, setCheckedCount] = useState(0);
    const [cancelModal, setCancelModal] = useState(false);
    const [isEnableButton, setIsEnableButton] = useState(false);

    useEffect(() => {
        if (checkedCount === terms.length) return setIsEnableButton(true);
        setIsEnableButton(false);
    }, [checkedCount]);

    const handleCheckboxChange = (checked: boolean) => {
        if (checked) {
            return setCheckedCount(checkedCount + 1);
        }
        setCheckedCount(checkedCount - 1);
    };

    return (
        <>
            <div className="w-full min-h-full flex justify-center">
                <div className="!bg-white overflow-auto w-full px-6">
                    <div className="relative h-full">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col justify-center items-center">
                                <img src={checklistImage} alt="" className="mx-auto mt-4" />
                                {!!title && (
                                    <span className="text-center my-6 bg-[#FFECC7] rounded-md text-[0.92rem] block w-full font-semibold p-3 leading-8">
                                        {title}
                                    </span>
                                )}
                            </div>
                            <div className="h-full lg:h-[20rem] overflow-auto">
                                {terms.map((rule, index) => (
                                    <div className="flex items-start cursor-pointer" key={index}>
                                        <Checkbox
                                            name={`question_${index + 1}`}
                                            size="small"
                                            className="!pr-0"
                                            onChange={e => handleCheckboxChange(e.target.checked)}
                                        />
                                        <span className="text-[0.92rem] text-[#49536E] leading-7 text-justify block font-semibold mt-1">
                                            {rule}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex w-full py-4 justify-between absolute lg:static min-[400px]:bottom-0">
                            <Button
                                variant="contained"
                                disabled={!isEnableButton}
                                className="block w-[45%]"
                                onClick={onSubmit}
                            >
                                {submitText}
                            </Button>
                            <Button
                                variant="outlined"
                                className="block w-[45%]"
                                onClick={() => setCancelModal(true)}
                            >
                                {cancelText}
                            </Button>
                        </div>
                    </div>
                </div>
                <Modal isOpen={cancelModal} onClose={setCancelModal} title={modalTitle}>
                    <span className="text-sm leading-6">{modalDescription}</span>
                    <div className="w-full flex justify-between gap-4">
                        <Button
                            onClick={() => setCancelModal(false)}
                            variant="contained"
                            className="w-1/2"
                        >
                            مشاهده قوانین
                        </Button>
                        <Button
                            onClick={modalCancelButtonAction}
                            variant="outlined"
                            className="w-1/2"
                        >
                            تایید
                        </Button>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default Rules;
