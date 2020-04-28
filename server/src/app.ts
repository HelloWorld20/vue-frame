import routes from "./routes";
import * as config from "./modules/config";
import { createApp } from "./modules/app";
import middlewares from "./middlewares";
import errorHandler from "./middlewares/error-handler";

function create() {
  const app = createApp({
    routes,
    middlewares,
    errorHandler,
    views: config.get("static.distDir") || ""
  });
  app.enable("trust proxy");
  return app;
}

export default { create };
