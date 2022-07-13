import styles from './feedbackCards.module.scss';
import { FeedbackCard } from '../feedbackCard';
import Button from '@paziresh24/shared/ui/button';
import { useState } from 'react';

const FeedbackCards = ({ feedbacks }) => {
    const [page, setPage] = useState(10);

    return (
        <div className={styles['feedback-wrapper']}>
            <div className={styles['content']}>
                {feedbacks.map(
                    (feedback, i) =>
                        page >= i + 1 && <FeedbackCard feedback={feedback} key={feedback.id} />
                )}
            </div>

            {page < feedbacks.length && (
                <Button size="small" variant="secondary" onClick={() => setPage(prev => prev + 10)}>
                    مشاهده بیشتر
                </Button>
            )}
        </div>
    );
};

export { FeedbackCards };
