// url_helper.js

import initializeUrls from "./InitializeURL";

let urlsPromise = initializeUrls();

export const getUrls = async () => {
  return urlsPromise;
};
