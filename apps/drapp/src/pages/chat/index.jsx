import styles from '../../assets/styles/pages/chat/chat.module.scss';
import List from '../../components/chat/layouts/list';
import Room from '../../components/chat/layouts/room';

const Chat = () => {
    return (
        <div className={styles['wrapper']}>
            <List />
            <Room />
        </div>
    );
};

export { Chat };
