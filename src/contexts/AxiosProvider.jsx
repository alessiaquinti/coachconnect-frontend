"use client";

import { createContext, useContext, useEffect } from "react";
import axios from "axios";

const getBaseURL = () => {
  return import.meta.env.VITE_API_URL + "/coachconnect";
};


const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const AxiosContext = createContext(axiosInstance);

export default function AxiosProvider({ children }) {
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        console.error(
          "Axios response error:",
          error.response?.status,
          error.config?.url,
          error.message
        );

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
}

export const useAxios = () => useContext(AxiosContext);
