import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./setup.js";
import { ZAPIPartner, ZAPIError } from "../src/index.js";

const BASE = "https://api.z-api.io";
const PARTNER_TOKEN = "partner-abc";

function makePartner(overrides = {}) {
  return new ZAPIPartner({ partnerToken: PARTNER_TOKEN, maxRetries: 0, ...overrides });
}

describe("ZAPIPartner config", () => {
  it("throws when partnerToken is missing", () => {
    delete process.env.ZAPI_PARTNER_TOKEN;
    expect(() => new ZAPIPartner()).toThrow(ZAPIError);
  });

  it("reads partnerToken from env", () => {
    process.env.ZAPI_PARTNER_TOKEN = "env-partner";
    expect(() => new ZAPIPartner()).not.toThrow();
    delete process.env.ZAPI_PARTNER_TOKEN;
  });
});

describe("createInstance", () => {
  it("posts to the root on-demand path with Bearer auth and body", async () => {
    let captured: { auth: string | null; body: unknown } | undefined;
    server.use(
      http.post(`${BASE}/instances/integrator/on-demand`, async ({ request }) => {
        captured = {
          auth: request.headers.get("Authorization"),
          body: await request.json(),
        };
        return HttpResponse.json({ id: "new1", token: "tok1" });
      }),
    );

    const res = await makePartner().createInstance({
      name: "Instance A",
      sessionName: "session",
      businessDevice: true,
    });

    expect(res).toEqual({ id: "new1", token: "tok1" });
    expect(captured?.auth).toBe(`Bearer ${PARTNER_TOKEN}`);
    expect(captured?.body).toEqual({
      name: "Instance A",
      sessionName: "session",
      businessDevice: true,
    });
  });
});

describe("listInstances", () => {
  it("gets /instances with query params and Bearer auth", async () => {
    let query: URLSearchParams | undefined;
    let auth: string | null = null;
    server.use(
      http.get(`${BASE}/instances`, ({ request }) => {
        const u = new URL(request.url);
        query = u.searchParams;
        auth = request.headers.get("Authorization");
        return HttpResponse.json([{ id: "i1", name: "One" }]);
      }),
    );

    const res = await makePartner().listInstances({
      query: "15",
      middleware: "web",
      page: 1,
      pageSize: 15,
    });

    expect(res).toEqual([{ id: "i1", name: "One" }]);
    expect(auth).toBe(`Bearer ${PARTNER_TOKEN}`);
    expect(query?.get("query")).toBe("15");
    expect(query?.get("middleware")).toBe("web");
    expect(query?.get("page")).toBe("1");
    expect(query?.get("pageSize")).toBe("15");
  });
});

describe("subscribe / cancel", () => {
  it("subscribe posts to the instance-scoped subscription path", async () => {
    let hit = false;
    server.use(
      http.post(
        `${BASE}/instances/inst1/token/itok1/integrator/on-demand/subscription`,
        ({ request }) => {
          hit = request.headers.get("Authorization") === `Bearer ${PARTNER_TOKEN}`;
          return HttpResponse.json({ value: true });
        },
      ),
    );
    await makePartner().subscribe({ instanceId: "inst1", instanceToken: "itok1" });
    expect(hit).toBe(true);
  });

  it("cancel posts to the instance-scoped cancel path", async () => {
    let hit = false;
    server.use(
      http.post(
        `${BASE}/instances/inst1/token/itok1/integrator/on-demand/cancel`,
        () => {
          hit = true;
          return HttpResponse.json({ value: true });
        },
      ),
    );
    await makePartner().cancel({ instanceId: "inst1", instanceToken: "itok1" });
    expect(hit).toBe(true);
  });
});
