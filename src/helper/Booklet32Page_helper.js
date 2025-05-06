import axios from "axios";
import { post, del, get, put } from "./api_helper";
import * as url from "./url_helper";

// Create Class

export const fetchProcessData = async () => {
  const urls = await url.getUrls();
  return get(urls.GET_PROCESS_24_PAGE_DATA);
};

export const scanFiles = async (selectedValue, userId) => {
  const urls = await url.getUrls();
  return post(`${urls.SCAN_FILES}?Id=${selectedValue}&UserId=${userId}`);
};
export const printData = async (data) => {
  const urls = await url.getUrls();
  const endpoint = urls.PRINT_DATA;
  return await post(endpoint, data);
};

export const refreshScanner = async () => {
  const urls = await url.getUrls();
  return get(urls.REFRESH_SCANNER);
};

export const checkPrintData = async (layoutId) => {
  const urls = await url.getUrls();
  return get(`${urls.CHECK_PRINT}?LayoutId=${layoutId}`);
};

export const getDataByRowRange = async (startRow,endRow,LayoutId,UserId) => {
  const urls = await url.getUrls();
  return get(`${urls.GET_ROW_DATA}?startRow=${startRow}&endRow=${endRow}&LayoutId=${LayoutId}&UserId=${UserId}`);
};

export const getTotalExcellRow = async (LayoutId,UserId) => {
  const urls = await url.getUrls();
  return get(`${urls.GET_TOTAL_EXCEL_ROW}?LayoutId=${LayoutId}&UserId=${UserId}`);
};