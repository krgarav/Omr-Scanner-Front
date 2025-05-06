import axios from "axios";
import { post, del, get, put, postWithFormData } from "./api_helper";
import * as url from "./url_helper";

// Create Class
export const fetchAllTemplate = async () => {
  const urls = await   url.getUrls();
  const endpoint = urls.GET_ALL_TEMPLATE;
  return await get(endpoint);
};
export const createTemplate = async (data) => {
  const urls = await  url.getUrls();
  const endpoint = urls.CREATE_TEMPLATE;
  return await post(endpoint, data);
};

export const deleteTemplate = async (id) => {
  const urls = await  url.getUrls();
  const endpoint = `${urls.DELETE_TEMPLATE}?Id=${id}`;
  return await del(endpoint);
};

export const getLayoutDataById = async (id) => {
  const urls = await  url.getUrls();
  const endpoint = `${urls.GET_LAYOUT_DATA}?Id=${id}`;
  return await get(endpoint);
};

export const sendFile = async (data) => {
  const urls = await  url.getUrls();
  const endpoint = urls.SEND_FILE;
  return await postWithFormData(endpoint, data);
};

export const getSampleData = async () => {
  const urls = await  url.getUrls();
  const endpoint = urls.GET_SCANNED_IMAGE;
  return await get(endpoint);
};

export const getTemplateImage = async (path) => {
  const urls = await  url.getUrls();
  const endpoint = `${urls.GET_TEMPLATE_IMAGE}?filePath=${path}`;
  return await get(endpoint);
};

export const getTemplateCsv = async (path) => {
  const urls = await  url.getUrls();
  const endpoint = `${urls.GET_TEMPLATE_CSV}?csvPath=${path}`;
  return await get(endpoint);
};

export const cancelScan = async () => {
  const urls = await  url.getUrls();
  const endpoint = urls.CANCEL_SCAN;
  return await get(endpoint);
};

export const checkJobStatus = async (id) => {
  const urls = await  url.getUrls();
  const endpoint = `${urls.CHECK_DELETE_TEMPLATE}?Id=${id}`;
  return await get(endpoint);
};