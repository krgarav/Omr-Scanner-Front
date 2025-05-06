import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"

// Create Class

export const fetchProcessData = async () => {
    const urls = await  url.getUrls();
    return get(urls.GET_PROCESS_24_PAGE_DATA);
  };
  
  export const scanFiles = async () => {
    const urls = await  url.getUrls();
    return post(urls.SCAN_24_PAGE_FILES );
  };
  
  export const refreshScanner = async () => {
    const urls = await  url.getUrls();
    return get(urls.REFRESH_SCANNER);
  };
