import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"

// Create Class

export const totalScanning = async () => {
   const token = localStorage.getItem("token")
  const urls = await url.getUrls();
  const endpoint = urls.TOTAL_SCANNING;
  return await get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
};
export const accuracyPercentage = async () => {
    const token = localStorage.getItem("token")
  const urls = await url.getUrls();
  const endpoint = urls.ACCURACY_RATE;
  return await get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
};