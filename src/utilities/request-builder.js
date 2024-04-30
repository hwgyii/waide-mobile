import axios from "axios";
import { get } from "lodash";

import { getCurrentSession } from "./local-storage-manager";

//@ Base utilities
const getBody = (options) => {
  return get(options, "body", {});
}

const buildAuthenticatedHeaders = async () => {
  try{
    const currentSession = await getCurrentSession();

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

export const executeAuthenticatedPostRequest = async (url, options={}) => {
  const headers = await buildAuthenticatedHeaders();
  return axios.post(url, getBody(options), { headers });
}

export const executeAuthenticatedGetRequest = async (url) => {
  const headers = await buildAuthenticatedHeaders();
  return await axios.get(url, { headers });
}

export const executeAuthenticatedDeleteRequest = async (url) => {
  const headers = await buildAuthenticatedHeaders();
  return await axios.delete(url, { headers });
}

export const executeAuthenticatedPatchRequest = async (url, options={}) => {
  const headers = await buildAuthenticatedHeaders();
  return axios.patch(url, getBody(options), { headers });
}