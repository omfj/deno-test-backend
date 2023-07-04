import { Router } from "https://deno.land/x/oak@v12.5.0/mod.ts";

export const pingRouter = new Router({
  prefix: "/ping",
});

pingRouter.get("/", (ctx) => {
  ctx.response.body = "pong";
});

pingRouter.get("/:count", (ctx) => {
  const { count } = ctx.params;

  const parsedCount = parseInt(count);

  if (isNaN(parsedCount)) {
    ctx.response.status = 400;
    ctx.response.body = "Invalid count";
    return;
  }

  ctx.response.headers.set("Content-Type", "application/json");
  ctx.response.body = JSON.stringify(Array(parsedCount).fill("pong"));
});
