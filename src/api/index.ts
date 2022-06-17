import axios, { AxiosRequestConfig, AxiosInstance, AxiosPromise } from "axios";
import promise from "promise";
import { API_ROOT } from "../constants/api.constant";

import { USER_TOKEN_LOCAL_STORAGE } from "../constants/auth.constants";

// Add a request interceptor
export const axiosInstance: AxiosInstance = axios.create();
let serverIP = API_ROOT;

// Intercepting all API requests
axiosInstance.interceptors.request.use(
  async function (config: AxiosRequestConfig) {
    // If the header does not contain the token and the url not public, redirect to login
    const accessToken = localStorage.getItem(USER_TOKEN_LOCAL_STORAGE);

    if (config.headers && !config.headers["Content-Type"])
      config.headers["Content-Type"] = "application/json";
    // Injecting the API server IP
    if (config?.url?.startsWith("/api")) {
      config.url = serverIP + config.url.replace("/api", "");
    }
    //if token is found add it to the header
    if (accessToken && config.headers)
      config.headers["Authorization"] = "Bearer " + accessToken;
    return config;
  },
  function (error: any) {
    return promise.reject(error);
  }
);

export const injectTokenInHeaders = async (
  headers: { Authorization?: string } = {}
) => {
  // TODO: refresh token
  let accessToken = localStorage.getItem(USER_TOKEN_LOCAL_STORAGE);

  if (accessToken) headers["Authorization"] = "Bearer " + accessToken;
  return headers;
};

// config should be an object
export const sendAxiosRequest = async (paramters: {
  url: string;
  method: string;
  body?: {};
  query?: {};
  actions?: any | { apiCallSuccess: any; nullifyToast: any; apiCallFail: any };
  headers?: any;
}) => {
  const {
    url,
    method = "GET",
    body = {},
    query = {},
    actions,
    headers = {}
  } = paramters;
  let clonedQuery: any = { ...query };

  let clonedHeaders = await injectTokenInHeaders(headers);

  let requestPromise: AxiosPromise;

  switch (method) {
    case "POST":
      requestPromise = axiosInstance.post(url, body, {
        params: clonedQuery,
        headers: clonedHeaders
      });
      break;

    case "GET":
      requestPromise = axiosInstance.get(url, {
        params: clonedQuery,
        headers: clonedHeaders
      });
      break;

    case "PATCH":
      requestPromise = axiosInstance.patch(url, body, {
        params: clonedQuery,
        headers: clonedHeaders
      });
      break;

    case "DELETE":
      requestPromise = axiosInstance.delete(url, {
        params: clonedQuery,
        headers: clonedHeaders
      });
      break;

    default:
      throw new Error("UNKNOWN HTTP METHOD:: " + method);
  }

  try {
    const res = await requestPromise;

    if (actions?.apiCallSuccess) {
      actions.apiCallSuccess(res?.data);
      if (actions.nullifyToast)
        setTimeout(() => {
          actions.nullifyToast();
        }, 3000);
    }
    return res;
  } catch (err: any) {
    let error_message =
      err?.response?.data?.errors?.full_messages?.reduce(
        (acc: string, curr: string) => acc + "\n" + curr,
        ""
      ) || err?.message;
    if (Array.isArray(err?.response?.data?.errors)) {
      error_message = err?.response?.data?.errors?.reduce(
        (acc_1: string, curr_1: any) => {
          if (curr_1 && curr_1.hasOwnProperty("detail"))
            return acc_1 + "\n" + curr_1["detail"];
          else return acc_1 + "\n" + curr_1;
        },
        ""
      );
    }
    err.custom_message = error_message;
    if (actions?.apiCallFail) {
      actions.apiCallFail(err);
      if (actions.nullifyToast)
        setTimeout(() => {
          actions.nullifyToast();
        }, 3000);
    }
    if (err?.response?.status == 401) {
      localStorage.clear();
      throw err;
    } else {
      throw err;
    }
  }
};
