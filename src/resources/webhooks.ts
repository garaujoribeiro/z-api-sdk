import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";

export class Webhooks extends APIResource {
  private set(path: string, url: string, options?: RequestOptions): Promise<unknown> {
    return this._client.put(path, { body: { value: url }, ...options });
  }

  updateReceived(url: string, options?: RequestOptions): Promise<unknown> {
    return this.set("/update-webhook-received", url, options);
  }

  updateDelivery(url: string, options?: RequestOptions): Promise<unknown> {
    return this.set("/update-webhook-delivery", url, options);
  }

  updateReceivedDelivery(url: string, options?: RequestOptions): Promise<unknown> {
    return this.set("/update-webhook-received-delivery", url, options);
  }

  updateMessageStatus(url: string, options?: RequestOptions): Promise<unknown> {
    return this.set("/update-webhook-message-status", url, options);
  }

  updateConnected(url: string, options?: RequestOptions): Promise<unknown> {
    return this.set("/update-webhook-connected", url, options);
  }

  updateDisconnected(url: string, options?: RequestOptions): Promise<unknown> {
    return this.set("/update-webhook-disconnected", url, options);
  }

  updateChatPresence(url: string, options?: RequestOptions): Promise<unknown> {
    return this.set("/update-webhook-chat-presence", url, options);
  }
}
