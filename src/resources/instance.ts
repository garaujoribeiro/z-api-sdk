import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";
import type { DeviceInfo, InstanceStatus, QrCodeImage } from "../types/instance.js";

export class Instance extends APIResource {
  getStatus(options?: RequestOptions): Promise<InstanceStatus> {
    return this._client.get("/status", options);
  }

  getMe(options?: RequestOptions): Promise<unknown> {
    return this._client.get("/me", options);
  }

  getDevice(options?: RequestOptions): Promise<DeviceInfo> {
    return this._client.get("/device", options);
  }

  restart(options?: RequestOptions): Promise<unknown> {
    return this._client.get("/restart", options);
  }

  disconnect(options?: RequestOptions): Promise<unknown> {
    return this._client.get("/disconnect", options);
  }

  /** QR code as a base64 image. */
  getQrCodeImage(options?: RequestOptions): Promise<QrCodeImage> {
    return this._client.get("/qr-code/image", options);
  }

  /** QR code as raw bytes. */
  getQrCode(options?: RequestOptions): Promise<unknown> {
    return this._client.get("/qr-code", options);
  }

  /** Pairing code for phone-number-based connection. */
  getPhoneCode(phone: string, options?: RequestOptions): Promise<unknown> {
    return this._client.get(`/phone-code/${encodeURIComponent(phone)}`, options);
  }

  /** Enable/disable auto-reading of incoming messages. */
  updateAutoReadMessage(value: boolean, options?: RequestOptions): Promise<unknown> {
    return this._client.put("/update-auto-read-message", { body: { value }, ...options });
  }

  /** Enable/disable automatic rejection of incoming calls. */
  updateCallRejectAuto(value: boolean, options?: RequestOptions): Promise<unknown> {
    return this._client.put("/update-call-reject-auto", { body: { value }, ...options });
  }

  /** Set the message sent automatically when a call is rejected. */
  updateCallRejectMessage(value: string, options?: RequestOptions): Promise<unknown> {
    return this._client.put("/update-call-reject-message", { body: { value }, ...options });
  }

  updateName(value: string, options?: RequestOptions): Promise<unknown> {
    return this._client.put("/update-name", { body: { value }, ...options });
  }

  updateProfileName(value: string, options?: RequestOptions): Promise<unknown> {
    return this._client.put("/profile-name", { body: { value }, ...options });
  }

  updateProfilePicture(value: string, options?: RequestOptions): Promise<unknown> {
    return this._client.put("/profile-picture", { body: { value }, ...options });
  }

  updateProfileDescription(value: string, options?: RequestOptions): Promise<unknown> {
    return this._client.put("/profile-description", { body: { value }, ...options });
  }
}
