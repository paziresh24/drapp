import { client } from '../client';

export const me = async () => {
  return await client.get(`/users/me`);
};
