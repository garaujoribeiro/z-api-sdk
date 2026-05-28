import type { PaginationParams } from "./common.js";

export type ChatAction =
  | "read"
  | "unread"
  | "archive"
  | "unarchive"
  | "pin"
  | "unpin"
  | "mute"
  | "unmute"
  | "clear"
  | "delete";

export interface ListChatsParams extends PaginationParams {}

export interface Chat {
  phone?: string;
  name?: string;
  unread?: string;
  isGroup?: boolean;
  archived?: string;
  [key: string]: unknown;
}

export interface ModifyChatParams {
  phone: string;
  action: ChatAction;
}

/** Disappearing-message duration. `"0"` disables it. */
export type ChatExpiration = "0" | "24_HOURS" | "7_DAYS" | "90_DAYS";

export interface ChatExpirationParams {
  phone: string;
  chatExpiration: ChatExpiration;
}
