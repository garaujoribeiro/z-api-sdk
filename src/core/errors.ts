export class ZAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/** Raised when the request never reached the API (DNS, socket, timeout, abort). */
export class APIConnectionError extends ZAPIError {
  readonly cause?: unknown;

  constructor(message = "Connection error.", cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}

export class APITimeoutError extends APIConnectionError {
  constructor(cause?: unknown) {
    super("Request timed out.", cause);
  }
}

/** Raised when the API responds with a non-2xx status. */
export class APIError extends ZAPIError {
  readonly status: number;
  readonly body: unknown;
  readonly requestId?: string;

  constructor(status: number, body: unknown, message?: string, requestId?: string) {
    super(message ?? APIError.messageFromBody(status, body));
    this.status = status;
    this.body = body;
    this.requestId = requestId;
  }

  private static messageFromBody(status: number, body: unknown): string {
    if (body && typeof body === "object") {
      const maybe = body as Record<string, unknown>;
      const detail = maybe.message ?? maybe.error ?? maybe.value;
      if (typeof detail === "string") return `${status}: ${detail}`;
    }
    if (typeof body === "string" && body.length > 0) return `${status}: ${body}`;
    return `Request failed with status code ${status}`;
  }
}

export class BadRequestError extends APIError {}
export class AuthenticationError extends APIError {}
export class PermissionDeniedError extends APIError {}
export class NotFoundError extends APIError {}
export class ConflictError extends APIError {}
export class UnprocessableEntityError extends APIError {}
export class RateLimitError extends APIError {}
export class InternalServerError extends APIError {}

export function makeApiError(
  status: number,
  body: unknown,
  requestId?: string,
): APIError {
  switch (status) {
    case 400:
      return new BadRequestError(status, body, undefined, requestId);
    case 401:
      return new AuthenticationError(status, body, undefined, requestId);
    case 403:
      return new PermissionDeniedError(status, body, undefined, requestId);
    case 404:
      return new NotFoundError(status, body, undefined, requestId);
    case 409:
      return new ConflictError(status, body, undefined, requestId);
    case 422:
      return new UnprocessableEntityError(status, body, undefined, requestId);
    case 429:
      return new RateLimitError(status, body, undefined, requestId);
  }
  if (status >= 500) return new InternalServerError(status, body, undefined, requestId);
  return new APIError(status, body, undefined, requestId);
}
