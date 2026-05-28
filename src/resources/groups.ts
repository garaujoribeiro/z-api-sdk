import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";
import type {
  CreateGroupParams,
  CreateGroupResponse,
  GroupMetadata,
  GroupParticipantsParams,
  GroupSettingsParams,
  LeaveGroupParams,
  UpdateGroupDescriptionParams,
  UpdateGroupNameParams,
  UpdateGroupPhotoParams,
} from "../types/groups.js";

export class Groups extends APIResource {
  create(params: CreateGroupParams, options?: RequestOptions): Promise<CreateGroupResponse> {
    return this._client.post("/create-group", { body: params, ...options });
  }

  updateName(params: UpdateGroupNameParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/update-group-name", { body: params, ...options });
  }

  updatePhoto(params: UpdateGroupPhotoParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/update-group-photo", { body: params, ...options });
  }

  updateDescription(
    params: UpdateGroupDescriptionParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/update-group-description", { body: params, ...options });
  }

  addParticipant(params: GroupParticipantsParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/add-participant", { body: params, ...options });
  }

  removeParticipant(
    params: GroupParticipantsParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/remove-participant", { body: params, ...options });
  }

  addAdmin(params: GroupParticipantsParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/add-admin", { body: params, ...options });
  }

  removeAdmin(params: GroupParticipantsParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/remove-admin", { body: params, ...options });
  }

  leave(params: LeaveGroupParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/leave-group", { body: params, ...options });
  }

  getMetadata(groupPhone: string, options?: RequestOptions): Promise<GroupMetadata> {
    return this._client.get(`/group-metadata/${encodeURIComponent(groupPhone)}`, options);
  }

  updateSettings(params: GroupSettingsParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/update-group-settings", { body: params, ...options });
  }

  /** Approve participants waiting to join (admin-approval groups). */
  approveParticipant(
    params: GroupParticipantsParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/approve-participant", { body: params, ...options });
  }

  /** Get group metadata from an invitation link. */
  getInvitationMetadata(url: string, options?: RequestOptions): Promise<GroupMetadata> {
    return this._client.get("/group-invitation-metadata", { query: { url }, ...options });
  }

  /** Reset the group's invitation link. */
  redefineInvitationLink(groupPhone: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post(
      `/redefine-invitation-link/${encodeURIComponent(groupPhone)}`,
      options,
    );
  }

  /** Join a group via its invitation link. */
  acceptInvite(url: string, options?: RequestOptions): Promise<unknown> {
    return this._client.get("/accept-invite-group", { query: { url }, ...options });
  }
}
