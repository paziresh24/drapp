import { useQuery } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

interface AverageWaitingTimeParams {
  slug: string;
  start_date?: string;
  end_date?: string;
}

export const averageWaitingTime = async (params: AverageWaitingTimeParams) => {
  return await apiGatewayClient.get(`/v1/feedbacks/average-waiting-time`, { params });
};

export const useAverageWaitingTime = (params: AverageWaitingTimeParams, option?:Record<string,string>) =>
  useQuery(['averageWaitingTime', params], () => averageWaitingTime(params), { ...option });
