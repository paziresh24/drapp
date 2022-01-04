import styles from './error.module.scss';

const Error = ({ code, error, message }) => {
    return (
        <main>
            <div>
                <h1 className={styles['status-code']}>{code}</h1>
                <h2 className={styles['error']}>{error}</h2>
                <p className={styles['message']}>{message}</p>
            </div>
        </main>
    );
};

export default Error;
