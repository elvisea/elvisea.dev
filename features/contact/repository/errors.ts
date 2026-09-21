/** Erro tipado das falhas operacionais do contato. */
export type ContactErrorCode =
  "RATE_LIMITED" | "NOT_CONFIGURED" | "SEND_FAILED";

export class ContactError extends Error {
  readonly code: ContactErrorCode;

  constructor(code: ContactErrorCode, message: string) {
    super(message);
    this.name = "ContactError";
    this.code = code;
  }
}
