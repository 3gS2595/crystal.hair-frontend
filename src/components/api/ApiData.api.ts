import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

type Json = boolean | number | string | null | { [key: string]: Json } | Array<Json>;
type User = {
  id: string;
  title: string;
  date: string;
  url: string;
}

export default class ApiDataService {
    private axiosInstance: AxiosInstance

    constructor () {
      this.axiosInstance = axios.create({
        baseURL: 'http://192.168.1.180:3000'
      })
    }

    private async axiosCall<T> (config: AxiosRequestConfig) {
      try {
        const { data } = await this.axiosInstance.request<T>(config)
        return [null, data]
      } catch (error) {
        return [error]
      }
    }

    async getRss () {
      return this.axiosCall<User>({ method: 'get', url: '/rsses' })
    }
}
export const rssService = new ApiDataService().getRss()
