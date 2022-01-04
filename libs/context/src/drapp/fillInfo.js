import { createContext, useContext, useMemo, useState } from 'react';

const FillInfoContext = createContext();

const useFillInfo = () => {
    const context = useContext(FillInfoContext);
    if (!context) {
        throw new Error(`useDrApp must be used within a DrAppContext`);
    }

    return context;
};

const FillInfoProvider = props => {
    const [info, setInfo] = useState({
        McCode: '70784',
        NameInfo: {
            FirstName: 'سیدمرتضی',
            LastName: 'امامی العریضی',
            FirstNameNS: 'سیدمرتضی',
            LastNameNS: 'امامیالعریضی'
        },
        DegreeInfo: {
            Spec_DegreeFieldTitle: 'دکترای تخصصی (Ph.D) طب سنتی ایرانی',
            Spec_DateShamsi: '13940619',
            Spec_InstituteCityTitle: 'مشهد'
        },
        OfficePostalCodeInfo: [
            {
                Office_PostalCode: ''
            }
        ],
        OfficeTelInfo: [
            {
                Office_TelCode: '0',
                Office_Tel: '7381011-12'
            }
        ],
        OfficeAddressInfo: [
            {
                Office_ProvinceTitle: 'فارس',
                Office_CityTitle: 'شیراز',
                Office_Address: 'مرکز بهداشت شهدای انقلاب بلوار سیبویه',
                AddressType: 'مطب'
            }
        ]
    });

    const value = useMemo(() => [info, setInfo], [info]);
    return <FillInfoContext.Provider value={value} {...props} />;
};

export { useFillInfo, FillInfoProvider };
