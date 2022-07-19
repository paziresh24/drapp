import axios from 'axios';

export const getLatestVersion = async () => {
    const { data } = await axios.get(`pwa-versions/latest.json`);
    return data;
};
