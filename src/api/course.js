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

// Get course pricing
export const getCoursePricingAPI = async (params) => {
  return await getMethodCall(`${config.api.API_URL}/course-pricing-duration/get-pricing?courseId=${params.courseId}&expand=${params.expand}`);
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

export const getCourseDetailAPI = async (params) => {
  return await getMethodCall(`${config.api.API_URL}/course-categories/course-details?courseId=${params.courseId}&courseStatus=${params.courseStatus}`);
};
// ----------------------------------- Content APIs - Tab 3 ------------------------------------------------

// A) FOLDER APIs
// Create folder - Parent 
export const createFolderAPI = async (payload, courseId, contentType) => {
  return await postMethodCall(`${config.api.API_URL}/course-content/create-folder?courseId=${courseId}`, payload, contentType);
};

// Get all folders by Course ID
export const getAllFoldersByCourseIDAPI = async (courseId) => {
  return await getMethodCall(`${config.api.API_URL}/course-content/list-folders?courseId=${courseId}`);
};

// Get all folders by Course ID 
export const getConetntDataByCourseIDAPI = async (courseId, folderId = 0) => {
  if(!folderId) folderId = 0;
  return await getMethodCall(`${config.api.API_URL}/course-content/list-contents?folderId=${folderId}&page=0&size=20&courseId=${courseId}&folderDepth=1`);
};


// B) VIDEO APIs
// Initiate video upload - Get presigned URLs
export const initiateVideoUploadAPI = async (payload, courseId, contentType) => {
  return await postMethodCall(`${config.api.API_URL}/course-content/uploads-initiate?courseId=${courseId}`, payload, contentType);
};

// Complete video upload
export const completeVideoUploadAPI = async (payload, courseId, contentType) => {
  return await postMethodCall(`${config.api.API_URL}/course-content/uploads-complete?courseId=${courseId}`, payload, contentType); 
};


// C) PUBLISH
// Publish Course
// http://65.1.63.20:8080/api/v1/course-content/publish-course?courseId=80006&userId=101
export const publishCourseAPI = async (courseId, contentType) => {
  return await postMethodCall(`${config.api.API_URL}/course-content/publish-course?courseId=${courseId}`, contentType);
}