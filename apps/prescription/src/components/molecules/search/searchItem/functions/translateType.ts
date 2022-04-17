type Types = {
    [key: string]: string;
};

export const translateType = (type: string): string | undefined => {
    if (type) {
        const types: Types = {
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
