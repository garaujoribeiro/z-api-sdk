# z-api-sdk

A typed TypeScript client for the [Z-API](https://z-api.io) WhatsApp API, with an ergonomic, resource-oriented design inspired by the Anthropic SDK.

```ts
import { ZAPI } from "z-api-sdk";

const client = new ZAPI({
  instanceId: process.env.ZAPI_INSTANCE_ID, // defaults to this env var; can be omitted
  token: process.env.ZAPI_TOKEN,
  clientToken: process.env.ZAPI_CLIENT_TOKEN,
});

const res = await client.messages.sendText({
  phone: "5511999999999",
  message: "Hello from the SDK",
});
console.log(res.messageId);
```

## Installation

```bash
npm install z-api-sdk
```

## Configuration

The client needs three credentials from your Z-API dashboard. Each can be passed
to the constructor or read from an environment variable:

| Option        | Env var              | Required |
| ------------- | -------------------- | -------- |
| `instanceId`  | `ZAPI_INSTANCE_ID`   | yes      |
| `token`       | `ZAPI_TOKEN`         | yes      |
| `clientToken` | `ZAPI_CLIENT_TOKEN`  | recommended (sent as the `Client-Token` header) |

Additional options: `baseURL` (default `https://api.z-api.io`), `timeout` (ms,
default `60000`), and `maxRetries` (default `2`; retries network errors, `429`,
and `5xx` with exponential backoff).

```ts
const client = new ZAPI(); // reads all three from the environment
```

## Resources

The client exposes resources as properties. Each method maps to a Z-API endpoint
and returns a `Promise`.

### messages

```ts
await client.messages.sendText({ phone, message });
await client.messages.sendImage({ phone, image: "https://…/pic.png", caption });
await client.messages.sendAudio({ phone, audio });
await client.messages.sendVideo({ phone, video, caption });
await client.messages.sendDocument({ extension: "pdf", phone, document, fileName });
await client.messages.sendLocation({ phone, title, address, latitude, longitude });
await client.messages.sendContact({ phone, contactName, contactPhone });
await client.messages.sendLink({ phone, message, image, linkUrl, title, linkDescription });
await client.messages.sendReaction({ phone, messageId, reaction: "👍" });
await client.messages.removeReaction({ phone, messageId });
await client.messages.forward({ phone, messageId, messagePhone });
await client.messages.sendButtonList({ phone, message, buttonList });
await client.messages.sendOptionList({ phone, message, optionList });
await client.messages.sendPoll({ phone, message, poll: [{ name: "A" }, { name: "B" }] });
await client.messages.readMessage({ phone, messageId });
await client.messages.delete({ phone, messageId, owner: true });
```

### instance

```ts
await client.instance.getStatus();
await client.instance.getDevice();
await client.instance.getQrCodeImage();
await client.instance.restart();
await client.instance.disconnect();
await client.instance.updateName("My Bot");
await client.instance.updateProfileName("My Bot");
```

### chats

```ts
await client.chats.list({ page: 1, pageSize: 50 });
await client.chats.get("5511999999999");
await client.chats.modify({ phone: "5511999999999", action: "archive" });
await client.chats.setExpiration({ phone: "5511999999999", chatExpiration: "7_DAYS" });
```

### contacts

```ts
await client.contacts.list({ page: 1, pageSize: 100 });
await client.contacts.get("5511999999999");
await client.contacts.phoneExists("5511999999999");
await client.contacts.phoneExistsBatch({ phones: ["5511999999999"] });
await client.contacts.getProfilePicture("5511999999999");
await client.contacts.modifyBlocked({ phone: "5511999999999", action: "block" });
```

### groups

```ts
await client.groups.create({ groupName: "Team", phones: ["5511999999999"] });
await client.groups.addParticipant({ groupId, phones });
await client.groups.removeParticipant({ groupId, phones });
await client.groups.addAdmin({ groupId, phones });
await client.groups.getMetadata(groupPhone);
await client.groups.updateSettings({ phone: groupId, adminOnlyMessage: true });
```

### webhooks

```ts
await client.webhooks.updateReceived("https://my.app/webhook");
await client.webhooks.updateMessageStatus("https://my.app/status");
await client.webhooks.updateConnected("https://my.app/connected");
```

## Partners (multi-instance management)

Partner/integrator accounts manage instances at the account level using a
**partner token** (`Authorization: Bearer`) against the API root — a different
auth scheme and base path than the per-instance client. Use `ZAPIPartner` to
create/list/subscribe/cancel instances, then construct a normal `ZAPI` from the
returned credentials.

```ts
import { ZAPIPartner, ZAPI } from "z-api-sdk";

const partner = new ZAPIPartner({
  partnerToken: process.env.ZAPI_PARTNER_TOKEN, // or set the env var and omit
});

const created = await partner.createInstance({
  name: "Customer A",
  businessDevice: true,
  receivedCallbackUrl: "https://my.app/received",
});

// Persist created.id / created.token to your DB, then talk to the instance:
const client = new ZAPI({ instanceId: created.id, token: created.token });

await partner.listInstances({ page: 1, pageSize: 15 });
await partner.subscribe({ instanceId: created.id!, instanceToken: created.token! });
await partner.cancel({ instanceId: created.id!, instanceToken: created.token! });
```

`partnerToken` falls back to the `ZAPI_PARTNER_TOKEN` environment variable.

## Error handling

Failed requests reject with typed errors. All extend `ZAPIError`.

```ts
import { ZAPI, NotFoundError, RateLimitError, APIError } from "z-api-sdk";

try {
  await client.messages.sendText({ phone, message });
} catch (err) {
  if (err instanceof RateLimitError) {
    // 429 — back off
  } else if (err instanceof NotFoundError) {
    // 404
  } else if (err instanceof APIError) {
    console.error(err.status, err.body);
  }
}
```

`APIError` subclasses: `BadRequestError` (400), `AuthenticationError` (401),
`PermissionDeniedError` (403), `NotFoundError` (404), `ConflictError` (409),
`UnprocessableEntityError` (422), `RateLimitError` (429), `InternalServerError`
(5xx). Network/timeout failures throw `APIConnectionError` / `APITimeoutError`.

## Per-request options

Every method accepts an optional second argument to override defaults for that call:

```ts
await client.messages.sendText(
  { phone, message },
  { timeout: 5000, maxRetries: 0, signal: controller.signal },
);
```

## Full coverage

The SDK wraps the entire Z-API collection across these resources:

`messages`, `instance`, `chats`, `contacts`, `groups`, `webhooks`, `calls`,
`privacy`, `mobile`, `status`, `queue`, `communities`, `newsletters`,
`business`, plus the account-level `ZAPIPartner` client.

See [USAGE.md](./USAGE.md) for an example of every method and a complete
coverage table.

## Development

```bash
npm install
npm run typecheck   # tsc --noEmit
npm test            # vitest (HTTP mocked with MSW)
npm run build       # tsup → dist/ (ESM + CJS + .d.ts)
```
