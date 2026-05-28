import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";
import type { SendMessageResponse } from "../types/common.js";
import type { SendImageStatusParams, SendTextStatusParams } from "../types/status.js";

export class Status extends APIResource {
  sendText(
    params: SendTextStatusParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-text-status", { body: params, ...options });
  }

  sendImage(
    params: SendImageStatusParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-image-status", { body: params, ...options });
  }
}
