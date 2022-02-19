import { render } from '@testing-library/react';

import TurnDetails from './turnDetails';

describe('Card', () => {
    it('should render successfully', () => {
        const { baseElement } = render(
            <TurnDetails items={[{ id: 1, name: 'کدپیگیری', value: '123' }]} />
        );
        expect(baseElement).toBeTruthy();
    });
});
