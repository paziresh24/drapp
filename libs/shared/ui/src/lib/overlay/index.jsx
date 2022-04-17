import styles from './overlay.module.scss';
import { LoadingIcon } from '@paziresh24/shared/icon';

const Overlay = () => {
    return (
        <div className={styles['overlay']}>
            {/* <LoadingIcon color="#3f4079" width={41} height={41} /> */}
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="60px"
                height="10px"
                viewBox="0 0 80 20"
            >
                <circle cx="10" cy="10" r="10" fill="#3F3F79">
                    <animate
                        attributeName="cx"
                        from="10"
                        to="40"
                        dur="0.5s"
                        calcMode="spline"
                        keySplines="0.42 0 0.58 1"
                        keyTimes="0;1"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle cx="10" cy="10" r="0" fill="#6060a1">
                    <animate
                        attributeName="r"
                        from="0"
                        to="10"
                        dur="0.5s"
                        calcMode="spline"
                        keySplines="0.42 0 0.58 1"
                        keyTimes="0;1"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle cx="40" cy="10" r="10" fill="#6060a1">
                    <animate
                        attributeName="cx"
                        from="40"
                        to="70"
                        dur="0.5s"
                        calcMode="spline"
                        keySplines="0.42 0 0.58 1"
                        keyTimes="0;1"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle cx="70" cy="10" r="10" fill="#3F3F79">
                    <animate
                        attributeName="r"
                        from="10"
                        to="0"
                        dur="0.5s"
                        calcMode="spline"
                        keySplines="0.42 0 0.58 1"
                        keyTimes="0;1"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
        </div>
    );
};

export { Overlay };
