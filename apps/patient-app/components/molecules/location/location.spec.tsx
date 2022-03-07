import { render } from '@testing-library/react';

import Location from './location';

describe('Card', () => {
    it('should render successfully', () => {
        const { baseElement } = render(
            <Location items={[{ id: 1, name: 'کدپیگیری', value: '123' }]} />
        );
        expect(baseElement).toBeTruthy();
    });
});
