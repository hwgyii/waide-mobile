import axios from "axios";
import { get } from "lodash";

import { getCurrentSession } from "./local-storage-manager";

//@ Base utilities
const getBody = (options) => {
  return get(options, "body", {});
}

const buildAuthenticatedHeaders = () => {
  try{
    const currentSession = getCurrentSession();

    if (!currentSession) {
      // eslint-disable-next-line no-throw-literal
      throw { message:"Invalid request. Missing session details." }
    }
    
    return { "Authorization": `Bearer ${currentSession}` };
  } catch (error) {
    console.log(error);
  }
}

export const executeOpenPostRequest = (url, options) => {
    return axios.post(url, getBody(options), {headers: {"Access-Control-Allow-Origin": '*'}});
}

export const executeOpenGetRequest = (url) => {
  return axios.get(url, {Headers: {"Access-Control-Allow-Origin": "*"}});
}

export const executeOpenPatchRequest = (url, options) => {
  return axios.patch(url, getBody(options), {headers: {"Access-Control-Allow-Origin": '*'}});
}

export const executeAuthenticatedPostRequest = (url, options={}) => {
  return axios.post(url, getBody(options), { headers: buildAuthenticatedHeaders() });
}

export const executeAuthenticatedGetRequest = (url) => {
  return axios.get(url, { headers: buildAuthenticatedHeaders() });
}

export const executeAuthenticatedDeleteRequest = (url) => {
  return axios.delete(url, { headers: buildAuthenticatedHeaders() });
}

export const executeAuthenticatedPatchRequest = (url, options={}) => {
  return axios.patch(url, getBody(options), { headers: buildAuthenticatedHeaders() });
}