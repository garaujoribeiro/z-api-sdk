import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";
import type {
  Chat,
  ChatExpirationParams,
  ListChatsParams,
  ModifyChatParams,
} from "../types/chats.js";

export class Chats extends APIResource {
  list(params: ListChatsParams = {}, options?: RequestOptions): Promise<Chat[]> {
    return this._client.get("/chats", {
      query: { page: params.page, pageSize: params.pageSize },
      ...options,
    });
  }

  get(phone: string, options?: RequestOptions): Promise<Chat> {
    return this._client.get(`/chats/${encodeURIComponent(phone)}`, options);
  }

  modify(params: ModifyChatParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/modify-chat", { body: params, ...options });
  }

  setExpiration(params: ChatExpirationParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/send-chat-expiration", { body: params, ...options });
  }
}
