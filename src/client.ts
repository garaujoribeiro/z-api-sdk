import { DEFAULT_BASE_URL, HttpClient } from "./core/http.js";
import { ZAPIError } from "./core/errors.js";
import type { ClientOptions } from "./core/types.js";
import { Business } from "./resources/business.js";
import { Calls } from "./resources/calls.js";
import { Chats } from "./resources/chats.js";
import { Communities } from "./resources/communities.js";
import { Contacts } from "./resources/contacts.js";
import { Groups } from "./resources/groups.js";
import { Instance } from "./resources/instance.js";
import { Messages } from "./resources/messages.js";
import { Mobile } from "./resources/mobile.js";
import { Newsletters } from "./resources/newsletter.js";
import { Privacy } from "./resources/privacy.js";
import { Queue } from "./resources/queue.js";
import { Status } from "./resources/status.js";
import { Webhooks } from "./resources/webhooks.js";

export class ZAPI {
  private readonly _client: HttpClient;

  readonly messages: Messages;
  readonly instance: Instance;
  readonly chats: Chats;
  readonly contacts: Contacts;
  readonly groups: Groups;
  readonly webhooks: Webhooks;
  readonly calls: Calls;
  readonly privacy: Privacy;
  readonly mobile: Mobile;
  readonly status: Status;
  readonly queue: Queue;
  readonly communities: Communities;
  readonly newsletters: Newsletters;
  readonly business: Business;

  constructor(options: ClientOptions = {}) {
    const instanceId = options.instanceId ?? process.env.ZAPI_INSTANCE_ID;
    const token = options.token ?? process.env.ZAPI_TOKEN;
    const clientToken = options.clientToken ?? process.env.ZAPI_CLIENT_TOKEN;

    if (!instanceId) {
      throw new ZAPIError(
        "Missing instanceId. Pass it to the ZAPI constructor or set the ZAPI_INSTANCE_ID environment variable.",
      );
    }
    if (!token) {
      throw new ZAPIError(
        "Missing token. Pass it to the ZAPI constructor or set the ZAPI_TOKEN environment variable.",
      );
    }

    const root = (options.baseURL ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this._client = new HttpClient({
      baseURL: `${root}/instances/${instanceId}/token/${token}`,
      headers: clientToken ? { "Client-Token": clientToken } : {},
      timeout: options.timeout,
      maxRetries: options.maxRetries,
    });

    this.messages = new Messages(this._client);
    this.instance = new Instance(this._client);
    this.chats = new Chats(this._client);
    this.contacts = new Contacts(this._client);
    this.groups = new Groups(this._client);
    this.webhooks = new Webhooks(this._client);
    this.calls = new Calls(this._client);
    this.privacy = new Privacy(this._client);
    this.mobile = new Mobile(this._client);
    this.status = new Status(this._client);
    this.queue = new Queue(this._client);
    this.communities = new Communities(this._client);
    this.newsletters = new Newsletters(this._client);
    this.business = new Business(this._client);
  }

  /** The fully-resolved base URL, including instance and token path segments. */
  get baseURL(): string {
    return this._client.baseURL;
  }
}
