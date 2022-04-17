export const digitsFaToEn = (number: string | number): string | undefined => {
    const id = {
        '۰': '0',
        '۱': '1',
        '۲': '2',
        '۳': '3',
        '۴': '4',
        '۵': '5',
        '۶': '6',
        '۷': '7',
        '۸': '8',
        '۹': '9'
    };
    if (number ?? false) {
        return number.toString().replace(/[^0-9.]/g, (w: string) => {
            return id[w] || w;
        });
    }
};

export default digitsFaToEn;
