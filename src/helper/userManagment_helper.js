import axios from "axios";
import { post, del, get, put } from "./api_helper";
import * as url from "./url_helper";

// Create Class
export const createUser = async (data) => {
  const { name, email, cont, role, pwd } = data;
  const urls = await url.getUrls();
  return post(
    `${urls.CREATE_USER}?name=${name}&email=${email}&cont=${cont}&role=${role}&pwd=${pwd}`
  );
};

export const updateUser = async (data) => {
  const urls = await url.getUrls();
  return post(urls.UPDATE_USER, data);
};

export const removeUser = async (id) => {
  const urls = await url.getUrls();
  return del(`${urls.DELETE_USER}?id=${id}`);
};

export const fetchAllUsers = async () => {
  const urls = await url.getUrls();
  return get(urls.GET_USERS);
};

export const getUserRoles = async () => {
  const urls = await url.getUrls();
  return get(urls.GET_USER_ROLES);
};

export const login = async (uname, pwd) => {
  const urls = await url.getUrls();
  return get(`${urls.LOGIN}?uname=${uname}&pwd=${pwd}`);
};
