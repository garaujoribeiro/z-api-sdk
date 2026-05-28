export interface InstanceStatus {
  connected?: boolean;
  error?: string;
  smartphoneConnected?: boolean;
  [key: string]: unknown;
}

export interface DeviceInfo {
  phone?: string;
  device_model?: string;
  battery?: number;
  [key: string]: unknown;
}

export interface QrCodeImage {
  value?: string;
  [key: string]: unknown;
}
