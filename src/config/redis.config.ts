// src/lib/redis.ts
import dotenv from "dotenv";
dotenv.config(); 
import { createClient } from "redis";

const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD!,
  socket: {
    host: "redis-10752.c301.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 10752,
  },
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

let isConnected = false;

export async function getRedisClient() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return client;
}
