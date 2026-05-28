import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";
import type {
  CreateNewsletterParams,
  Newsletter,
  NewsletterSettingsParams,
  SearchNewsletterParams,
  TransferOwnershipParams,
} from "../types/newsletter.js";

export class Newsletters extends APIResource {
  create(params: CreateNewsletterParams, options?: RequestOptions): Promise<Newsletter> {
    return this._client.post("/create-newsletter", { body: params, ...options });
  }

  list(options?: RequestOptions): Promise<Newsletter[]> {
    return this._client.get("/newsletter", options);
  }

  getMetadata(id: string, options?: RequestOptions): Promise<Newsletter> {
    return this._client.get(`/newsletter/metadata/${encodeURIComponent(id)}`, options);
  }

  delete(id: string, options?: RequestOptions): Promise<unknown> {
    return this._client.delete("/delete-newsletter", { body: { id }, ...options });
  }

  search(params: SearchNewsletterParams, options?: RequestOptions): Promise<Newsletter[]> {
    return this._client.post("/search-newsletter", { body: params, ...options });
  }

  updateName(id: string, name: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/update-newsletter-name", { body: { id, name }, ...options });
  }

  updatePicture(id: string, pictureUrl: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/update-newsletter-picture", {
      body: { id, pictureUrl },
      ...options,
    });
  }

  updateDescription(
    id: string,
    description: string,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/update-newsletter-description", {
      body: { id, description },
      ...options,
    });
  }

  follow(id: string, options?: RequestOptions): Promise<unknown> {
    return this._client.put("/follow-newsletter", { body: { id }, ...options });
  }

  unfollow(id: string, options?: RequestOptions): Promise<unknown> {
    return this._client.put("/unfollow-newsletter", { body: { id }, ...options });
  }

  mute(id: string, options?: RequestOptions): Promise<unknown> {
    return this._client.put("/mute-newsletter", { body: { id }, ...options });
  }

  unmute(id: string, options?: RequestOptions): Promise<unknown> {
    return this._client.put("/unmute-newsletter", { body: { id }, ...options });
  }

  updateSettings(
    id: string,
    params: NewsletterSettingsParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post(`/newsletter/settings/${encodeURIComponent(id)}`, {
      body: params,
      ...options,
    });
  }

  acceptAdminInvite(id: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post(
      `/newsletter/accept-admin-invite/${encodeURIComponent(id)}`,
      options,
    );
  }

  removeAdmin(id: string, phone: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post(`/newsletter/remove-admin/${encodeURIComponent(id)}`, {
      body: { phone },
      ...options,
    });
  }

  revokeAdminInvite(id: string, phone: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post(`/newsletter/revoke-admin-invite/${encodeURIComponent(id)}`, {
      body: { phone },
      ...options,
    });
  }

  transferOwnership(
    id: string,
    params: TransferOwnershipParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post(`/newsletter/transfer-ownership/${encodeURIComponent(id)}`, {
      body: params,
      ...options,
    });
  }
}
