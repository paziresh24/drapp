export const convertTimestampToDate = (time: number) => {
    const date = new Date(time * 1000);
    return date.toLocaleDateString();
};

export default convertTimestampToDate;
