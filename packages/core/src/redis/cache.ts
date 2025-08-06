import { RedisClientType } from "redis";
import { AppError } from "../error";

export class Cache extends AppError {
  private readonly client:RedisClientType;

  constructor(redisClient:RedisClientType) {
    super(Cache);
    this.client = redisClient
  }

  async set<T = Record<string, any>>(
    cache_key: string,
    payload: T,
    ttl?: number
  ) {
    try {

      const serialized = JSON.stringify(payload);

      if (ttl) {
        await this.client.setEx(cache_key, ttl, serialized);
      } else {
        await this.client.set(cache_key, serialized);
      }

      return true;
    } catch (error: any) {
      console.error(this.error(this.set, error));
      return false;
    }
  }

  async get<T = Record<string, any>>(cache_key: string): Promise<T | null> {
    try {

      const cached = await this.client.get(cache_key);

      if (cached) {
        return JSON.parse(cached) as T;
      }

      return null;
    } catch (error: any) {
      console.error(this.error(this.get, error));
      return null;
    }
  }

  async delete(cache_key: string): Promise<boolean> {
    try {

      const result =await this.client.del(cache_key);
      return result > 0;
    } catch (error: any) {
      console.error(this.error(this.delete, error));
      return false;
    }
  }

  async flush(): Promise<boolean> {
    try {

      await this.client.flushDb();
      return true;
    } catch (error: any) {
      throw this.error(this.flush, error);
    }
  }

  async flushAll(): Promise<void> {
    await this.client.flushAll();
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern);
  }

  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  async exists(key: string): Promise<boolean> {
    const count = await this.client.exists(key);
    return count > 0;
  }
}
