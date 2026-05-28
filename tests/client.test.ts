import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./setup.js";
import {
  ZAPI,
  ZAPIError,
  NotFoundError,
  RateLimitError,
  InternalServerError,
} from "../src/index.js";

const BASE = "https://api.z-api.io";
const INSTANCE = "inst123";
const TOKEN = "tok456";
const CLIENT_TOKEN = "ctok789";

function url(path: string): string {
  return `${BASE}/instances/${INSTANCE}/token/${TOKEN}${path}`;
}

function makeClient(overrides = {}) {
  return new ZAPI({
    instanceId: INSTANCE,
    token: TOKEN,
    clientToken: CLIENT_TOKEN,
    maxRetries: 0,
    ...overrides,
  });
}

describe("config resolution", () => {
  it("throws when instanceId is missing", () => {
    delete process.env.ZAPI_INSTANCE_ID;
    expect(() => new ZAPI({ token: TOKEN })).toThrow(ZAPIError);
  });

  it("throws when token is missing", () => {
    delete process.env.ZAPI_TOKEN;
    expect(() => new ZAPI({ instanceId: INSTANCE })).toThrow(ZAPIError);
  });

  it("reads credentials from env vars", () => {
    process.env.ZAPI_INSTANCE_ID = "envInst";
    process.env.ZAPI_TOKEN = "envTok";
    const client = new ZAPI();
    expect(client.baseURL).toBe(`${BASE}/instances/envInst/token/envTok`);
    delete process.env.ZAPI_INSTANCE_ID;
    delete process.env.ZAPI_TOKEN;
  });

  it("builds the base URL from explicit options", () => {
    expect(makeClient().baseURL).toBe(url(""));
  });
});

describe("request shaping", () => {
  it("hits the correct URL with Client-Token header and JSON body", async () => {
    let captured: { token: string | null; body: unknown } | undefined;
    server.use(
      http.post(url("/send-text"), async ({ request }) => {
        captured = {
          token: request.headers.get("Client-Token"),
          body: await request.json(),
        };
        return HttpResponse.json({ messageId: "ABC" });
      }),
    );

    const res = await makeClient().messages.sendText({
      phone: "5511999999999",
      message: "hi",
    });

    expect(res).toEqual({ messageId: "ABC" });
    expect(captured?.token).toBe(CLIENT_TOKEN);
    expect(captured?.body).toEqual({ phone: "5511999999999", message: "hi" });
  });
});

describe("error mapping", () => {
  it("maps 404 to NotFoundError", async () => {
    server.use(
      http.post(url("/send-text"), () =>
        HttpResponse.json({ error: "nope" }, { status: 404 }),
      ),
    );
    await expect(
      makeClient().messages.sendText({ phone: "1", message: "x" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("maps 429 to RateLimitError", async () => {
    server.use(
      http.post(url("/send-text"), () => HttpResponse.json({}, { status: 429 })),
    );
    await expect(
      makeClient().messages.sendText({ phone: "1", message: "x" }),
    ).rejects.toBeInstanceOf(RateLimitError);
  });

  it("retries on 5xx then surfaces InternalServerError", async () => {
    let calls = 0;
    server.use(
      http.post(url("/send-text"), () => {
        calls += 1;
        return HttpResponse.json({}, { status: 500 });
      }),
    );
    await expect(
      makeClient({ maxRetries: 2 }).messages.sendText({ phone: "1", message: "x" }),
    ).rejects.toBeInstanceOf(InternalServerError);
    expect(calls).toBe(3);
  });
});
