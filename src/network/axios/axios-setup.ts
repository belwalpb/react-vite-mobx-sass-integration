import { AxiosRequestConfig } from 'axios'

/** Define Axios Basic Configuration */
export const axiosBaseOptions: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL as string, //If cross-domain is configured locally, please modify .env.development VITE_API_BASE_URL to your replacement string such as '/api'
  timeout: 8000,
}
