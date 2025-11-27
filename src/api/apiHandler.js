import axios from 'axios';

export const postMethodCall = async (url, data, orgId = '') => {
  try {
    let headers = {
      'Content-Type': 'application/json',
      "X-Tenant-ID": orgId
    }

    const apiResponse = await axios({
      method: 'post',
      url,
      data,
      headers
    });
    return { status: true, data: apiResponse };
  } catch (err) {
    return { status: false, apiResponse: err };
  }
};
export const postMultipartCall = async (url, data, orgId = '') => {
  try {
    let headers = {
      "X-Tenant-ID": orgId
    }

    const apiResponse = await axios({
      method: 'post',
      url,
      data,
      headers
    });

    return { status: true, data: apiResponse };
  } catch (err) {
    return { status: false, error: err };
  }
};
export const putMethodCall = async (url, data, contentType = 'application/json') => {
  try {
    const apiResponse = await axios({
      method: 'put',
      url,
      data,
      headers: {
        'Content-Type': contentType
      }
    });
    return { status: true, data: apiResponse.data.response };
  } catch (err) {
    return { status: false, apiResponse: err };
  }
};
export const patchMethodCall = async (url, data, contentType = 'application/json') => {
  try {
    const apiResponse = await axios({
      method: 'patch',
      url,
      data,
      headers: {
        'Content-Type': contentType
      }
    });
    return { status: true, data: apiResponse };
  } catch (err) {
    return { status: false, apiResponse: err };
  }
};
export const getMethodCall = async (url) => {
  try {
    const apiResponse = await axios({
      method: 'get',
      url: url
    });
    return { status: true, data: apiResponse };
  } catch (err) {
    return { status: false, apiResponse: err };
  }
};
