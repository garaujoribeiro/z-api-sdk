import type { PaginationParams } from "./common.js";

export interface ListContactsParams extends PaginationParams {}

export interface Contact {
  phone?: string;
  name?: string;
  short?: string;
  notify?: string;
  [key: string]: unknown;
}

export interface PhoneExistsResult {
  exists?: boolean;
  phone?: string;
  outputPhone?: string;
  [key: string]: unknown;
}

export interface PhoneExistsBatchParams {
  phones: string[];
}

export interface ModifyBlockedParams {
  phone: string;
  action: "block" | "unblock";
}

export interface ProfilePicture {
  link?: string;
  [key: string]: unknown;
}
