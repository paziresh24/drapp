import { render } from '@testing-library/react';

import Location from './location';

describe('Location', () => {
    it('should lat and lng in url', () => {
        const [lat, lng] = [31.885828, 54.348932];
        const { container } = render(
            <Location
                address="آدرس: یزد، میدان مهدیه، بلوار آیت الله طالقانی، ساختمان نظام پزشکی طبقه دوم، واحد 21"
                lat={lat}
                lng={lng}
            />
        );
        expect(container.querySelector('a').href).toBe(
            `https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`
        );
    });
    it('should show address', () => {
        const address =
            'آدرس: یزد، میدان مهدیه، بلوار آیت الله طالقانی، ساختمان نظام پزشکی طبقه دوم، واحد 21';

        const { container } = render(
            <Location address={address} lat={31.885828} lng={54.348932} />
        );
        expect(container.querySelector('span').innerHTML).toBe(address);
    });
});
