import axios from "axios";
import { post, del, get, put, postWithFormData, putWithFormData } from "./api_helper";
import * as url from "./url_helper";

// Create Class
export const fetchAllTemplate = async () => {
  const urls = await url.getUrls();
  const endpoint = urls.GET_ALL_TEMPLATE;
  return await get(endpoint);
};
export const createTemplate = async (templateName, image) => {
  const urls = await url.getUrls();
  const endpoint = `${urls.CREATE_TEMPLATE}?TempName=${templateName}`;

  const formData = new FormData();
  formData.append("ImgTemp", image);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return await post(endpoint, formData, config);
};

export const updateTemplate = async (FileName, image) => {
  const urls = await url.getUrls();
  const endpoint = `${urls.UPDATE_TEMPLATE}?FileName=${FileName}`;

  const formData = new FormData();
  formData.append("tempName", image);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return await putWithFormData(endpoint, formData, config);
};


export const deleteTemplate = async (id) => {
  const urls = await url.getUrls();
  const endpoint = `${urls.DELETE_TEMPLATE}?id=${id}`;
  return await del(endpoint);
};

export const getLayoutDataById = async (id) => {
  const urls = await url.getUrls();
  const endpoint = `${urls.GET_LAYOUT_DATA}?id=${id}`;
  return await get(endpoint);
};

export const sendFile = async (data) => {
  const urls = await url.getUrls();
  const endpoint = urls.SEND_FILE;
  return await postWithFormData(endpoint, data);
};

export const getSampleData = async () => {
  const urls = await url.getUrls();
  const endpoint = urls.GET_SCANNED_IMAGE;
  return await get(endpoint);
};

export const getTemplateImage = async (path) => {
  const urls = await url.getUrls();
  const endpoint = `${urls.GET_TEMPLATE_IMAGE}?filePath=${path}`;
  return await get(endpoint);
};

export const getTemplateCsv = async (path) => {
  const urls = await url.getUrls();
  const endpoint = `${urls.GET_TEMPLATE_CSV}?csvPath=${path}`;
  return await get(endpoint);
};

export const cancelScan = async () => {
  const urls = await url.getUrls();
  const endpoint = urls.CANCEL_SCAN;
  return await get(endpoint);
};

export const checkJobStatus = async (id) => {
  const urls = await url.getUrls();
  const endpoint = `${urls.CHECK_DELETE_TEMPLATE}?Id=${id}`;
  return await get(endpoint);
};

export const getBaseURL = async (id) => {
  const urls = await url.getUrls();
  const endpoint = `${urls.MAIN_URL}`;
  return await get(endpoint);
};
