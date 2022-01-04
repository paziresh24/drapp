import { client } from './client';

export const getLatestVersion = async () => {
    return await client.get(
        `${window.location.origin + process.env.PUBLIC_URL}/pwa-versions/latest.json`
    );
};
