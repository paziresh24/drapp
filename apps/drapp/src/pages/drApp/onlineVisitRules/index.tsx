import { Button } from '@mui/material';
import Modal from '@paziresh24/shared/ui/modal';
import Rules from 'apps/drapp/src/components/onlineVisit/rules';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const OnlineVisitRules = () => {
    const [cancelModal, setCancelModal] = useState(false);
    const router = useHistory();

    return (
        <>
            <div className="w-full min-h-full flex justify-center">
                <div className="lg:w-1/4 !bg-white overflow-auto w-full px-6">
                    <Rules
                        onSubmit={() => router.replace('/profile')}
                        onCancel={() => setCancelModal(true)}
                    />
                </div>
            </div>
            <Modal isOpen={cancelModal} onClose={setCancelModal} title="ویزیت آنلاین">
                <span className="text-sm leading-6">
                    بدلیل عدم پذیرش قوانین ویزیت آنلاین پذیرش۲۴ امکان فعالسازی ویزیت آنلاین را
                    ندارید.
                </span>
                <div className="w-full flex justify-between gap-4">
                    <Button
                        onClick={() => setCancelModal(false)}
                        variant="contained"
                        className="w-1/2"
                    >
                        مشاهده قوانین
                    </Button>
                    <Button
                        onClick={() => router.replace('/')}
                        variant="outlined"
                        className="w-1/2"
                    >
                        تایید
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default OnlineVisitRules;
