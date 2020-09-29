import type { Context } from "../../deps.ts";

async function parseJSON(src: Promise<URLSearchParams>) {
  const values = await src;
  const parsedBody: Record<string, string> = {};

  for (const [key, value] of values.entries()) {
    parsedBody[key] = value;
  }

  return parsedBody;
}

export async function bodyParser(ctx: Context, next: any) {
  if (ctx.state.body !== {}) ctx.state.body = {};

  if (ctx.request.hasBody) {
    const body = ctx.request.body();
    if (body.type === "form") ctx.state.body = await parseJSON(body.value);
  }

  await next();
}
