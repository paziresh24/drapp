import { render } from '@testing-library/react';

import DoctorInfo from './doctorInfo';

describe('Card', () => {
    it('should render successfully', () => {
        const { baseElement } = render(
            <DoctorInfo firstName="امیرحسین" lastName="بیگی" expertise="پزشک عمومی" avatar="" />
        );
        expect(baseElement).toBeTruthy();
    });
});
