# Usage Guide

A complete, example-driven reference for `z-api-sdk`. Every method below is
implemented and verified against the official Z-API Postman collection.

- [Getting started](#getting-started)
- [Client options](#client-options)
- [Per-request options](#per-request-options)
- [Error handling](#error-handling)
- [`messages`](#messages)
- [`instance`](#instance)
- [`chats`](#chats)
- [`contacts`](#contacts)
- [`groups`](#groups)
- [`webhooks`](#webhooks)
- [`calls`](#calls)
- [`privacy`](#privacy)
- [`mobile`](#mobile)
- [`status`](#status)
- [`queue`](#queue)
- [`communities`](#communities)
- [`newsletters`](#newsletters)
- [`business`](#business)
- [Partners (`ZAPIPartner`)](#partners-zapipartner)
- [Coverage](#coverage)

---

## Getting started

```ts
import { ZAPI } from "z-api-sdk";

const client = new ZAPI({
  instanceId: process.env.ZAPI_INSTANCE_ID,
  token: process.env.ZAPI_TOKEN,
  clientToken: process.env.ZAPI_CLIENT_TOKEN,
});

const res = await client.messages.sendText({
  phone: "5511999999999",
  message: "Hello",
});
console.log(res.messageId);
```

CommonJS works too:

```js
const { ZAPI } = require("z-api-sdk");
```

Every request is sent to
`{baseURL}/instances/{instanceId}/token/{token}/{endpoint}` with the
`Client-Token` header attached automatically.

## Client options

| Option        | Type     | Default                  | Env fallback         |
| ------------- | -------- | ------------------------ | -------------------- |
| `instanceId`  | `string` | —                        | `ZAPI_INSTANCE_ID`   |
| `token`       | `string` | —                        | `ZAPI_TOKEN`         |
| `clientToken` | `string` | —                        | `ZAPI_CLIENT_TOKEN`  |
| `baseURL`     | `string` | `https://api.z-api.io`   | —                    |
| `timeout`     | `number` | `60000` (ms)             | —                    |
| `maxRetries`  | `number` | `2`                      | —                    |

`instanceId` and `token` are required (from options or env); the constructor
throws a `ZAPIError` if either is missing. `maxRetries` retries network errors,
`429`, and `5xx` responses with exponential backoff.

```ts
const client = new ZAPI(); // resolves all three credentials from the environment
```

## Per-request options

Each method takes an optional final argument that overrides client defaults for
that single call:

```ts
const controller = new AbortController();

await client.messages.sendText(
  { phone: "5511999999999", message: "Hi" },
  {
    timeout: 5000,        // ms, overrides client timeout
    maxRetries: 0,        // disable retries for this call
    signal: controller.signal,
    headers: { "X-Trace": "abc" },
  },
);
```

## Error handling

All errors extend `ZAPIError`. HTTP failures throw an `APIError` subclass that
carries `status` and the parsed response `body`.

```ts
import {
  RateLimitError,
  AuthenticationError,
  NotFoundError,
  APIError,
  APIConnectionError,
} from "z-api-sdk";

try {
  await client.messages.sendText({ phone: "5511999999999", message: "Hi" });
} catch (err) {
  if (err instanceof RateLimitError) {
    // 429 — back off and retry later
  } else if (err instanceof AuthenticationError) {
    // 401 — check instanceId / token / clientToken
  } else if (err instanceof NotFoundError) {
    // 404
  } else if (err instanceof APIError) {
    console.error(err.status, err.body);
  } else if (err instanceof APIConnectionError) {
    // network failure / timeout — never reached the API
  }
}
```

| Class                      | Trigger             |
| -------------------------- | ------------------- |
| `BadRequestError`          | HTTP 400            |
| `AuthenticationError`      | HTTP 401            |
| `PermissionDeniedError`    | HTTP 403            |
| `NotFoundError`            | HTTP 404            |
| `ConflictError`            | HTTP 409            |
| `UnprocessableEntityError` | HTTP 422            |
| `RateLimitError`           | HTTP 429            |
| `InternalServerError`      | HTTP 5xx            |
| `APITimeoutError`          | request timed out   |
| `APIConnectionError`       | network failure     |

---

## messages

`phone` accepts an individual number (with country code) or a group ID. All
send methods resolve to `{ zaapId?, messageId?, id? }`.

### sendText

```ts
await client.messages.sendText({
  phone: "5511999999999",
  message: "Hello",
  delayMessage: 2,   // optional, seconds
  delayTyping: 1,    // optional, seconds of "typing…"
  messageId: "3EB0…" // optional, reply to a message
});
```

### sendImage / sendVideo / sendAudio

```ts
await client.messages.sendImage({
  phone, image: "https://host/pic.png", caption: "nice", viewOnce: false,
});
await client.messages.sendVideo({ phone, video: "https://host/clip.mp4", caption });
await client.messages.sendAudio({ phone, audio: "https://host/voice.mp3" });
```

`image` / `video` / `audio` accept a URL or a base64 data string.

### sendDocument

The file extension goes in the path; pass it via `extension`:

```ts
await client.messages.sendDocument({
  extension: "pdf",
  phone,
  document: "https://host/file.pdf",
  fileName: "invoice.pdf",
  caption: "Your invoice",
});
```

### sendLocation

```ts
await client.messages.sendLocation({
  phone,
  title: "Google Brasil",
  address: "Av. Brg. Faria Lima, 3477 - São Paulo",
  latitude: "-23.0696347",
  longitude: "-50.4357913",
});
```

### sendContact

```ts
await client.messages.sendContact({
  phone,
  contactName: "Support",
  contactPhone: "554488888888",
});
```

### sendLink

```ts
await client.messages.sendLink({
  phone,
  message: "Check this out",
  image: "https://host/preview.png",
  linkUrl: "https://example.com",
  title: "Example",
  linkDescription: "A short description",
  linkType: "SMALL", // or "LARGE"
});
```

### sendReaction / removeReaction

```ts
await client.messages.sendReaction({ phone, messageId: "3EB0…", reaction: "👍" });
await client.messages.removeReaction({ phone, messageId: "3EB0…" });
```

### forward

```ts
await client.messages.forward({
  phone: "554498744288",        // destination
  messageId: "3EB0…",
  messagePhone: "554499999999", // chat the original message belongs to
});
```

### sendButtonList

```ts
await client.messages.sendButtonList({
  phone,
  message: "Is Z-API good?",
  buttonList: {
    buttons: [
      { id: "1", label: "Yes" },
      { id: "2", label: "Absolutely" },
    ],
    // image or video are optional
  },
});
```

### sendOptionList

```ts
await client.messages.sendOptionList({
  phone,
  message: "Pick the best option:",
  optionList: {
    title: "Available options",
    buttonLabel: "Open list",
    options: [
      { id: "1", title: "Z-API", description: "Wings for your imagination" },
      { id: "2", title: "Others", description: "They don't work" },
    ],
  },
});
```

### sendPoll

```ts
await client.messages.sendPoll({
  phone,
  message: "Favorite?",
  poll: [{ name: "Z-API" }, { name: "Other" }],
  pollMaxOptions: 1, // optional
});
```

### readMessage

```ts
await client.messages.readMessage({ phone, messageId: "3EB0…" });
```

### delete

`owner: true` deletes a message you sent; `false` targets the contact's message.
Sent as query parameters on a `DELETE`.

```ts
await client.messages.delete({ phone, messageId: "3EB0…", owner: true });
```

---

## instance

```ts
await client.instance.getStatus();   // GET /status  → connection state
await client.instance.getMe();       // GET /me
await client.instance.getDevice();   // GET /device
await client.instance.getQrCodeImage(); // GET /qr-code/image → base64 image
await client.instance.restart();     // GET /restart
await client.instance.disconnect();  // GET /disconnect

await client.instance.updateName("My Bot");               // PUT /update-name
await client.instance.updateProfileName("My Bot");        // PUT /profile-name
await client.instance.updateProfilePicture("https://…");  // PUT /profile-picture
await client.instance.updateProfileDescription("Bot…");   // PUT /profile-description
```

---

## chats

```ts
// Paginated list
await client.chats.list({ page: 1, pageSize: 20 });

// Single chat metadata
await client.chats.get("5511999999999");

// Modify a chat
await client.chats.modify({ phone: "5511999999999", action: "archive" });
// action: "read" | "unread" | "archive" | "unarchive" | "pin" | "unpin"
//       | "mute" | "unmute" | "clear" | "delete"

// Disappearing messages. chatExpiration: "0" | "24_HOURS" | "7_DAYS" | "90_DAYS"
await client.chats.setExpiration({ phone: "5511999999999", chatExpiration: "7_DAYS" });
```

---

## contacts

```ts
await client.contacts.list({ page: 1, pageSize: 20 });
await client.contacts.get("5511999999999");

// Does this number have WhatsApp?
await client.contacts.phoneExists("5511999999999");
await client.contacts.phoneExistsBatch({ phones: ["5511999999999", "554488888888"] });

await client.contacts.getProfilePicture("5511999999999");

// Block or unblock. action: "block" | "unblock"
await client.contacts.modifyBlocked({ phone: "5511999999999", action: "block" });
```

---

## groups

A `groupId` looks like `120363356737170752-group`.

```ts
const group = await client.groups.create({
  groupName: "Team",
  phones: ["5511999999999"],
  autoInvite: true, // send invite links if a number can't be added directly
});

await client.groups.updateName({ groupId, groupName: "New name" });
await client.groups.updatePhoto({ groupId, groupPhoto: "https://host/logo.png" });
await client.groups.updateDescription({ groupId, groupDescription: "About us" });

await client.groups.addParticipant({ groupId, phones: ["5511999999999"], autoInvite: true });
await client.groups.removeParticipant({ groupId, phones: ["5511999999999"] });
await client.groups.addAdmin({ groupId, phones: ["5511999999999"] });
await client.groups.removeAdmin({ groupId, phones: ["5511999999999"] });
await client.groups.leave({ groupId });

await client.groups.getMetadata("120363356737170752-group");

// NOTE: settings take the group ID in the `phone` field (matches the API).
await client.groups.updateSettings({
  phone: groupId,
  adminOnlyMessage: true,
  adminOnlySettings: true,
  requireAdminApproval: true,
  adminOnlyAddMember: true,
});
```

---

## webhooks

Each method registers a URL for the corresponding event (`PUT { value: url }`):

```ts
await client.webhooks.updateReceived("https://my.app/received");
await client.webhooks.updateDelivery("https://my.app/delivery");
await client.webhooks.updateReceivedDelivery("https://my.app/received-delivery");
await client.webhooks.updateMessageStatus("https://my.app/status");
await client.webhooks.updateConnected("https://my.app/connected");
await client.webhooks.updateDisconnected("https://my.app/disconnected");
await client.webhooks.updateChatPresence("https://my.app/presence");
```

---

## calls

```ts
// Rings the recipient for callDuration seconds (does not connect audio).
await client.calls.send({ phone: "5511999999999", callDuration: 5 });
```

## privacy

```ts
// visualizationType: "ALL" | "CONTACTS" | "CONTACT_BLACKLIST" | "NONE"
await client.privacy.setLastSeen({ visualizationType: "CONTACTS" });
await client.privacy.setProfilePhoto({ visualizationType: "ALL" });
await client.privacy.setDescription({ visualizationType: "NONE" });
await client.privacy.setOnline({ visualizationType: "ALL" });

// CONTACT_BLACKLIST takes an explicit add/remove list:
await client.privacy.setLastSeen({
  visualizationType: "CONTACT_BLACKLIST",
  contactsBlacklist: [
    { action: "add", phone: "551111111111" },
    { action: "remove", phone: "552222222222" },
  ],
});

// NOTE: group-add uses `type` (not `visualizationType`)
await client.privacy.setGroupAdd({ type: "CONTACTS" });

await client.privacy.setReadReceipts("enable"); // "enable" | "disable"
await client.privacy.setMessagesDuration("days7"); // off | hours24 | days7 | days90
await client.privacy.getDisallowedContacts("groupAdd");
```

## mobile

Account-setup operations for mobile-registered instances (registration code,
2FA PIN, account email, unbanning).

```ts
await client.mobile.checkRegistrationAvailable({ ddi: "55", phone: "4499999999" });
await client.mobile.requestRegistrationCode({ ddi: "55", phone: "4499999999", method: "sms" });
await client.mobile.respondCaptcha("123456");
await client.mobile.confirmRegistrationCode("123456");

await client.mobile.hasTwoFa();
await client.mobile.setTwoFa("1234");
await client.mobile.confirmPinCode("1234");
await client.mobile.recoverPinCode();
await client.mobile.removeTwoFa();

await client.mobile.getEmail();
await client.mobile.setEmail("me@example.com");
await client.mobile.verifyEmail("123456");
await client.mobile.removeEmail();

await client.mobile.requestUnbanning({ appealToken: "…", description: "…" });
```

## status

```ts
await client.status.sendText({ message: "My status", textBackgroundColor: "#0a84ff" });
await client.status.sendImage({ image: "https://host/pic.png", caption: "hi" });
```

## queue

```ts
await client.queue.list();              // GET /queue
await client.queue.clear();             // DELETE /queue
await client.queue.deleteMessage("MESSAGE_ID");
```

## communities

Community participant/admin operations reuse the same endpoints as groups but
key off `communityId` instead of `groupId`.

```ts
const community = await client.communities.create({ name: "My Community" });
await client.communities.list();
await client.communities.getMetadata("120363356981780178");

await client.communities.linkGroups({
  communityId: "120363356981780178",
  groupsPhones: ["120363355575783097-group"],
});
await client.communities.unlinkGroups({ communityId, groupsPhones });

await client.communities.addParticipant({ communityId, phones: ["55…"], autoInvite: true });
await client.communities.addAdmin({ communityId, phones: ["55…"] });
await client.communities.updateSettings({ communityId, whoCanAddNewGroups: "admins" });
await client.communities.redefineInvitationLink(communityId);
await client.communities.delete(communityId);
```

## newsletters

Channel (newsletter) management. Methods are keyed by the channel `id`
(e.g. `120363336258908380@newsletter`).

```ts
const ch = await client.newsletters.create({ name: "My Channel", description: "…" });
await client.newsletters.list();
await client.newsletters.getMetadata(id);
await client.newsletters.search({ searchText: "Z-API", view: "TRENDING", limit: 50 });

await client.newsletters.updateName(id, "New name");
await client.newsletters.updatePicture(id, "https://host/pic.png");
await client.newsletters.updateDescription(id, "New description");

await client.newsletters.follow(id);
await client.newsletters.unfollow(id);
await client.newsletters.mute(id);
await client.newsletters.unmute(id);

await client.newsletters.updateSettings(id, { reactionCodes: "basic" });
await client.newsletters.acceptAdminInvite(id);
await client.newsletters.removeAdmin(id, "55…");
await client.newsletters.revokeAdminInvite(id, "55…");
await client.newsletters.transferOwnership(id, { phone: "55…", quitAdmin: true });
await client.newsletters.delete(id);
```

## business

WhatsApp Business: products/catalog, tags, collections, company profile, and
categories.

```ts
// Products / catalog
await client.business.createProduct({
  name: "My product", price: 20, currency: "BRL", description: "…",
  images: ["https://host/p.png"], retailerId: "002",
});
await client.business.getCatalogs();
await client.business.getCatalogByPhone("554431920066");
await client.business.getProduct("PRODUCT_ID");
await client.business.deleteProduct("PRODUCT_ID");

// Tags (color is a numeric code; list available colors with getTagColors)
await client.business.getTags();
await client.business.getTagColors();
const tag = await client.business.createTag({ name: "VIP", color: 1 });
await client.business.editTag("TAG_ID", { name: "VIP+", color: 2 });
await client.business.deleteTag("TAG_ID");
await client.business.addTagToChat("5511999999999", "TAG_ID");
await client.business.removeTagFromChat("5511999999999", "TAG_ID");

// Collections
await client.business.configCatalog({ cartEnabled: true });
await client.business.createCollection({ name: "Summer", productIds: ["…"] });
await client.business.listCollections();
await client.business.editCollection("COLLECTION_ID", { name: "Winter" });
await client.business.listCollectionProducts("554431920066", "COLLECTION_ID");
await client.business.addProductsToCollection({ collectionId: "…", productIds: ["…"] });
await client.business.removeProductsFromCollection({ collectionId: "…", productIds: ["…"] });
await client.business.deleteCollection("COLLECTION_ID");

// Company profile
await client.business.setCompanyDescription("About us");
await client.business.setCompanyEmail("biz@example.com");
await client.business.setCompanyAddress("Av. …");
await client.business.setCompanyWebsites(["https://example.com"]);
await client.business.setBusinessHours({
  timezone: "America/Sao_Paulo",
  mode: "specificHours",
  days: [{ dayOfWeek: "MONDAY", openTime: "08:00", closeTime: "18:00" }],
});

// Categories
await client.business.getAvailableCategories("Clothing");
await client.business.setCategories(["CLOTHING_AND_APPAREL"]);
```

---

## Partners (`ZAPIPartner`)

The partner/integrator client manages instances at the **account level**. It
differs from `ZAPI` in two ways that matter:

- **Auth:** `Authorization: Bearer <partnerToken>` (not the per-instance
  `Client-Token` header).
- **Base path:** requests hit the API **root** (`https://api.z-api.io`), not the
  `/instances/{id}/token/{token}` prefix.

This is the bootstrapping layer — it creates the instances that `ZAPI` later
talks to. It's a separate top-level export, constructed with only a partner
token:

```ts
import { ZAPIPartner } from "z-api-sdk";

const partner = new ZAPIPartner({
  partnerToken: process.env.ZAPI_PARTNER_TOKEN, // falls back to this env var
});
```

| Option        | Type     | Default                | Env fallback         |
| ------------- | -------- | ---------------------- | -------------------- |
| `partnerToken`| `string` | —                      | `ZAPI_PARTNER_TOKEN` |
| `baseURL`     | `string` | `https://api.z-api.io` | —                    |
| `timeout`     | `number` | `60000` (ms)           | —                    |
| `maxRetries`  | `number` | `2`                    | —                    |

`partnerToken` is required (from option or env); the constructor throws a
`ZAPIError` otherwise. The same per-request options and error classes documented
above apply.

### createInstance

`POST /instances/integrator/on-demand`. Returns the new instance's `id` and
`token` — persist these, then build a `ZAPI` client from them.

```ts
const created = await partner.createInstance({
  name: "Customer A",
  sessionName: "Main session",      // optional
  deliveryCallbackUrl: "https://my.app/delivery",       // optional
  receivedCallbackUrl: "https://my.app/received",        // optional
  disconnectedCallbackUrl: "https://my.app/disconnected", // optional
  connectedCallbackUrl: "https://my.app/connected",       // optional
  messageStatusCallbackUrl: "https://my.app/status",      // optional
  isDevice: false,        // optional
  businessDevice: true,   // optional
});

const client = new ZAPI({ instanceId: created.id, token: created.token });
```

### listInstances

`GET /instances` with optional query params.

```ts
const instances = await partner.listInstances({
  query: "search term", // optional
  middleware: "web",     // optional
  page: 1,                // optional
  pageSize: 15,           // optional
});
```

### subscribe / cancel

Both target an existing instance (by id + token) and take no body.

```ts
await partner.subscribe({ instanceId: created.id!, instanceToken: created.token! });
await partner.cancel({ instanceId: created.id!, instanceToken: created.token! });
```

### Typical multi-tenant flow

```ts
// 1. Provision
const created = await partner.createInstance({ name: customer.name });
await db.instances.save({ customerId: customer.id, id: created.id, token: created.token });
await partner.subscribe({ instanceId: created.id!, instanceToken: created.token! });

// 2. Use (per request, from the DB)
const row = await db.instances.findByCustomer(customer.id);
const client = new ZAPI({ instanceId: row.id, token: row.token, clientToken: row.clientToken });
await client.messages.sendText({ phone, message });

// 3. Deprovision
await partner.cancel({ instanceId: row.id, instanceToken: row.token });
```

---

## Coverage

The SDK now wraps the full Z-API collection. Every method is verified against
the Postman collection's method, path, and body.

| Resource      | Methods |
| ------------- | ------- |
| `messages`    | sendText, sendImage, sendAudio, sendVideo, sendDocument, sendLocation, sendContact, sendContacts, sendLink, sendReaction, removeReaction, forward, sendSticker, sendGif, sendPtv, sendProduct, sendCatalog, sendButtonList, sendButtonActions, sendButtonOtp, sendButtonPix, sendOptionList, sendPoll, sendPollVote, sendOrder, updateOrderStatus, updateOrderPayment, pin, sendNewsletterAdminInvite, sendEvent, editEvent, sendEventResponse, readMessage, delete |
| `instance`    | getStatus, getMe, getDevice, getQrCodeImage, getQrCode, getPhoneCode, restart, disconnect, updateName, updateProfileName, updateProfilePicture, updateProfileDescription, updateAutoReadMessage, updateCallRejectAuto, updateCallRejectMessage |
| `chats`       | list, get, modify, setExpiration |
| `contacts`    | list, get, phoneExists, phoneExistsBatch, getProfilePicture, modifyBlocked, report |
| `groups`      | create, updateName, updatePhoto, updateDescription, addParticipant, removeParticipant, approveParticipant, addAdmin, removeAdmin, leave, getMetadata, getInvitationMetadata, redefineInvitationLink, acceptInvite, updateSettings |
| `webhooks`    | updateReceived, updateDelivery, updateReceivedDelivery, updateMessageStatus, updateConnected, updateDisconnected, updateChatPresence |
| `calls`       | send |
| `privacy`     | getDisallowedContacts, setLastSeen, setProfilePhoto, setDescription, setGroupAdd, setOnline, setReadReceipts, setMessagesDuration |
| `mobile`      | checkRegistrationAvailable, requestRegistrationCode, respondCaptcha, confirmRegistrationCode, confirmPinCode, recoverPinCode, hasTwoFa, setTwoFa, removeTwoFa, getEmail, setEmail, verifyEmail, removeEmail, requestUnbanning |
| `status`      | sendText, sendImage |
| `queue`       | list, clear, deleteMessage |
| `communities` | create, list, getMetadata, delete, linkGroups, unlinkGroups, redefineInvitationLink, addParticipant, removeParticipant, addAdmin, removeAdmin, updateSettings |
| `newsletters` | create, list, getMetadata, delete, search, updateName, updatePicture, updateDescription, follow, unfollow, mute, unmute, updateSettings, acceptAdminInvite, removeAdmin, revokeAdminInvite, transferOwnership |
| `business`    | createProduct, getCatalogs, getCatalogByPhone, getProduct, deleteProduct, getTags, getTagColors, createTag, editTag, deleteTag, addTagToChat, removeTagFromChat, configCatalog, createCollection, listCollections, deleteCollection, editCollection, listCollectionProducts, addProductsToCollection, removeProductsFromCollection, setCompanyDescription, setCompanyEmail, setCompanyAddress, setCompanyWebsites, setBusinessHours, getAvailableCategories, setCategories |
| `ZAPIPartner` | createInstance, listInstances, subscribe, cancel |

### Notes

- Path IDs (newsletter/group/community/product IDs) are URL-encoded; e.g. a
  newsletter id `120…@newsletter` is sent with `@` percent-encoded, which the
  API decodes.
- Group "reject participant" shares the exact endpoint and body as
  `approveParticipant` in the collection, so it is not exposed as a separate
  method.
