export const addCommaPrice = (str: string) => {
    if (!str) return false;
    let price = str.toString();
    const objRegex = new RegExp('(-?[0-9]+)([0-9]{3})');
    while (objRegex.test(price)) {
        price = price.replace(objRegex, '$1,$2');
    }
    return price;
};

export default addCommaPrice;
