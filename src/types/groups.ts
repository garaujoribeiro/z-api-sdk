import type { UrlOrBase64 } from "./common.js";

export interface CreateGroupParams {
  groupName: string;
  phones: string[];
  autoInvite?: boolean;
}

export interface CreateGroupResponse {
  phone?: string;
  invitationLink?: string;
  [key: string]: unknown;
}

export interface UpdateGroupNameParams {
  groupId: string;
  groupName: string;
}

export interface UpdateGroupPhotoParams {
  groupId: string;
  groupPhoto: UrlOrBase64;
}

export interface UpdateGroupDescriptionParams {
  groupId: string;
  groupDescription: string;
}

export interface GroupParticipantsParams {
  groupId: string;
  phones: string[];
  autoInvite?: boolean;
}

export interface LeaveGroupParams {
  groupId: string;
}

export interface GroupSettingsParams {
  /** Group ID (passed as `phone` by the API). */
  phone: string;
  adminOnlyMessage?: boolean;
  adminOnlySettings?: boolean;
  requireAdminApproval?: boolean;
  adminOnlyAddMember?: boolean;
}

export interface GroupMetadata {
  phone?: string;
  subject?: string;
  owner?: string;
  participants?: unknown[];
  [key: string]: unknown;
}
