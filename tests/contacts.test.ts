import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./setup.js";
import { ZAPI } from "../src/index.js";

const BASE = "https://api.z-api.io";
const url = (path: string) => `${BASE}/instances/i/token/t${path}`;

const client = new ZAPI({ instanceId: "i", token: "t", clientToken: "c", maxRetries: 0 });

describe("Contacts", () => {
  it("list passes pagination as query params", async () => {
    let query: URLSearchParams | undefined;
    server.use(
      http.get(url("/contacts"), ({ request }) => {
        query = new URL(request.url).searchParams;
        return HttpResponse.json([{ phone: "55", name: "Ana" }]);
      }),
    );
    const res = await client.contacts.list({ page: 2, pageSize: 50 });
    expect(res).toEqual([{ phone: "55", name: "Ana" }]);
    expect(query?.get("page")).toBe("2");
    expect(query?.get("pageSize")).toBe("50");
  });

  it("get encodes the phone into the path", async () => {
    server.use(
      http.get(url("/contacts/5511999"), () => HttpResponse.json({ phone: "5511999" })),
    );
    const res = await client.contacts.get("5511999");
    expect(res).toEqual({ phone: "5511999" });
  });

  it("phoneExists hits /phone-exists/{phone}", async () => {
    server.use(
      http.get(url("/phone-exists/5511999"), () =>
        HttpResponse.json({ exists: true, phone: "5511999" }),
      ),
    );
    const res = await client.contacts.phoneExists("5511999");
    expect(res.exists).toBe(true);
  });

  it("modifyBlocked posts an action field", async () => {
    let body: unknown;
    server.use(
      http.post(url("/contacts/modify-blocked"), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ value: true });
      }),
    );
    await client.contacts.modifyBlocked({ phone: "55", action: "block" });
    expect(body).toEqual({ phone: "55", action: "block" });
  });
});
