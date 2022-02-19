import { render } from '@testing-library/react';

import Queue from './queue';

describe('TagStatus', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<Queue status="deleted" />);
        expect(baseElement).toBeTruthy();
    });
});
