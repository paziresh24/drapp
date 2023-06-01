export const convertTimestamoToDate = (time: number) => {
    const date = new Date(time * 1000);
    return date.toLocaleDateString();
};

export default convertTimestamoToDate;
