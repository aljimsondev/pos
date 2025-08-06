import { createClient, RedisClientOptions, RedisClientType } from "redis";

let client: RedisClientType | null;
let isConnected = false;

export async function createRedisClient(options:RedisClientOptions = {socket:{host:"127.0.0.1",port:6379}}) {
  const HOST = process.env.REDIS_HOST || "127.0.0.1";
  const PORT = (process.env.REDIS_PORT || 6379) as number;

  if (!client) {
    //DEVELOPMENT INSTANCE
    // if (process.env.NODE_ENV === "development") {
    //   client = createClient(options);
    // } else {
    //   //PRODUCTION INSTANCE
    //   const REDIS_URL = `rediss://default:${process.env.UPSTASH_REDIS_PASSWORD}@${process.env.UPSTASH_REDIS_ENDPOINT}:${process.env.UPSTASH_REDIS_PORT}`;
    //   client = createClient(options);
    // }
    client = createClient(options) as RedisClientType;
    client.on("error", (err) => console.error("Redis Client Error", err));
  }

  if (!isConnected && client) {
    await client.connect();
    console.log("✅ Cache Server is on !");
    if (process.env.NODE_ENV === "development") {
      console.log(`Cache Server is running on ${HOST}:${PORT}`);
    }
    isConnected = true;
  }

  return client;
}

// For development, you might want to disconnect when the app is closed
if (process.env.NODE_ENV === "development") {
  process.on("exit", async () => {
    if (client) {
      await client.quit();
    }
  });
}

