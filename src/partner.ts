import { DEFAULT_BASE_URL, HttpClient } from "./core/http.js";
import { ZAPIError } from "./core/errors.js";
import type { PartnerClientOptions, RequestOptions } from "./core/types.js";
import type {
  CreateInstanceParams,
  CreatedInstance,
  InstanceTarget,
  ListInstancesParams,
  PartnerInstance,
} from "./types/partners.js";

/**
 * Partner/integrator client for managing instances at the Z-API account level.
 *
 * Unlike {@link ZAPI}, this client is authenticated with a partner token
 * (`Authorization: Bearer`) and talks to the API root rather than an
 * instance-scoped path. Use it to create, list, subscribe, and cancel
 * instances — typically before constructing a per-instance {@link ZAPI}.
 */
export class ZAPIPartner {
  private readonly _client: HttpClient;

  constructor(options: PartnerClientOptions = {}) {
    const partnerToken = options.partnerToken ?? process.env.ZAPI_PARTNER_TOKEN;

    if (!partnerToken) {
      throw new ZAPIError(
        "Missing partnerToken. Pass it to the ZAPIPartner constructor or set the ZAPI_PARTNER_TOKEN environment variable.",
      );
    }

    this._client = new HttpClient({
      baseURL: (options.baseURL ?? DEFAULT_BASE_URL).replace(/\/+$/, ""),
      headers: { Authorization: `Bearer ${partnerToken}` },
      timeout: options.timeout,
      maxRetries: options.maxRetries,
    });
  }

  /** Create a new on-demand instance. Returns its `id` and `token`. */
  createInstance(
    params: CreateInstanceParams,
    options?: RequestOptions,
  ): Promise<CreatedInstance> {
    return this._client.post("/instances/integrator/on-demand", {
      body: params,
      ...options,
    });
  }

  /** List the partner account's instances. */
  listInstances(
    params: ListInstancesParams = {},
    options?: RequestOptions,
  ): Promise<PartnerInstance[]> {
    return this._client.get("/instances", {
      query: {
        query: params.query,
        middleware: params.middleware,
        page: params.page,
        pageSize: params.pageSize,
      },
      ...options,
    });
  }

  /** Subscribe (activate billing for) an existing instance. */
  subscribe(target: InstanceTarget, options?: RequestOptions): Promise<unknown> {
    return this._client.post(this.targetPath(target, "subscription"), options);
  }

  /** Cancel an existing instance. */
  cancel(target: InstanceTarget, options?: RequestOptions): Promise<unknown> {
    return this._client.post(this.targetPath(target, "cancel"), options);
  }

  private targetPath(target: InstanceTarget, action: string): string {
    const id = encodeURIComponent(target.instanceId);
    const token = encodeURIComponent(target.instanceToken);
    return `/instances/${id}/token/${token}/integrator/on-demand/${action}`;
  }
}
