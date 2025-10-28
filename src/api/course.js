import config from '../config';
import { objectToQueryString } from '../helpers/common';
import { getMethodCall, patchMethodCall, postMethodCall } from './apiHandler';

export const getCourseListAPI = async (params) => {
  return await getMethodCall(`${config.api.API_URL}/course-categories/courses`);
};

export const createDraftCourseAPI = async (payload, contentType) => {
  return await postMethodCall(`${config.api.API_URL}/course-categories/create-course-categories`, payload, contentType);
};

