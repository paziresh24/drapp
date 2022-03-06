import { render } from '@testing-library/react';

import DoctorInfo from './doctorInfo';

describe('Doctor Info', () => {
    it('should show formatted firstName and lastName', () => {
        const { getByText } = render(
            <DoctorInfo
                firstName="امیرحسین"
                lastName="بیگی"
                expertise="پزشک عمومی"
                avatar="https://www.paziresh24.com/api/getImage/p24/search-men/d418ce9cfb1df336bad5b3c48bc03f1e.jpg"
            />
        );
        expect(getByText('امیرحسین بیگی')).toBeTruthy();
    });
    it('should show expertise', () => {
        const { getByText } = render(
            <DoctorInfo
                firstName="امیرحسین"
                lastName="بیگی"
                expertise="پزشک عمومی"
                avatar="https://www.paziresh24.com/api/getImage/p24/search-men/d418ce9cfb1df336bad5b3c48bc03f1e.jpg"
            />
        );
        expect(getByText('پزشک عمومی')).toBeTruthy();
    });
    it('should remove expertise container when not expertise', () => {
        const { container } = render(
            <DoctorInfo
                firstName="امیرحسین"
                lastName="بیگی"
                avatar="https://www.paziresh24.com/api/getImage/p24/search-men/d418ce9cfb1df336bad5b3c48bc03f1e.jpg"
            />
        );
        expect(container.querySelectorAll('span')[1]).toBeUndefined();
    });
});
