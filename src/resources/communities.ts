import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";
import type {
  Community,
  CommunityGroupsParams,
  CommunityParticipantsParams,
  CommunitySettingsParams,
  CreateCommunityParams,
} from "../types/communities.js";

export class Communities extends APIResource {
  create(params: CreateCommunityParams, options?: RequestOptions): Promise<Community> {
    return this._client.post("/communities", { body: params, ...options });
  }

  list(options?: RequestOptions): Promise<Community[]> {
    return this._client.get("/communities", options);
  }

  getMetadata(communityId: string, options?: RequestOptions): Promise<Community> {
    return this._client.get(
      `/communities-metadata/${encodeURIComponent(communityId)}`,
      options,
    );
  }

  delete(communityId: string, options?: RequestOptions): Promise<unknown> {
    return this._client.delete(`/communities/${encodeURIComponent(communityId)}`, options);
  }

  linkGroups(params: CommunityGroupsParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/communities/link", { body: params, ...options });
  }

  unlinkGroups(params: CommunityGroupsParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/communities/unlink", { body: params, ...options });
  }

  redefineInvitationLink(communityId: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post(
      `/redefine-invitation-link/${encodeURIComponent(communityId)}`,
      options,
    );
  }

  addParticipant(
    params: CommunityParticipantsParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/add-participant", { body: params, ...options });
  }

  removeParticipant(
    params: CommunityParticipantsParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/remove-participant", { body: params, ...options });
  }

  addAdmin(params: CommunityParticipantsParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/add-admin", { body: params, ...options });
  }

  removeAdmin(params: CommunityParticipantsParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/remove-admin", { body: params, ...options });
  }

  updateSettings(
    params: CommunitySettingsParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/communities/settings", { body: params, ...options });
  }
}
