/** Common response returned by Z-API when sending a message. */
export interface SendMessageResponse {
  /** WhatsApp message ID. */
  messageId?: string;
  /** Z-API message ID (zaapId). */
  zaapId?: string;
  /** Internal message id. */
  id?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/** A URL or base64-encoded data string accepted by media endpoints. */
export type UrlOrBase64 = string;

export interface OperationResult {
  value?: boolean;
  [key: string]: unknown;
}
