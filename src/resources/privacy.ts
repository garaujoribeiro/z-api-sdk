import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";
import type {
  DisallowedContactType,
  GroupAddPrivacyParams,
  PrivacyVisualizationParams,
} from "../types/privacy.js";

export class Privacy extends APIResource {
  getDisallowedContacts(
    type: DisallowedContactType,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.get("/privacy/disallowed-contacts", { query: { type }, ...options });
  }

  setLastSeen(params: PrivacyVisualizationParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/privacy/last-seen", { body: params, ...options });
  }

  setProfilePhoto(
    params: PrivacyVisualizationParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/privacy/photo", { body: params, ...options });
  }

  setDescription(
    params: PrivacyVisualizationParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/privacy/description", { body: params, ...options });
  }

  setGroupAdd(params: GroupAddPrivacyParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/privacy/group-add", { body: params, ...options });
  }

  setOnline(params: PrivacyVisualizationParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/privacy/online", { body: params, ...options });
  }

  setReadReceipts(
    value: "enable" | "disable",
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/privacy/read-receipts", { query: { value }, ...options });
  }

  /** Default disappearing-message timer. `value` is e.g. `off`, `days7`, `hours24`, `days90`. */
  setMessagesDuration(value: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/privacy/messages-duration", { query: { value }, ...options });
  }
}
