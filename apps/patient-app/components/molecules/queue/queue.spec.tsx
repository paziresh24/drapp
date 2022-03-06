import { render } from '@testing-library/react';

import { QueryClientProvider } from 'react-query';
import Queue from './queue';
import { queryClient } from '../../../pages/_app';
describe('Queue', () => {
    it('should render successfully', () => {
        const { baseElement } = render(
            <QueryClientProvider client={queryClient}>
                <Queue bookId="123" />
            </QueryClientProvider>
        );
        expect(baseElement).toBeTruthy();
    });
});
