import { render } from '@testing-library/react';

import Turn from './turn';

describe('Turn', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<Turn />);
        expect(baseElement).toBeTruthy();
    });
});
