import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";
import type { SendCallParams } from "../types/calls.js";

export class Calls extends APIResource {
  /** Place a (non-connecting) WhatsApp call that rings the recipient. */
  send(params: SendCallParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/send-call", { body: params, ...options });
  }
}
