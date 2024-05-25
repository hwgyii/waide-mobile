import * as requestBuilder from "./request-builder";
import { get } from "lodash";

export const getBaseUrl = () => {
  const NODE_ENV = get(process.env, "EXPO_NODE_ENV", "development");
  if (NODE_ENV === "development") {
    return "http://192.168.1.8:3000";
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

export const signUpBusiness = (options) => {
  const url = `${getBaseUrl()}/establishment/create`;
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

export const getInventories = () => {
  const url = `${getBaseUrl()}/inventory/me`;
  return requestBuilder.executeAuthenticatedGetRequest(url);
};

export const getMyEstablishment = () => {
  const url = `${getBaseUrl()}/establishment/me`;
  return requestBuilder.executeAuthenticatedGetRequest(url);
};

export const checkoutOrder = (options) => {
  const url = `${getBaseUrl()}/sales/create`;
  return requestBuilder.executeAuthenticatedPostRequest(url, options);
};

export const getIncompleteOrders = () => {
  const url = `${getBaseUrl()}/sales/incomplete`;
  return requestBuilder.executeAuthenticatedGetRequest(url);
};

export const onCompleteOrder = (options) => {
  const url = `${getBaseUrl()}/sales/complete/${get(options, "salesId")}`;
  return requestBuilder.executeAuthenticatedPatchRequest(url);
};

export const getEstablishmentTables =  () => {
  const url = `${getBaseUrl()}/tables/establishment`;
  return requestBuilder.executeAuthenticatedGetRequest(url);
};

export const updateTableAvailability = (options) => {
  const url = `${getBaseUrl()}/tables/establishment/update-availability/${get(options, "tableId")}`;
  return requestBuilder.executeAuthenticatedPatchRequest(url, options);
};

export const updateSettings = (options) => {
  const url = `${getBaseUrl()}/establishment/settings`;
  return requestBuilder.executeAuthenticatedPatchRequest(url, options);
};

export const updateInventory = (options) => {
  const url = `${getBaseUrl()}/inventory/update/${get(options, "inventoryId")}`;
  return requestBuilder.executeAuthenticatedPatchRequest(url, options);
};

export const deleteInventory = (options) => {
  const url = `${getBaseUrl()}/inventory/delete/${get(options, "inventoryId")}`;
  return requestBuilder.executeAuthenticatedDeleteRequest(url);
};

export const createInventory = (options) => {
  const url = `${getBaseUrl()}/inventory/create`;
  return requestBuilder.executeAuthenticatedPostRequest(url, options);
};

export const getAllEstablishmentOrders = (options) => {
  const url = `${getBaseUrl()}/sales/establishment`;
  return requestBuilder.executeAuthenticatedGetRequest(url);
};

export const deleteTable = (options) => {
  const url = `${getBaseUrl()}/tables/${get(options, "tableId")}`;
  return requestBuilder.executeAuthenticatedDeleteRequest(url);
};

export const updateTable = (options) => {
  const url = `${getBaseUrl()}/tables/${get(options, "tableId")}`;
  return requestBuilder.executeAuthenticatedPatchRequest(url, options);
};

export const createTable = (options) => {
  const url = `${getBaseUrl()}/tables/create`;
  return requestBuilder.executeAuthenticatedPostRequest(url, options);
};

export const getEstablishments = () => {
  const url = `${getBaseUrl()}/establishments`;
  return requestBuilder.executeAuthenticatedGetRequest(url);
};

export const getEstablishment = (options) => {
  const url = `${getBaseUrl()}/establishment/${get(options, "establishmentId")}`;
  return requestBuilder.executeAuthenticatedGetRequest(url);
};

export const getSalesToday = () => {
  const url = `${getBaseUrl()}/salesToday`;
  return requestBuilder.executeAuthenticatedGetRequest(url);
};

export const createDelivery = (options) => {
  const url = `${getBaseUrl()}/sales/delivery/create`;
  return requestBuilder.executeAuthenticatedPostRequest(url, options);
};

export const addReview = (options) => {
  const url = `${getBaseUrl()}/establishment/review/create`;
  return requestBuilder.executeAuthenticatedPostRequest(url, options);
};

export const getCustomerDeliveries = () => {
  const url = `${getBaseUrl()}/sales/deliveries`;
  return requestBuilder.executeAuthenticatedGetRequest(url);
};

export const accessOrdering = (options) => {
  const url = `${getBaseUrl()}/tables/access`;
  return requestBuilder.executeAuthenticatedPostRequest(url, options);
};