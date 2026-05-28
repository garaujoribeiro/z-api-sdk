export type PrivacyVisualization = "ALL" | "CONTACTS" | "CONTACT_BLACKLIST" | "NONE";

export type DisallowedContactType =
  | "groupAdd"
  | "profilePhoto"
  | "status"
  | "online"
  | "readReceipts"
  | "lastSeen";

export interface ContactBlacklistEntry {
  action: "add" | "remove";
  phone: string;
}

export interface PrivacyVisualizationParams {
  visualizationType: PrivacyVisualization;
  /** Only used with `CONTACT_BLACKLIST`. */
  contactsBlacklist?: ContactBlacklistEntry[];
}

/** The group-add endpoint uses `type` instead of `visualizationType`. */
export interface GroupAddPrivacyParams {
  type: PrivacyVisualization;
  contactsBlacklist?: ContactBlacklistEntry[];
}
