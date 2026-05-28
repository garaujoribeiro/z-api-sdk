import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./setup.js";
import { ZAPI } from "../src/index.js";

const BASE = "https://api.z-api.io";
const url = (path: string) => `${BASE}/instances/i/token/t${path}`;
const client = new ZAPI({ instanceId: "i", token: "t", clientToken: "c", maxRetries: 0 });

async function captureBody(method: "post" | "put" | "delete", path: string) {
  let body: unknown;
  let seen = false;
  const handler = async ({ request }: { request: Request }) => {
    seen = true;
    const text = await request.text();
    body = text ? JSON.parse(text) : undefined;
    return HttpResponse.json({ ok: true });
  };
  server.use(http[method](url(path), handler));
  return () => ({ body, seen });
}

describe("messages extras", () => {
  it("sendContacts posts the contacts array", async () => {
    const get = await captureBody("post", "/send-contacts");
    await client.messages.sendContacts({
      phone: "55",
      contacts: [{ name: "A", phones: ["55"] }],
    });
    expect(get().body).toEqual({ phone: "55", contacts: [{ name: "A", phones: ["55"] }] });
  });

  it("pin posts messageAction + duration", async () => {
    const get = await captureBody("post", "/pin-message");
    await client.messages.pin({
      phone: "55",
      messageId: "M1",
      messageAction: "pin",
      pinMessageDuration: "7_days",
    });
    expect(get().body).toEqual({
      phone: "55",
      messageId: "M1",
      messageAction: "pin",
      pinMessageDuration: "7_days",
    });
  });

  it("sendButtonPix uses pixKey + type", async () => {
    const get = await captureBody("post", "/send-button-pix");
    await client.messages.sendButtonPix({ phone: "55", pixKey: "k", type: "CPF" });
    expect(get().body).toEqual({ phone: "55", pixKey: "k", type: "CPF" });
  });
});

describe("calls", () => {
  it("send uses callDuration", async () => {
    const get = await captureBody("post", "/send-call");
    await client.calls.send({ phone: "55", callDuration: 5 });
    expect(get().body).toEqual({ phone: "55", callDuration: 5 });
  });
});

describe("privacy", () => {
  it("setGroupAdd uses the `type` key", async () => {
    const get = await captureBody("post", "/privacy/group-add");
    await client.privacy.setGroupAdd({ type: "CONTACT_BLACKLIST", contactsBlacklist: [] });
    expect(get().body).toEqual({ type: "CONTACT_BLACKLIST", contactsBlacklist: [] });
  });

  it("getDisallowedContacts sends type query", async () => {
    let q: URLSearchParams | undefined;
    server.use(
      http.get(url("/privacy/disallowed-contacts"), ({ request }) => {
        q = new URL(request.url).searchParams;
        return HttpResponse.json([]);
      }),
    );
    await client.privacy.getDisallowedContacts("groupAdd");
    expect(q?.get("type")).toBe("groupAdd");
  });

  it("setReadReceipts sends value query", async () => {
    let q: URLSearchParams | undefined;
    server.use(
      http.post(url("/privacy/read-receipts"), ({ request }) => {
        q = new URL(request.url).searchParams;
        return HttpResponse.json({ ok: true });
      }),
    );
    await client.privacy.setReadReceipts("enable");
    expect(q?.get("value")).toBe("enable");
  });
});

describe("communities", () => {
  it("linkGroups uses groupsPhones", async () => {
    const get = await captureBody("post", "/communities/link");
    await client.communities.linkGroups({
      communityId: "c1",
      groupsPhones: ["120-group"],
    });
    expect(get().body).toEqual({ communityId: "c1", groupsPhones: ["120-group"] });
  });
});

describe("newsletter", () => {
  it("follow puts an id body", async () => {
    const get = await captureBody("put", "/follow-newsletter");
    await client.newsletters.follow("120@newsletter");
    expect(get().body).toEqual({ id: "120@newsletter" });
  });

  it("delete sends id in the DELETE body", async () => {
    const get = await captureBody("delete", "/delete-newsletter");
    await client.newsletters.delete("120@newsletter");
    expect(get().body).toEqual({ id: "120@newsletter" });
  });

  it("updateSettings posts to id-scoped path", async () => {
    const get = await captureBody("post", "/newsletter/settings/n1");
    await client.newsletters.updateSettings("n1", { reactionCodes: "basic" });
    expect(get().body).toEqual({ reactionCodes: "basic" });
  });
});

describe("business", () => {
  it("createTag posts name + numeric color", async () => {
    const get = await captureBody("post", "/business/create-tag");
    await client.business.createTag({ name: "VIP", color: 1 });
    expect(get().body).toEqual({ name: "VIP", color: 1 });
  });

  it("listCollectionProducts sends collectionId query on phone path", async () => {
    let q: URLSearchParams | undefined;
    server.use(
      http.get(url("/catalogs/collection-products/55"), ({ request }) => {
        q = new URL(request.url).searchParams;
        return HttpResponse.json([]);
      }),
    );
    await client.business.listCollectionProducts("55", "col1");
    expect(q?.get("collectionId")).toBe("col1");
  });

  it("addTagToChat puts to the add path", async () => {
    let hit = false;
    server.use(
      http.put(url("/chats/55/tags/tag1/add"), () => {
        hit = true;
        return HttpResponse.json({ ok: true });
      }),
    );
    await client.business.addTagToChat("55", "tag1");
    expect(hit).toBe(true);
  });

  it("setCompanyWebsites wraps the array", async () => {
    const get = await captureBody("post", "/business/company-websites");
    await client.business.setCompanyWebsites(["https://x.com"]);
    expect(get().body).toEqual({ websites: ["https://x.com"] });
  });
});

describe("status & queue", () => {
  it("status.sendText posts message", async () => {
    const get = await captureBody("post", "/send-text-status");
    await client.status.sendText({ message: "hi" });
    expect(get().body).toEqual({ message: "hi" });
  });

  it("queue.deleteMessage deletes by id", async () => {
    let hit = false;
    server.use(
      http.delete(url("/queue/M1"), () => {
        hit = true;
        return HttpResponse.json({ ok: true });
      }),
    );
    await client.queue.deleteMessage("M1");
    expect(hit).toBe(true);
  });
});

describe("instance & groups extras", () => {
  it("updateAutoReadMessage puts a boolean value", async () => {
    const get = await captureBody("put", "/update-auto-read-message");
    await client.instance.updateAutoReadMessage(false);
    expect(get().body).toEqual({ value: false });
  });

  it("groups.acceptInvite sends url query", async () => {
    let q: URLSearchParams | undefined;
    server.use(
      http.get(url("/accept-invite-group"), ({ request }) => {
        q = new URL(request.url).searchParams;
        return HttpResponse.json({ ok: true });
      }),
    );
    await client.groups.acceptInvite("https://chat.whatsapp.com/abc");
    expect(q?.get("url")).toBe("https://chat.whatsapp.com/abc");
  });
});
