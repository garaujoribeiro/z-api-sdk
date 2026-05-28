export { ZAPI } from "./client.js";
export { ZAPI as default } from "./client.js";
export { ZAPIPartner } from "./partner.js";

export {
  ZAPIError,
  APIError,
  APIConnectionError,
  APITimeoutError,
  BadRequestError,
  AuthenticationError,
  PermissionDeniedError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  RateLimitError,
  InternalServerError,
} from "./core/errors.js";

export type {
  ClientOptions,
  PartnerClientOptions,
  RequestOptions,
  QueryParams,
} from "./core/types.js";

export type {
  SendMessageResponse,
  PaginationParams,
  UrlOrBase64,
  OperationResult,
} from "./types/common.js";
export type * from "./types/messages.js";
export type * from "./types/instance.js";
export type * from "./types/chats.js";
export type * from "./types/contacts.js";
export type * from "./types/groups.js";
export type * from "./types/webhooks.js";
export type * from "./types/partners.js";
export type * from "./types/calls.js";
export type * from "./types/privacy.js";
export type * from "./types/mobile.js";
export type * from "./types/status.js";
export type * from "./types/communities.js";
export type * from "./types/newsletter.js";
export type * from "./types/business.js";

export { Messages } from "./resources/messages.js";
export { Instance } from "./resources/instance.js";
export { Chats } from "./resources/chats.js";
export { Contacts } from "./resources/contacts.js";
export { Groups } from "./resources/groups.js";
export { Webhooks } from "./resources/webhooks.js";
export { Calls } from "./resources/calls.js";
export { Privacy } from "./resources/privacy.js";
export { Mobile } from "./resources/mobile.js";
export { Status } from "./resources/status.js";
export { Queue } from "./resources/queue.js";
export { Communities } from "./resources/communities.js";
export { Newsletters } from "./resources/newsletter.js";
export { Business } from "./resources/business.js";
