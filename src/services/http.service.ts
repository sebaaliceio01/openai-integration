import axios, { AxiosRequestConfig } from 'axios';

export class HttpService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await axios.get<T>(url, config);
    return response.data;
  }

  async post<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await axios.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await axios.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await axios.delete<T>(url, config);
    return response.data;
  }
}