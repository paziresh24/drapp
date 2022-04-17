export const extractTypeFromName = (name: string): string | undefined => {
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
