import type { HttpClient } from "../core/http.js";

export abstract class APIResource {
  protected readonly _client: HttpClient;

  constructor(client: HttpClient) {
    this._client = client;
  }
}
