import axios, { AxiosError, AxiosInstance } from 'axios';

const BACKEND_URL = 'https://14.design.htmlacademy.pro';
const REQUEST_TIMEOUT = 5000;
const TOKEN_STORAGE_KEY = 'six-cities-token';

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const dropToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_STORAGE_KEY);

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
      const headers = (config.headers ?? {});
      headers['X-Token'] = token;
      config.headers = headers;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        dropToken();
      }

      return Promise.reject(error);
    }
  );

  return api;
};
