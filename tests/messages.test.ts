import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./setup.js";
import { ZAPI } from "../src/index.js";

const BASE = "https://api.z-api.io";
const url = (path: string) => `${BASE}/instances/i/token/t${path}`;

const client = new ZAPI({
  instanceId: "i",
  token: "t",
  clientToken: "c",
  maxRetries: 0,
});

describe("Messages", () => {
  it("sendImage posts to /send-image with the image body", async () => {
    let body: unknown;
    server.use(
      http.post(url("/send-image"), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ messageId: "img1" });
      }),
    );
    const res = await client.messages.sendImage({
      phone: "55",
      image: "https://x/y.png",
      caption: "hey",
    });
    expect(res).toEqual({ messageId: "img1" });
    expect(body).toEqual({ phone: "55", image: "https://x/y.png", caption: "hey" });
  });

  it("sendDocument puts the extension in the path", async () => {
    let body: unknown;
    server.use(
      http.post(url("/send-document/pdf"), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ messageId: "doc1" });
      }),
    );
    await client.messages.sendDocument({
      extension: "pdf",
      phone: "55",
      document: "https://x/y.pdf",
      fileName: "y.pdf",
    });
    expect(body).toEqual({ phone: "55", document: "https://x/y.pdf", fileName: "y.pdf" });
  });

  it("delete sends query params and DELETE verb", async () => {
    let query: URLSearchParams | undefined;
    server.use(
      http.delete(url("/messages"), ({ request }) => {
        query = new URL(request.url).searchParams;
        return HttpResponse.json({ deleted: true });
      }),
    );
    await client.messages.delete({ phone: "55", messageId: "M1", owner: true });
    expect(query?.get("phone")).toBe("55");
    expect(query?.get("messageId")).toBe("M1");
    expect(query?.get("owner")).toBe("true");
  });
});
