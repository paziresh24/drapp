import { useState } from 'react';
import { LikeIcon } from '@paziresh24/shared/icon/public/like';
import styles from './replyCard.module.scss';
import { useLikeFeedbacks, useUnLikeFeedbacks } from '@paziresh24/hooks/drapp/profile';

const ReplyCard = props => {
    const likeFeedbacks = useLikeFeedbacks();
    const unLikeFeedbacks = useUnLikeFeedbacks();
    const [countLike, setCountLike] = useState(props.reply.likes);
    const [like, setLike] = useState(props.reply.liked_by_me);
    const likeAction = () => {
        if (!like) {
            setLike(true);
            setCountLike(prev => prev + 1);
            return likeFeedbacks.mutate({ id: props.reply.id });
        }
        setLike(false);
        setCountLike(prev => prev - 1);
        unLikeFeedbacks.mutate({ id: props.reply.id });
    };
    return (
        <div key={props.reply.id} className={styles['replies']}>
            <div className={styles['feedback-text']}>
                {props.reply.is_by_me ? 'شما:' : `${props.reply.name}:`} {props.reply.description}
            </div>
            <div className={styles['actionWrapper']}>
                <div className={styles['action']}>
                    {countLike !== 0 && <span>{countLike}</span>}
                    <LikeIcon onClick={likeAction} fill={like} />
                </div>
            </div>
        </div>
    );
};

export { ReplyCard };
