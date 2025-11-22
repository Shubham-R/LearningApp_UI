import config from '../config';
import { objectToQueryString } from '../helpers/common';
import { getMethodCall, patchMethodCall, postMethodCall, postMultipartCall, putMethodCall } from './apiHandler';

// Get all courses
export const getCourseListAPI = async (params) => {
  return await getMethodCall(`${config.api.API_URL}/course-categories/courses`);
};

// Create draft course
export const createDraftCourseAPI = async (payload, contentType) => {
  return await postMethodCall(`${config.api.API_URL}/course-categories/create-course-categories`, payload, contentType);
};

// Get particular course details
export const getCourseDetailsAPI = async (payload, contentType) => {
  return await postMethodCall(`${config.api.API_URL}/course-categories/draft-course`, payload, contentType);
};

// Get all categories
export const getAllCategoriesAPI = async (params) => {
  return await getMethodCall(`${config.api.API_URL}/course-categories`);
};

// Update draft course
export const updateDraftCourseAPI = async (payload, contentType) => {
  return await postMethodCall(`${config.api.API_URL}/course-categories/update-course-categories`, payload, contentType);
};

// Upload course Image
export const updateCourseImageAPI = async (payload) => {
  return await postMultipartCall(`${config.api.API_URL}/course-categories/upload-image`, payload);
};

// ----------------------------------- Price APIs - Tab 2 -------------------------------------------------

// Create Pricing
export const createPricingAPI = async (payload, contentType) => {
  return await postMethodCall(`${config.api.API_URL}/course-pricing-duration/create-pricing`, payload, contentType);
};

// Update price
export const updatePriceAPI = async (payload, contentType) => {
  return await putMethodCall(`${config.api.API_URL}/course-pricing-duration/update-pricing`, payload, contentType);
};

// ----------------------------------- Content APIs - Tab 3 ------------------------------------------------

// Create folder - Parent 
export const createFolderAPI = async (payload, courseId, contentType) => {
  return await postMethodCall(`${config.api.API_URL}/course-content/create-folder?courseId=${courseId}`, payload, contentType);
};

// Get all folders by Course ID
export const getAllFoldersByCourseIDAPI = async (courseId) => {
  return await getMethodCall(`${config.api.API_URL}/course-content/list-folders?courseId=${courseId}`);
};