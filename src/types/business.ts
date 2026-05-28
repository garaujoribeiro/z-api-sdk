export interface ProductParams {
  name: string;
  price: number;
  currency: string;
  description?: string;
  images?: string[];
  isHidden?: boolean;
  retailerId?: string;
  url?: string;
}

export interface Product {
  id?: string;
  name?: string;
  price?: number;
  currency?: string;
  [key: string]: unknown;
}

export interface CreateTagParams {
  name: string;
  color: number;
}

export interface Tag {
  id?: string;
  name?: string;
  color?: number;
  [key: string]: unknown;
}

export interface CatalogConfigParams {
  cartEnabled: boolean;
}

export interface CreateCollectionParams {
  name: string;
  productIds?: string[];
}

export interface EditCollectionParams {
  name: string;
}

export interface CollectionProductsParams {
  collectionId: string;
  productIds: string[];
}

export interface Collection {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

export interface BusinessHoursDay {
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  openTime: string;
  closeTime: string;
}

export interface BusinessHoursParams {
  timezone: string;
  days: BusinessHoursDay[];
  mode?: "specificHours" | "openTwentyFourHours" | "appointmentOnly" | string;
}
