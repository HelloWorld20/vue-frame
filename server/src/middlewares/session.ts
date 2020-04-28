import * as session from "express-session";
import * as connectRedis from "connect-redis";

import * as config from "../modules/config";
const sessionConfig = config.get("session");
const redisConf = config.get("redis.session");

const redis = require("redis");

const client = redis.createClient({
  port: redisConf.server.port,
  host: redisConf.server.host,
  password: redisConf.server.password
});

const RedisStore = connectRedis(session);

export const createSession = function() {
  const redisStore = new RedisStore({ client });
  return session({ ...sessionConfig, store: redisStore });
};
