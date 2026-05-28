export interface CreateInstanceParams {
  name: string;
  sessionName?: string;
  deliveryCallbackUrl?: string;
  receivedCallbackUrl?: string;
  disconnectedCallbackUrl?: string;
  connectedCallbackUrl?: string;
  messageStatusCallbackUrl?: string;
  /** Register as a regular (non-business) device. */
  isDevice?: boolean;
  /** Register as a WhatsApp Business device. */
  businessDevice?: boolean;
}

export interface CreatedInstance {
  id?: string;
  token?: string;
  due?: string;
  name?: string;
  [key: string]: unknown;
}

export interface ListInstancesParams {
  query?: string;
  middleware?: string;
  page?: number;
  pageSize?: number;
}

export interface PartnerInstance {
  id?: string;
  name?: string;
  due?: string;
  created?: string;
  [key: string]: unknown;
}

/** Identifies an existing instance for partner-level operations. */
export interface InstanceTarget {
  instanceId: string;
  instanceToken: string;
}
