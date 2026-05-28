export interface CreateNewsletterParams {
  name: string;
  description?: string;
}

export interface Newsletter {
  id?: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

export interface SearchNewsletterParams {
  searchText?: string;
  limit?: number;
  view?: "RECOMMENDED" | "TRENDING" | string;
  filters?: {
    countryCodes?: string[];
  };
}

export interface NewsletterSettingsParams {
  reactionCodes?: "all" | "basic" | "none" | string;
}

export interface TransferOwnershipParams {
  phone: string;
  quitAdmin?: boolean;
}
