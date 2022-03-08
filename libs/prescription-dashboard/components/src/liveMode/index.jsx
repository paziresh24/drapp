import styles from './liveMode.module.scss';
import { useState, useEffect, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import { HelpIcon } from '@paziresh24/components/icons/public/help';

const LiveMode = ({ refetch }) => {
    const [isActiveLive, setIsActiveLive] = useState(false);
    const interval = useRef(null);

    useEffect(() => {
        if (isActiveLive) {
            interval.current = setInterval(() => {
                refetch();
            }, 10000);
        } else {
            clearInterval(interval.current);
        }
    }, [isActiveLive]);

    return (
        <div className="flex space-s-5">
            <HelpIcon color="#3f4079" data-tip data-for="centerSelect" />
            <ReactTooltip id="centerSelect" place="top" type="dark" effect="solid">
                با فعالسازی این قابلیت آمار بصورت زنده به روز می شود
            </ReactTooltip>
            <button
                className={styles.excelExportButton}
                onClick={() => setIsActiveLive(prev => !prev)}
            >
                {!isActiveLive ? (
                    <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.43728 4.5319C9.45382 4.54253 9.47043 4.55321 9.48709 4.56392L17.7886 9.90059L17.8359 9.931C18.3845 10.2836 18.8657 10.5929 19.2025 10.8874C19.5588 11.199 19.9007 11.619 19.9007 12.2138C19.9007 12.8086 19.5588 13.2286 19.2025 13.5402C18.8657 13.8347 18.3845 14.144 17.8359 14.4967L17.7886 14.5271L9.48709 19.8637L9.43729 19.8958C8.79999 20.3055 8.25129 20.6583 7.7953 20.8643C7.32513 21.0767 6.73881 21.2334 6.16143 20.9182C5.58404 20.6029 5.39875 20.025 5.32319 19.5147C5.24991 19.0197 5.24995 18.3674 5.25 17.6097L5.25001 17.5505V6.87716C5.25001 6.85735 5.25 6.83762 5.25 6.81795C5.24995 6.0603 5.24991 5.40797 5.32319 4.913C5.39875 4.40264 5.58404 3.82472 6.16143 3.5095C6.73881 3.19428 7.32513 3.35093 7.7953 3.56335C8.25129 3.76937 8.79999 4.12215 9.43728 4.5319ZM6.8549 4.83369C6.85443 4.83305 6.85822 4.83175 6.86767 4.83168C6.86009 4.83428 6.85536 4.83432 6.8549 4.83369ZM6.8837 4.83246C6.92431 4.83626 7.01256 4.85569 7.1777 4.93031C7.52004 5.08498 7.97458 5.37481 8.67595 5.82569L16.9774 11.1624C17.5876 11.5546 17.9723 11.8043 18.2151 12.0166C18.33 12.1171 18.3772 12.1795 18.3953 12.2099C18.3961 12.2113 18.3969 12.2126 18.3975 12.2138C18.3969 12.215 18.3961 12.2163 18.3953 12.2177C18.3772 12.2482 18.33 12.3106 18.2151 12.4111C17.9723 12.6234 17.5876 12.873 16.9774 13.2653L8.67595 18.602C7.97458 19.0529 7.52004 19.3427 7.1777 19.4974C7.01256 19.572 6.92431 19.5914 6.8837 19.5952C6.86493 19.559 6.83356 19.4742 6.80702 19.295C6.752 18.9234 6.75001 18.3843 6.75001 17.5505V6.87716C6.75001 6.04336 6.752 5.50429 6.80702 5.13268C6.83356 4.95342 6.86493 4.86867 6.8837 4.83246ZM6.8549 19.594C6.85536 19.5933 6.86009 19.5934 6.86767 19.596C6.85822 19.5959 6.85443 19.5946 6.8549 19.594ZM6.89171 19.6091C6.89799 19.6141 6.90058 19.618 6.9003 19.6188C6.90003 19.6195 6.89688 19.617 6.89171 19.6091ZM6.8917 4.81856C6.89688 4.81065 6.90003 4.80816 6.9003 4.80889C6.90058 4.80963 6.89799 4.81358 6.8917 4.81856Z"
                            fill="#3F3F79"
                        />
                    </svg>
                ) : (
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7 3.25H6.97475H6.97474C6.53028 3.24999 6.15925 3.24999 5.85464 3.27077C5.53754 3.29241 5.23801 3.33905 4.94762 3.45933C4.27379 3.73844 3.73844 4.27379 3.45933 4.94762C3.33905 5.23801 3.29241 5.53754 3.27077 5.85464C3.24999 6.15925 3.24999 6.53028 3.25 6.97474V6.97475V7V17V17.0253V17.0253C3.24999 17.4697 3.24999 17.8408 3.27077 18.1454C3.29241 18.4625 3.33905 18.762 3.45933 19.0524C3.73844 19.7262 4.27379 20.2616 4.94762 20.5407C5.23801 20.661 5.53754 20.7076 5.85464 20.7292C6.15925 20.75 6.53028 20.75 6.97474 20.75H7H7.02526C7.46972 20.75 7.84075 20.75 8.14537 20.7292C8.46247 20.7076 8.76199 20.661 9.05238 20.5407C9.72621 20.2616 10.2616 19.7262 10.5407 19.0524C10.661 18.762 10.7076 18.4625 10.7292 18.1454C10.75 17.8408 10.75 17.4697 10.75 17.0253V17V7V6.97474C10.75 6.53028 10.75 6.15925 10.7292 5.85464C10.7076 5.53754 10.661 5.23801 10.5407 4.94762C10.2616 4.27379 9.72621 3.73844 9.05238 3.45933C8.76199 3.33905 8.46247 3.29241 8.14537 3.27077C7.84076 3.24999 7.46972 3.24999 7.02527 3.25H7.02525H7ZM5.52165 4.84515C5.5988 4.81319 5.71602 4.78372 5.95674 4.76729C6.20421 4.75041 6.5238 4.75 7 4.75C7.4762 4.75 7.79579 4.75041 8.04326 4.76729C8.28399 4.78372 8.4012 4.81319 8.47835 4.84515C8.78464 4.97202 9.02798 5.21536 9.15485 5.52165C9.18681 5.5988 9.21629 5.71602 9.23271 5.95674C9.24959 6.20421 9.25 6.5238 9.25 7V17C9.25 17.4762 9.24959 17.7958 9.23271 18.0433C9.21629 18.284 9.18681 18.4012 9.15485 18.4784C9.02798 18.7846 8.78464 19.028 8.47835 19.1549C8.4012 19.1868 8.28399 19.2163 8.04326 19.2327C7.79579 19.2496 7.4762 19.25 7 19.25C6.5238 19.25 6.20421 19.2496 5.95674 19.2327C5.71602 19.2163 5.5988 19.1868 5.52165 19.1549C5.21536 19.028 4.97202 18.7846 4.84515 18.4784C4.81319 18.4012 4.78372 18.284 4.76729 18.0433C4.75041 17.7958 4.75 17.4762 4.75 17V7C4.75 6.5238 4.75041 6.20421 4.76729 5.95674C4.78372 5.71602 4.81319 5.5988 4.84515 5.52165C4.97202 5.21536 5.21536 4.97202 5.52165 4.84515ZM17 3.25H16.9748H16.9747C16.5303 3.24999 16.1592 3.24999 15.8546 3.27077C15.5375 3.29241 15.238 3.33905 14.9476 3.45933C14.2738 3.73844 13.7384 4.27379 13.4593 4.94762C13.339 5.23801 13.2924 5.53754 13.2708 5.85464C13.25 6.15925 13.25 6.53029 13.25 6.97475V7V17V17.0253C13.25 17.4697 13.25 17.8408 13.2708 18.1454C13.2924 18.4625 13.339 18.762 13.4593 19.0524C13.7384 19.7262 14.2738 20.2616 14.9476 20.5407C15.238 20.661 15.5375 20.7076 15.8546 20.7292C16.1592 20.75 16.5303 20.75 16.9747 20.75H17H17.0253C17.4697 20.75 17.8408 20.75 18.1454 20.7292C18.4625 20.7076 18.762 20.661 19.0524 20.5407C19.7262 20.2616 20.2616 19.7262 20.5407 19.0524C20.661 18.762 20.7076 18.4625 20.7292 18.1454C20.75 17.8408 20.75 17.4698 20.75 17.0253V17.0253V17V7V6.97474V6.97466C20.75 6.53024 20.75 6.15923 20.7292 5.85464C20.7076 5.53754 20.661 5.23801 20.5407 4.94762C20.2616 4.27379 19.7262 3.73844 19.0524 3.45933C18.762 3.33905 18.4625 3.29241 18.1454 3.27077C17.8408 3.24999 17.4697 3.24999 17.0253 3.25H17.0253H17ZM15.5216 4.84515C15.5988 4.81319 15.716 4.78372 15.9567 4.76729C16.2042 4.75041 16.5238 4.75 17 4.75C17.4762 4.75 17.7958 4.75041 18.0433 4.76729C18.284 4.78372 18.4012 4.81319 18.4784 4.84515C18.7846 4.97202 19.028 5.21536 19.1549 5.52165C19.1868 5.5988 19.2163 5.71602 19.2327 5.95674C19.2496 6.20421 19.25 6.5238 19.25 7V17C19.25 17.4762 19.2496 17.7958 19.2327 18.0433C19.2163 18.284 19.1868 18.4012 19.1549 18.4784C19.028 18.7846 18.7846 19.028 18.4784 19.1549C18.4012 19.1868 18.284 19.2163 18.0433 19.2327C17.7958 19.2496 17.4762 19.25 17 19.25C16.5238 19.25 16.2042 19.2496 15.9567 19.2327C15.716 19.2163 15.5988 19.1868 15.5216 19.1549C15.2154 19.028 14.972 18.7846 14.8452 18.4784C14.8132 18.4012 14.7837 18.284 14.7673 18.0433C14.7504 17.7958 14.75 17.4762 14.75 17V7C14.75 6.5238 14.7504 6.20421 14.7673 5.95674C14.7837 5.71602 14.8132 5.5988 14.8452 5.52165C14.972 5.21536 15.2154 4.97202 15.5216 4.84515Z"
                            fill="#3F3F79"
                        />
                    </svg>
                )}
                <span>حالت لایو</span>
            </button>
        </div>
    );
};

export default LiveMode;