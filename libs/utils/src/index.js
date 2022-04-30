import queryString from 'query-string';

// convert string date to date  14001206 => 1400/12/06
export const strDateToDate = strDate => {
    const date = `${strDate.slice(0, 4)}/${strDate.slice(4, 6)}/${strDate.slice(6, 8)}`;
    return date;
};

export const isToday = date => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

export const convertTimeStampToFormattedTime = time => {
    const date = new Date(time * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeString = `${hours}:${minutes.toString().length === 1 ? `0${minutes}` : minutes}`;
    return timeString;
};

export const convertTimeStampToPersianDate = time => {
    return new Date(time * 1000).toLocaleDateString('fa');
};

export const formData = params => {
    let dt = new FormData();
    for (const [key, value] of Object.entries(params)) {
        dt.append(key, value);
    }
    return dt;
};

// convert 10000 to 10,000
export const addCommaPrice = str => {
    if (!str) return false;
    let price = str.toString();
    let objRegex = new RegExp('(-?[0-9]+)([0-9]{3})');
    while (objRegex.test(price)) {
        price = price.replace(objRegex, '$1,$2');
    }
    return price;
};

// is webview ?
export const isWebView = () => {
    const urlParams = queryString.parse(window.location.search);
    if (urlParams.isWebView === true || navigator.userAgent.includes('wv')) return true;
    return false;
};

// change persian number to english number
export const digitsFaToEn = number => {
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
        return number.replace(/[^0-9.]/g, w => {
            return id[w] || w;
        });
    }
};

// send event
export const sendEvent = (action, category, label) => {
    if (window.ga ?? false) {
        window.ga('create', 'UA-74836147-1', 'auto');

        window.ga('send', 'event', action, category, label);
        return true;
    } else return false;
};

export const extractTypeFromName = name => {
    if (name) {
        const types = [
            'gel',
            'drops',
            'ointment',
            'powder',
            'tablet',
            'syrup',
            'injection',
            'suspension',
            'cap',
            'inhaler',
            'insulin',
            'suppository',
            'supp',
            'lotion',
            'cream',
            'tab',
            'topical',
            'inj',
            'solution',
            'susp',
            'sol',
            'capsule',
            'vial'
        ];
        let type;
        types.forEach(item => {
            if (name.toLowerCase().replace(/ /g, '').includes(item)) {
                type = item;
            }
            return false;
        });

        return type;
    }
};

export const translateType = type => {
    if (type) {
        const types = {
            gel: 'ژل',
            drops: 'قطره',
            ointment: 'پماد',
            powder: 'پودر',
            tablet: 'قرص',
            syrup: 'شربت',
            injection: 'تزریقی',
            suspension: 'سوسپانسیون',
            cap: 'کپسول',
            inhaler: 'اسپری',
            insulin: 'انسولین',
            suppository: 'شیاف',
            supp: 'شیاف',
            lotion: 'لوسیون',
            cream: 'کرم',
            tab: 'قرص',
            topical: 'موضعی',
            inj: 'آمپول',
            solution: 'محلول',
            sol: 'محلول',
            susp: 'سوسپانسیون',
            capsule: 'کپسول',
            vial: 'آمپول'
        };
        return types[type.toLowerCase()];
    }
};
