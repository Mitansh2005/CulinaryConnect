/**
 * apiClient — single axios instance for the entire app.
 *
 * The request interceptor automatically attaches the Firebase Bearer token
 * to every outgoing request so individual hooks/pages never have to do it.
 */
import axios from "axios";
import { getFreshIdToken } from "@/firebase/authUtils";
import { baseUrl } from "@/constants/constants";

const apiClient = axios.create({
  baseURL: baseUrl,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getFreshIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
