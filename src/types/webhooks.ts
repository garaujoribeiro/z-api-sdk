export interface WebhookValue {
  /** The webhook URL to register. */
  value: string;
}

export interface WebhookResult {
  value?: string;
  [key: string]: unknown;
}
