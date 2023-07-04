import { Application } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { pingRouter } from "./routes/ping.ts";
import logger from "./logger.ts";

const PORT = 8080;

const app = new Application();

app.use(logger.middleware);
app.use(pingRouter.routes());
app.use(pingRouter.allowedMethods());

logger.info(`🚀 Server is running on port: ${PORT}`);

await app.listen({ port: PORT });
