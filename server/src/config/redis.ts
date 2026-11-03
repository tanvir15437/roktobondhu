import Redis from 'ioredis';
import { ENV } from './env';

class InMemoryCache {
  private store: Map<string, { value: string; expiry: number | null }> = new Map();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK'> {
    let expiry: number | null = null;
    if (mode === 'EX' && duration) {
      expiry = Date.now() + duration * 1000;
    }
    this.store.set(key, { value, expiry });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async keys(pattern: string): Promise<string[]> {
    const allKeys = Array.from(this.store.keys());
    if (pattern === '*') return allKeys;
    const regexPattern = pattern.replace(/\*/g, '.*');
    const regex = new RegExp(`^${regexPattern}$`);
    return allKeys.filter((k) => regex.test(k));
  }

  async flushall(): Promise<'OK'> {
    this.store.clear();
    return 'OK';
  }
}

// Global cache instance
let redisClient: Redis | null = null;
let isRedisConnected = false;
const memoryCache = new InMemoryCache();

export const initRedis = (): void => {
  try {
    const client = new Redis(ENV.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      retryStrategy: () => null, // do not reconnect infinitely if offline
      lazyConnect: true,
    });

    client
      .connect()
      .then(() => {
        isRedisConnected = true;
        redisClient = client;
        console.log(`[Redis] Connected successfully to ${ENV.REDIS_URL}`);
      })
      .catch((err) => {
        isRedisConnected = false;
        console.log(`[Redis] Offline (${err.message}). Using resilient in-memory cache.`);
      });

    client.on('error', (err) => {
      isRedisConnected = false;
      // quiet log
    });
  } catch (err: any) {
    console.log(`[Redis] Could not initialize client. Using in-memory cache.`);
  }
};

export const getCacheClient = (): {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, mode?: string, duration?: number) => Promise<any>;
  del: (key: string) => Promise<any>;
  keys: (pattern: string) => Promise<string[]>;
  isLiveRedis: () => boolean;
} => {
  if (isRedisConnected && redisClient) {
    return {
      get: (k) => redisClient!.get(k),
      set: (k, v, m, d) => (m && d ? redisClient!.set(k, v, m as any, d) : redisClient!.set(k, v)),
      del: (k) => redisClient!.del(k),
      keys: (p) => redisClient!.keys(p),
      isLiveRedis: () => true,
    };
  }

  return {
    get: (k) => memoryCache.get(k),
    set: (k, v, m, d) => memoryCache.set(k, v, m, d),
    del: (k) => memoryCache.del(k),
    keys: (p) => memoryCache.keys(p),
    isLiveRedis: () => false,
  };
};

