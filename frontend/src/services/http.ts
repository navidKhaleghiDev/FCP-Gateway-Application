import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { SERVICE_CONFIG } from '@/services/config';

export enum StatusCode {
  BadRequest = 400,
  NotFound = 404,
  TooManyRequests = 429,
  InternalServerError = 500,
}

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Accept-Language': 'fa',
};

function getErrorMessage(data: unknown, fallback: string) {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const values = Object.values(data as Record<string, unknown>).flatMap((value) =>
      Array.isArray(value) ? value : [value]
    );
    const message = values.filter((value): value is string => typeof value === 'string').join(' • ');
    if (message) return message;
  }
  return fallback;
}

export class Http {
  private readonly instance: AxiosInstance;

  constructor(baseURL = SERVICE_CONFIG.apiUrl) {
    this.instance = axios.create({
      baseURL,
      timeout: SERVICE_CONFIG.requestTimeoutMs,
      headers: defaultHeaders,
    });
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<unknown>) => {
        const status = error.response?.status;
        const fallback = error.message || 'Request failed';
        const prefix = status ? `Request failed (${status})` : fallback;
        return Promise.reject(new Error(getErrorMessage(error.response?.data, prefix)));
      }
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
}

export const http = new Http();
