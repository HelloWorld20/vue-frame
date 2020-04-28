// 接口请求封装
import axios, { Method, AxiosRequestConfig } from "axios";

const http = axios.create();

http.interceptors.response.use(
  function(res) {
    if (res.status === 200 || res.status === 304) {
      return res.data;
    }
    return Promise.reject(res);
  },
  function(err) {
    return Promise.reject(err);
  }
);

export const fetch = function(
  method: Method,
  url: string,
  options: AxiosRequestConfig
) {
  return http({
    method,
    url,
    ...options
  });
};

export const get = function(url: string, options: AxiosRequestConfig) {
  return fetch("GET", url, options);
};

export const post = function(url: string, options: AxiosRequestConfig) {
  return fetch("POST", url, options);
};
