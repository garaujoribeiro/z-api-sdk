import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";
import type {
  RegistrationAvailableParams,
  RequestRegistrationCodeParams,
  RequestUnbanningParams,
} from "../types/mobile.js";

export class Mobile extends APIResource {
  // --- Device registration ---

  checkRegistrationAvailable(
    params: RegistrationAvailableParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/mobile/registration-available", { body: params, ...options });
  }

  requestRegistrationCode(
    params: RequestRegistrationCodeParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/mobile/request-registration-code", { body: params, ...options });
  }

  respondCaptcha(captcha: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/mobile/respond-captcha", { body: { captcha }, ...options });
  }

  confirmRegistrationCode(code: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/mobile/confirm-registration-code", { body: { code }, ...options });
  }

  // --- PIN / 2FA ---

  confirmPinCode(code: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/mobile/confirm-pin-code", { body: { code }, ...options });
  }

  recoverPinCode(options?: RequestOptions): Promise<unknown> {
    return this._client.post("/mobile/recover-pin-code", options);
  }

  hasTwoFa(options?: RequestOptions): Promise<unknown> {
    return this._client.get("/security/two-fa-code", options);
  }

  setTwoFa(code: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/security/two-fa-code", { body: { code }, ...options });
  }

  removeTwoFa(options?: RequestOptions): Promise<unknown> {
    return this._client.post("/security/two-fa-code/remove", options);
  }

  // --- Email ---

  getEmail(options?: RequestOptions): Promise<unknown> {
    return this._client.get("/security/email", options);
  }

  setEmail(email: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/security/email", { body: { email }, ...options });
  }

  verifyEmail(verificationCode: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/security/verify-email", {
      body: { verificationCode },
      ...options,
    });
  }

  removeEmail(options?: RequestOptions): Promise<unknown> {
    return this._client.post("/security/email/remove", options);
  }

  // --- Unbanning ---

  requestUnbanning(
    params: RequestUnbanningParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/mobile/request-unbanning", { body: params, ...options });
  }
}
