export interface CreateCommunityParams {
  name: string;
  description?: string;
}

export interface Community {
  id?: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

export interface CommunityGroupsParams {
  communityId: string;
  /** Group phone IDs, e.g. `120363355575783097-group`. */
  groupsPhones: string[];
}

export interface CommunityParticipantsParams {
  communityId: string;
  phones: string[];
  autoInvite?: boolean;
}

export interface CommunitySettingsParams {
  communityId: string;
  whoCanAddNewGroups?: "admins" | "all";
}
