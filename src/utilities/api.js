import * as requestBuilder from "./request-builder";
import { get } from "lodash";

export const getBaseUrl = () => {
  const NODE_ENV = get(process.env, "EXPO_NODE_ENV", "development");
  if (NODE_ENV === "development") {
    return "http://192.168.100.151:3000";
  } else if (NODE_ENV === "staging") {
    const stagingUrl = get(process.env, "EXPO_STAGING_API_URL");

    if (stagingUrl) {
      return stagingUrl;
    } else {
      // eslint-disable-next-line no-throw-literal
      throw { message: "Missing STAGING-API url. Contact your app administrator." }    
    }
  }
}

//@ API ROUTES

export const signUp = (options) => {
  const url = `${getBaseUrl()}/user/create`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

export const logIn = (options) => {
  const url = `${getBaseUrl()}/user/login`;
  return requestBuilder.executeOpenPostRequest(url, options);
};

export const getUser = () => {
  const url = `${getBaseUrl()}/user/me`;
  return requestBuilder.executeAuthenticatedGetRequest(url);
};

export const checkoutOrder = (options) => {
  const url = `${getBaseUrl()}/sales/create`;
  return requestBuilder.executeAuthenticatedPostRequest(url, options);
};