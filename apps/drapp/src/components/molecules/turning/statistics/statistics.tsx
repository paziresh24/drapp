import { Skeleton } from '@mui/material';
import { TurningIcon } from '@paziresh24/shared/icon';

interface Props {
    data: any[];
    loading: boolean;
}

const Statistics = ({ data, loading }: Props) => {
    const statisticsTurns = {
        allPatientsToday: () => {
            return data.length;
        },
        activePatientsToday: () => {
            return data.filter((item: any) =>
                item.type === 'prescription'
                    ? !item.finalized
                    : !item.prescription?.finalized && item.book_status !== 'visited'
            )?.length;
        },
        visitedPatientsToday: () => {
            return data.filter((turn: any) =>
                turn.type === 'prescription'
                    ? turn.finalized
                    : turn.prescription?.finalized ?? turn.book_status === 'visited'
            )?.length;
        }
    };
    if (loading)
        return (
            <div className="hidden lg:flex space-s-6 justify-center pt-5">
                <Skeleton width={200} height={80} />
                <Skeleton width={200} height={80} />
                <Skeleton width={200} height={80} />
            </div>
        );
    return (
        <div className="hidden lg:flex space-s-6 justify-center mb-3 pt-8">
            <div className="h-14 rounded-lg flex justify-center items-center px-4 bg-[#ebeff8]">
                <TurningIcon color="#000" />
                <span className="font-bold mr-2 ml-2">تعداد بیماران امروز</span>
                <span className="font-medium">{statisticsTurns.allPatientsToday()} بیمار</span>
            </div>
            <div className="h-14 rounded-lg flex justify-center items-center px-4 bg-[#ebeff8]">
                <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.75 12C3.75 7.44365 7.44365 3.75 12 3.75C16.5563 3.75 20.25 7.44365 20.25 12C20.25 16.5563 16.5563 20.25 12 20.25C7.44365 20.25 3.75 16.5563 3.75 12ZM12 2.25C6.61522 2.25 2.25 6.61522 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61522 17.3848 2.25 12 2.25ZM16.5303 9.53033C16.8232 9.23744 16.8232 8.76256 16.5303 8.46967C16.2374 8.17678 15.7626 8.17678 15.4697 8.46967L11 12.9393L9.53033 11.4697C9.23744 11.1768 8.76256 11.1768 8.46967 11.4697C8.17678 11.7626 8.17678 12.2374 8.46967 12.5303L10.4697 14.5303C10.6103 14.671 10.8011 14.75 11 14.75C11.1989 14.75 11.3897 14.671 11.5303 14.5303L16.5303 9.53033Z"
                        fill="#000"
                    />
                </svg>
                <span className="font-bold mr-2 ml-2">بیماران ویزیت شده</span>
                <span className="font-medium">{statisticsTurns.visitedPatientsToday()} بیمار</span>
            </div>
            <div className="h-14 rounded-lg flex justify-center items-center px-4 bg-[#ebeff8]">
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
                        d="M15.9466 3.86296C15.0496 3.75142 13.7844 3.75 12.0003 3.75H9.36429C8.71829 3.75 8.261 3.75021 7.91998 3.76649C7.56474 3.78345 7.4243 3.81587 7.37132 3.83671C6.71239 4.09582 6.40002 4.84996 6.68273 5.49911C6.70546 5.55131 6.78184 5.67354 7.02104 5.93673C7.25066 6.18938 7.57387 6.51287 8.03066 6.96967L10.2807 9.21967C10.5736 9.51256 10.5736 9.98744 10.2807 10.2803C9.98777 10.5732 9.51289 10.5732 9.22 10.2803L6.97 8.03033L6.95532 8.01565C6.51646 7.57679 6.16765 7.22799 5.911 6.9456C5.66108 6.67061 5.43613 6.39341 5.30749 6.09804C4.68553 4.66992 5.37276 3.0108 6.82238 2.44076C7.1222 2.32286 7.47728 2.28592 7.84845 2.2682C8.22961 2.25 8.72291 2.25 9.34358 2.25H9.36429H12.0003L12.058 2.25C13.7717 2.24998 15.1309 2.24997 16.1317 2.37443C17.1139 2.49657 18.0242 2.76512 18.5121 3.55566C18.6667 3.80623 18.7801 4.08002 18.848 4.36655C19.0619 5.27056 18.6082 6.1041 18.0001 6.88497C17.3804 7.68066 16.4192 8.64178 15.2075 9.85352L15.1667 9.89429L9.89462 15.1664C8.63308 16.4279 7.73943 17.3236 7.18405 18.0367C6.61019 18.7736 6.56933 19.1061 6.61237 19.2879C6.6432 19.4182 6.69475 19.5426 6.76505 19.6565C6.8632 19.8155 7.12722 20.0218 8.05404 20.137C8.95102 20.2486 10.2162 20.25 12.0003 20.25H14.6364C15.2824 20.25 15.7397 20.2498 16.0807 20.2335C16.4359 20.2165 16.5764 20.1841 16.6293 20.1633C17.2883 19.9042 17.6006 19.15 17.3179 18.5009C17.2952 18.4487 17.2188 18.3265 16.9796 18.0633C16.75 17.8106 16.4268 17.4871 15.97 17.0303L13.72 14.7803C13.4271 14.4874 13.4271 14.0126 13.72 13.7197C14.0129 13.4268 14.4878 13.4268 14.7807 13.7197L17.0307 15.9697L17.0452 15.9843C17.4842 16.4232 17.833 16.772 18.0897 17.0544C18.3396 17.3294 18.5645 17.6066 18.6932 17.902C19.3151 19.3301 18.6279 20.9892 17.1783 21.5592C16.8785 21.6771 16.5234 21.7141 16.1522 21.7318C15.771 21.75 15.2777 21.75 14.6571 21.75H14.6364H12.0003H11.9427C10.229 21.75 8.86976 21.75 7.86894 21.6256C6.88676 21.5034 5.97651 21.2349 5.48859 20.4443C5.33394 20.1938 5.22053 19.92 5.15271 19.6334C4.93872 18.7294 5.39247 17.8959 6.00061 17.115C6.62029 16.3193 7.58142 15.3582 8.79319 14.1465L8.83396 14.1057L14.106 8.83363C15.3676 7.57209 16.2612 6.67644 16.8166 5.96331C17.3905 5.22645 17.4313 4.89392 17.3883 4.71207C17.3575 4.58183 17.3059 4.45738 17.2356 4.34348C17.1375 4.18445 16.8734 3.97822 15.9466 3.86296Z"
                        fill="#000"
                    />
                </svg>
                <span className="font-bold mr-2 ml-2">بیماران باقی مانده</span>
                <span className="font-medium">{statisticsTurns.activePatientsToday()} بیمار</span>
            </div>
        </div>
    );
};

export default Statistics;
