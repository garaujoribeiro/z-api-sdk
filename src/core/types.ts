export interface ClientOptions {
  /** Z-API instance ID. Falls back to `ZAPI_INSTANCE_ID`. */
  instanceId?: string;
  /** Z-API instance token. Falls back to `ZAPI_TOKEN`. */
  token?: string;
  /** Account security token sent as the `Client-Token` header. Falls back to `ZAPI_CLIENT_TOKEN`. */
  clientToken?: string;
  /** API base URL. Defaults to `https://api.z-api.io`. */
  baseURL?: string;
  /** Per-request timeout in milliseconds. Defaults to 60000. */
  timeout?: number;
  /** Number of automatic retries on network/5xx/429 errors. Defaults to 2. */
  maxRetries?: number;
}

export interface PartnerClientOptions {
  /** Partner/integrator account token. Falls back to `ZAPI_PARTNER_TOKEN`. Sent as `Authorization: Bearer`. */
  partnerToken?: string;
  /** API base URL. Defaults to `https://api.z-api.io`. */
  baseURL?: string;
  /** Per-request timeout in milliseconds. Defaults to 60000. */
  timeout?: number;
  /** Number of automatic retries on network/5xx/429 errors. Defaults to 2. */
  maxRetries?: number;
}

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface RequestOptions {
  /** Query string parameters appended to the URL. */
  query?: QueryParams;
  /** Extra headers merged into the request. */
  headers?: Record<string, string>;
  /** Override the client timeout for this request (ms). */
  timeout?: number;
  /** Override the client retry count for this request. */
  maxRetries?: number;
  /** AbortSignal to cancel the request. */
  signal?: AbortSignal;
}

export interface RequestArgs extends RequestOptions {
  /** JSON request body. */
  body?: unknown;
}
