import config from '../config';
import { getMethodCall, postMethodCall } from './apiHandler';

export const authenticateAPI = async (payload, orgId) => {
  return await postMethodCall(`${config.api.API_URL}/auth`, payload, orgId);
};