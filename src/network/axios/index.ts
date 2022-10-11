import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { axiosBaseOptions } from '@/network/axios/axios-setup'

import type { AxiosDownload, Upload, UrlDownload } from '@/network/axios/type'

class MyAxios {
  private readonly axiosInstance: AxiosInstance
  constructor(options: AxiosRequestConfig) {
    this.axiosInstance = axios.create(options)
    this.initInterceptors()
  }

  private initInterceptors() {
    // Request interception The encryption processing of uploaded data is configured here
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        //The access-token part of headers is added to the request interception
        const token: string | null = localStorage.getItem('token')
        if (token) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          config.headers['access-token'] = token
        }
        console.log(`Config information of this request:`, config)
        return config
      },
      (error) => {
        console.log(`Axios request interception part of the error`, error)
        return Promise.reject(error)
      }
    )

    //Response interception The data responded from the interface is processed here, such as decryption, etc. The time occurs before then catch
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // resBaseInfo returns a basic format for the interface, such as the basic request return body of resBaseInfo imported above. The basic return body consists of rsCode, rsCause and data.
        const { data } = response
        console.log('data', data)
        if (data.rsCode !== 0) {
          alert(`${data.rsCause}`)
          return Promise.reject(data.data)
          //Assume that the background error information is placed in the data here to modify according to the situation
        }
        if (data instanceof Blob) {
          //Compatible with the file download processing below
          return response
        } else {
          return data.data
          //Because the default generic type encapsulated below is defined by default to data under resBaseInfo under data under response
        }
      },
      (error: AxiosError) => {
        console.log('An error occurred in the response interception part of axios, Error Message: ', error)

        //Need to prompt for errors?
        /*    if(error?.response){
              switch (error.response.status){
                  case 400:
                      console.log('Bad Request');
                      break;
                  case 401:
                      console.error('Unauthorized Access');
                      break;
                  case 404:
                      console.error('Resource Not Found');
                  default:
                      Message.error('Error Occured While Connecting With Server.');
              }
          }*/

        return Promise.reject(error)
      }
    )
  }

  get<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.get(url, { params: data })
  }

  post<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.post(url, data)
  }

  put<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.put(url, data)
  }

  delete<T = any>(url: string, data?: object): Promise<T> {
    return this.axiosInstance.delete(url, data)
  }

  upload<T = any>(params: Upload): Promise<T> {
    const { url, file, controller, onUploadProgress } = params
    return this.axiosInstance.post(url, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      signal: controller ? controller.signal : undefined, //It can be canceled for file upload, just call controller.abort() externally.
    })
  }

  axiosDownload(params: AxiosDownload): void {
    const { url, data, controller, fileName, onDownloadProgress } = params
    this.axiosInstance
      .get<Blob>(url, {
        params: data,
        responseType: 'blob',
        onDownloadProgress,
        signal: controller ? controller.signal : undefined, //It can be canceled for file download, just call controller.abort() externally. https://axios-http.com/docs/cancellation
      })
      .then((res) => {
        const blob = new Blob([res.data])
        const a = document.createElement('a')
        a.style.display = 'none'
        if (fileName) {
          a.download = fileName
        } else {
          //This needs to be intercepted from 'content-disposition' according to the actual situation, which is not necessarily correct
          a.download = decodeURIComponent(
            res.headers['content-disposition'].split(';').slice(-1)[0].split('=')[1].replaceAll('"', '') //For the case of using encodeURI() or encodeURIComponent() to transcode the file name in Chinese, decode it here
          )
        }
        a.href = URL.createObjectURL(blob)
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(a.href)
        document.body.removeChild(a)
      })
  }

  urlDownload(params: UrlDownload) {
    const { fileName, serveBaseUrl, fileUrl } = params
    const a = document.createElement('a')
    a.style.display = 'none'
    a.download = fileName
    a.href = serveBaseUrl ? `${serveBaseUrl}${fileUrl}` : fileUrl
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(a.href) // release the URL object
    document.body.removeChild(a)
  }
}

export const request = new MyAxios(axiosBaseOptions)
