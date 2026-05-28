export interface RegistrationAvailableParams {
  ddi: string;
  phone: string;
}

export interface RequestRegistrationCodeParams {
  ddi: string;
  phone: string;
  method: "sms" | "call";
}

export interface RequestUnbanningParams {
  appealToken: string;
  description: string;
}
