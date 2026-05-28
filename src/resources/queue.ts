import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";

export class Queue extends APIResource {
  /** View the message queue (messages pending while disconnected). */
  list(options?: RequestOptions): Promise<unknown> {
    return this._client.get("/queue", options);
  }

  /** Clear the entire queue. */
  clear(options?: RequestOptions): Promise<unknown> {
    return this._client.delete("/queue", options);
  }

  /** Remove a single queued message. */
  deleteMessage(messageId: string, options?: RequestOptions): Promise<unknown> {
    return this._client.delete(`/queue/${encodeURIComponent(messageId)}`, options);
  }
}
