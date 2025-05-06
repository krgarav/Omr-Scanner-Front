import axios from "axios";
import { post, del, get, put } from "./api_helper";
import * as url from "./url_helper";

export const createJob = async (payload) => {
    const urls = await  url.getUrls();
    return post(urls.CREATE_JOB, payload);
  };
  
  export const getJobs = async () => {
    const urls = await  url.getUrls();
    return get(urls.GET_ALL_JOBS);
  };
  
  export const deleteJob = async (id) => {
    const urls = await  url.getUrls();
    return del(`${urls.DELETE_JOB}?Id=${id}`);
  };
  
  export const assignJob = async (data) => {
    const urls = await  url.getUrls();
    return post(urls.ASSIGN_JOB, data);
  };
  
  export const getAssignedJob = async (id) => {
    const urls = await  url.getUrls();
    return get(`${urls.GET_ASSIGNED_JOB}?Id=${id}`);
  };
  
  export const getJobCount = async () => {
    const urls = await  url.getUrls();
    return get(urls.GET_JOB_COUNT);
  };
  
  export const startJob = async (data) => {
    const urls = await  url.getUrls();
    return post(urls.START_JOB, data);
  };
  
  export const finishJob = async (data) => {
    const urls = await  url.getUrls();
    return post(urls.FINISH_JOB, data);
  };
  
  export const getJobDetail = async (id) => {
    const urls = await  url.getUrls();
    return get(`${urls.GET_JOB_DETAIL}?Id=${id}`);
  };
  
  export const updateJob = async (payload) => {
    const urls = await  url.getUrls();
    return post(urls.UPDATE_JOB, payload);
  };