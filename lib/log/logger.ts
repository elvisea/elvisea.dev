/**
 * Logger estruturado mínimo sobre `console`, sem dependência.
 *
 * - `pretty` (padrão fora de produção): JSON indentado, legível no terminal.
 * - `json` (padrão em produção): um evento por linha, para `docker logs` e
 *   agregadores.
 *
 * Cada evento: `{ ts, level, event, ...campos }`. `Error` vira
 * `{ name, message, code }` (com `stack` só no formato `pretty`), porque
 * `JSON.stringify(new Error())` resulta em `{}`.
 *
 * Nunca registrar nome, texto de mensagem nem e-mail/IP completos: usar
 * `lib/log/redact.ts`.
 */

export type LogFormat = "pretty" | "json";
export type LogLevel = "info" | "warn" | "error";
export type LogFields = Record<string, unknown>;

export interface Logger {
  info(event: string, fields?: LogFields): void;
  warn(event: string, fields?: LogFields): void;
  error(event: string, fields?: LogFields): void;
}

export interface LoggerOptions {
  format: LogFormat;
  /** Destino de cada linha; o padrão separa `error` (stderr) do resto. */
  write?: (level: LogLevel, line: string) => void;
  now?: () => Date;
}

export function resolveLogFormat(
  env: Record<string, string | undefined> = process.env,
): LogFormat {
  if (env.LOG_FORMAT === "pretty" || env.LOG_FORMAT === "json") {
    return env.LOG_FORMAT;
  }
  return env.NODE_ENV === "production" ? "json" : "pretty";
}

function serializeValue(value: unknown, format: LogFormat): unknown {
  if (value instanceof Error) {
    const code = (value as Error & { code?: unknown }).code;
    return {
      name: value.name,
      message: value.message,
      ...(code !== undefined ? { code } : {}),
      ...(format === "pretty" && value.stack ? { stack: value.stack } : {}),
    };
  }
  return value;
}

export function formatEvent(
  format: LogFormat,
  level: LogLevel,
  event: string,
  fields: LogFields,
  now: Date,
): string {
  const entry: LogFields = { ts: now.toISOString(), level, event };
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) entry[key] = serializeValue(value, format);
  }
  return format === "pretty"
    ? JSON.stringify(entry, null, 2)
    : JSON.stringify(entry);
}

function defaultWrite(level: LogLevel, line: string): void {
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}

export function createLogger({
  format,
  write = defaultWrite,
  now = () => new Date(),
}: LoggerOptions): Logger {
  const log =
    (level: LogLevel) =>
    (event: string, fields: LogFields = {}) =>
      write(level, formatEvent(format, level, event, fields, now()));

  return { info: log("info"), warn: log("warn"), error: log("error") };
}

/** Logger da aplicação. Em testes, espionar seus métodos (`spyOn(logger, "info")`). */
export const logger: Logger = createLogger({ format: resolveLogFormat() });
