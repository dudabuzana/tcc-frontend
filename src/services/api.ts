import axios, { AxiosRequestConfig } from "axios";

const config = () => {
  let config: AxiosRequestConfig = {
    baseURL: "http://localhost:5050/",
  };
  const token = localStorage.getItem("token");
  if (token) {
    console.log(token);
    config.headers = {
      authorization: `Bearer ${token}`,
    };
  }
  return config;
};

const api = axios.create(config());

export { api };
