import axios from 'axios';

export const getLatestVersion = async () => {
    return await axios.get(`pwa-versions/latest.json`);
};
