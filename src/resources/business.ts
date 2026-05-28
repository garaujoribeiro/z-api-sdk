import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";
import type {
  BusinessHoursParams,
  CatalogConfigParams,
  Collection,
  CollectionProductsParams,
  CreateCollectionParams,
  CreateTagParams,
  EditCollectionParams,
  Product,
  ProductParams,
  Tag,
} from "../types/business.js";

export class Business extends APIResource {
  // --- Products / catalog ---

  createProduct(params: ProductParams, options?: RequestOptions): Promise<Product> {
    return this._client.post("/products", { body: params, ...options });
  }

  getCatalogs(options?: RequestOptions): Promise<Product[]> {
    return this._client.get("/catalogs", options);
  }

  getCatalogByPhone(phone: string, options?: RequestOptions): Promise<Product[]> {
    return this._client.get(`/catalogs/${encodeURIComponent(phone)}`, options);
  }

  getProduct(productId: string, options?: RequestOptions): Promise<Product> {
    return this._client.get(`/products/${encodeURIComponent(productId)}`, options);
  }

  deleteProduct(productId: string, options?: RequestOptions): Promise<unknown> {
    return this._client.delete(`/products/${encodeURIComponent(productId)}`, options);
  }

  // --- Tags ---

  getTags(options?: RequestOptions): Promise<Tag[]> {
    return this._client.get("/tags", options);
  }

  getTagColors(options?: RequestOptions): Promise<unknown> {
    return this._client.get("/business/tags/colors", options);
  }

  createTag(params: CreateTagParams, options?: RequestOptions): Promise<Tag> {
    return this._client.post("/business/create-tag", { body: params, ...options });
  }

  editTag(tagId: string, params: CreateTagParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post(`/business/edit-tag/${encodeURIComponent(tagId)}`, {
      body: params,
      ...options,
    });
  }

  deleteTag(tagId: string, options?: RequestOptions): Promise<unknown> {
    return this._client.delete(`/business/tag/${encodeURIComponent(tagId)}`, options);
  }

  addTagToChat(phone: string, tagId: string, options?: RequestOptions): Promise<unknown> {
    return this._client.put(
      `/chats/${encodeURIComponent(phone)}/tags/${encodeURIComponent(tagId)}/add`,
      options,
    );
  }

  removeTagFromChat(phone: string, tagId: string, options?: RequestOptions): Promise<unknown> {
    return this._client.put(
      `/chats/${encodeURIComponent(phone)}/tags/${encodeURIComponent(tagId)}/remove`,
      options,
    );
  }

  // --- Collections ---

  configCatalog(params: CatalogConfigParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/catalogs/config", { body: params, ...options });
  }

  createCollection(
    params: CreateCollectionParams,
    options?: RequestOptions,
  ): Promise<Collection> {
    return this._client.post("/catalogs/collection", { body: params, ...options });
  }

  listCollections(options?: RequestOptions): Promise<Collection[]> {
    return this._client.get("/catalogs/collection", options);
  }

  deleteCollection(collectionId: string, options?: RequestOptions): Promise<unknown> {
    return this._client.delete(
      `/catalogs/collection/${encodeURIComponent(collectionId)}`,
      options,
    );
  }

  editCollection(
    collectionId: string,
    params: EditCollectionParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post(
      `/catalogs/collection-edit/${encodeURIComponent(collectionId)}`,
      { body: params, ...options },
    );
  }

  listCollectionProducts(
    phone: string,
    collectionId: string,
    options?: RequestOptions,
  ): Promise<Product[]> {
    return this._client.get(
      `/catalogs/collection-products/${encodeURIComponent(phone)}`,
      { query: { collectionId }, ...options },
    );
  }

  addProductsToCollection(
    params: CollectionProductsParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/catalogs/collection/add-product", { body: params, ...options });
  }

  removeProductsFromCollection(
    params: CollectionProductsParams,
    options?: RequestOptions,
  ): Promise<unknown> {
    return this._client.post("/catalogs/collection/remove-product", {
      body: params,
      ...options,
    });
  }

  // --- Company profile ---

  setCompanyDescription(value: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/business/company-description", { body: { value }, ...options });
  }

  setCompanyEmail(value: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/business/company-email", { body: { value }, ...options });
  }

  setCompanyAddress(value: string, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/business/company-address", { body: { value }, ...options });
  }

  setCompanyWebsites(websites: string[], options?: RequestOptions): Promise<unknown> {
    return this._client.post("/business/company-websites", { body: { websites }, ...options });
  }

  setBusinessHours(params: BusinessHoursParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/business/hours", { body: params, ...options });
  }

  // --- Categories ---

  getAvailableCategories(query: string, options?: RequestOptions): Promise<unknown> {
    return this._client.get("/business/available-categories", { query: { query }, ...options });
  }

  setCategories(categories: string[], options?: RequestOptions): Promise<unknown> {
    return this._client.post("/business/categories", { body: { categories }, ...options });
  }
}
