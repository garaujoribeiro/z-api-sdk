import axios, { type AxiosInstance, type AxiosRequestConfig, isAxiosError } from "axios";
import {
  APIConnectionError,
  APITimeoutError,
  makeApiError,
  ZAPIError,
} from "./errors.js";
import type { QueryParams, RequestArgs } from "./types.js";

export const DEFAULT_BASE_URL = "https://api.z-api.io";
export const DEFAULT_TIMEOUT = 60_000;
export const DEFAULT_MAX_RETRIES = 2;

type Method = "get" | "post" | "put" | "delete";

export interface HttpClientConfig {
  /** Fully-formed base URL that request paths are resolved against. */
  baseURL: string;
  /** Default headers applied to every request. */
  headers?: Record<string, string>;
  timeout?: number;
  maxRetries?: number;
}

export class HttpClient {
  readonly baseURL: string;
  private readonly axios: AxiosInstance;
  private readonly maxRetries: number;

  constructor(config: HttpClientConfig) {
    this.baseURL = config.baseURL;
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;

    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: config.timeout ?? DEFAULT_TIMEOUT,
      headers: config.headers ?? {},
    });
  }

  get<T>(path: string, args: RequestArgs = {}): Promise<T> {
    return this.request<T>("get", path, args);
  }

  post<T>(path: string, args: RequestArgs = {}): Promise<T> {
    return this.request<T>("post", path, args);
  }

  put<T>(path: string, args: RequestArgs = {}): Promise<T> {
    return this.request<T>("put", path, args);
  }

  delete<T>(path: string, args: RequestArgs = {}): Promise<T> {
    return this.request<T>("delete", path, args);
  }

  private async request<T>(method: Method, path: string, args: RequestArgs): Promise<T> {
    const config: AxiosRequestConfig = {
      method,
      url: path,
      data: args.body,
      params: cleanQuery(args.query),
      headers: args.headers,
      signal: args.signal,
    };
    if (args.timeout !== undefined) config.timeout = args.timeout;

    const maxRetries = args.maxRetries ?? this.maxRetries;
    let attempt = 0;

    while (true) {
      try {
        const response = await this.axios.request<T>(config);
        return response.data;
      } catch (err) {
        const normalized = this.normalizeError(err);
        if (attempt < maxRetries && isRetryable(normalized)) {
          attempt += 1;
          await delay(backoffMs(attempt));
          continue;
        }
        throw normalized;
      }
    }
  }

  private normalizeError(err: unknown): ZAPIError {
    if (err instanceof ZAPIError) return err;

    if (isAxiosError(err)) {
      if (err.response) {
        const requestId = headerValue(err.response.headers, "x-request-id");
        return makeApiError(err.response.status, err.response.data, requestId);
      }
      if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
        return new APITimeoutError(err);
      }
      return new APIConnectionError(err.message, err);
    }

    return new APIConnectionError(
      err instanceof Error ? err.message : "Unknown error.",
      err,
    );
  }
}

function cleanQuery(query?: QueryParams): QueryParams | undefined {
  if (!query) return undefined;
  const out: QueryParams = {};
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) out[key] = value;
  }
  return out;
}

function isRetryable(err: ZAPIError): boolean {
  if (err instanceof APIConnectionError) return true;
  if (err instanceof Error && "status" in err) {
    const status = (err as { status: number }).status;
    return status === 429 || status >= 500;
  }
  return false;
}

function backoffMs(attempt: number): number {
  const base = Math.min(1000 * 2 ** (attempt - 1), 8000);
  return base + Math.random() * 250;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function headerValue(headers: unknown, name: string): string | undefined {
  if (headers && typeof headers === "object") {
    const value = (headers as Record<string, unknown>)[name];
    if (typeof value === "string") return value;
  }
  return undefined;
}
