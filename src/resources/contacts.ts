import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";
import type {
  Contact,
  ListContactsParams,
  ModifyBlockedParams,
  PhoneExistsBatchParams,
  PhoneExistsResult,
  ProfilePicture,
} from "../types/contacts.js";

export class Contacts extends APIResource {
  list(params: ListContactsParams = {}, options?: RequestOptions): Promise<Contact[]> {
    return this._client.get("/contacts", {
      query: { page: params.page, pageSize: params.pageSize },
      ...options,
    });
  }

  get(phone: string, options?: RequestOptions): Promise<Contact> {
    return this._client.get(`/contacts/${encodeURIComponent(phone)}`, options);
  }

  phoneExists(phone: string, options?: RequestOptions): Promise<PhoneExistsResult> {
    return this._client.get(`/phone-exists/${encodeURIComponent(phone)}`, options);
  }

  phoneExistsBatch(
    params: PhoneExistsBatchParams,
    options?: RequestOptions,
  ): Promise<PhoneExistsResult[]> {
    return this._client.post("/phone-exists-batch", { body: params, ...options });
  }

  getProfilePicture(phone: string, options?: RequestOptions): Promise<ProfilePicture> {
    return this._client.get("/profile-picture", { query: { phone }, ...options });
  }

  modifyBlocked(params: ModifyBlockedParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/contacts/modify-blocked", { body: params, ...options });
  }

  report(phone: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post(`/contacts/${encodeURIComponent(phone)}/report`, options);
  }
}
