import { render } from '@testing-library/react';

import TagStatus from './tagStatus';

describe('TagStatus', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<TagStatus status="deleted" />);
        expect(baseElement).toBeTruthy();
    });
});
