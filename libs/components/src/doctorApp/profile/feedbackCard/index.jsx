import { LikeIcon, ReplyIcon } from '../../../icons';
import {
    useLikeFeedbacks,
    useReplyFeedbacks,
    useUnLikeFeedbacks
} from '@paziresh24/hooks/drapp/profile';
import styles from './feedbackCard.module.scss';
import TextArea from '../../../core/textArea';
import Modal from '../../../core/modal';
import Button from '../../../core/button';
import { useRef, useState } from 'react';
import { ReplyCard } from '../replyCard';
import { toast } from 'react-toastify';
import Chips from '../../../core/chips';

import Male from '@paziresh24/assets/images/drapp/male.png';
import Female from '@paziresh24/assets/images/drapp/female.png';

const FeedbackCard = ({ feedback }) => {
    const likeFeedbacks = useLikeFeedbacks();
    const replyFeedbacks = useReplyFeedbacks();
    const [replyModal, setReplyModal] = useState(false);
    const replyText = useRef();
    const unLikeFeedbacks = useUnLikeFeedbacks();
    const [countLike, setCountLike] = useState(feedback.likes);
    const [like, setLike] = useState(feedback.liked_by_me);

    const openReplyModal = () => setReplyModal(true);

    const sendReply = () => {
        replyFeedbacks.mutate(
            {
                id: feedback.id,
                description: replyText.current.value
            },
            {
                onSuccess: () => {
                    setReplyModal(false);
                    toast.success('نظر شما بعد از تایید نمایش داده می شود.');
                }
            }
        );
    };

    const likeAction = () => {
        if (!like) {
            setLike(true);
            setCountLike(prev => prev + 1);
            return likeFeedbacks.mutate({ id: feedback.id });
        }
        setLike(false);
        setCountLike(prev => prev - 1);
        unLikeFeedbacks.mutate({ id: feedback.id });
    };

    return (
        <>
            <div className={styles['feedback-card']}>
                <div className={styles['info-wrapper']}>
                    <div className={styles['info-wrapper__row']}>
                        <img src={feedback.gender === 'female' ? Female : Male} alt="profile" />
                        <div className={styles['inner']}>
                            <div className={styles['name']}>{feedback.name}</div>
                            <div className={styles['date']}>
                                {new Date(feedback.created_at * 1000).toLocaleDateString('fa')}
                            </div>
                        </div>
                    </div>
                    {feedback.bookType && <Chips theme="gray">{feedback.bookType}</Chips>}
                </div>
                <div className={styles['feedback-text']}>{feedback.description}</div>
                <div className={styles['actionWrapper']}>
                    <div className={styles['action']} onClick={likeAction} aria-hidden>
                        {countLike !== 0 && <span>{countLike}</span>}
                        <LikeIcon fill={like} />
                        <span>پسندیدن</span>
                    </div>

                    <div className={styles['action']} onClick={openReplyModal} aria-hidden>
                        {feedback.replies.length !== 0 && <span>{feedback.replies.length}</span>}
                        <ReplyIcon />
                        <span>پاسخ</span>
                    </div>
                </div>
                {feedback.replies.map(reply => (
                    <ReplyCard key={reply.id} reply={reply} />
                ))}
            </div>

            <Modal title={`پاسخ به ${feedback.name}`} isOpen={replyModal} onClose={setReplyModal}>
                <TextArea placeholder="اینجا بنویسید ..." ref={replyText} />
                <Button onClick={sendReply} loading={replyFeedbacks.isLoading}>
                    ارسال
                </Button>
            </Modal>
        </>
    );
};

export { FeedbackCard };
