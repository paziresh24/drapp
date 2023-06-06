interface Props {
    timestamp: number;
    numberDay: number;
    currentTime: number;
}

export const isAfterPastDaysFromTimestamp = ({ numberDay, timestamp, currentTime }: Props) => {
    const numDaysInSecond = timestamp + 60 * 60 * 24 * numberDay;

    return currentTime > numDaysInSecond;
};

export default isAfterPastDaysFromTimestamp;
