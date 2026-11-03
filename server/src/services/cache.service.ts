import { getCacheClient } from '../config/redis';

export class CacheService {
  /**
   * Get cached object
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const client = getCacheClient();
      const cached = await client.get(key);
      if (!cached) return null;
      return JSON.parse(cached) as T;
    } catch {
      return null;
    }
  }

  /**
   * Set cached object with TTL in seconds (default 300s = 5 mins)
   */
  static async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    try {
      const client = getCacheClient();
      const serialized = JSON.stringify(value);
      await client.set(key, serialized, 'EX', ttlSeconds);
    } catch (err) {
      console.error(`[Cache] Error setting key ${key}:`, err);
    }
  }

  /**
   * Delete a single key
   */
  static async del(key: string): Promise<void> {
    try {
      const client = getCacheClient();
      await client.del(key);
    } catch (err) {
      console.error(`[Cache] Error deleting key ${key}:`, err);
    }
  }

  /**
   * Invalidate all keys matching a pattern (e.g. "requests:*")
   */
  static async invalidatePattern(pattern: string): Promise<void> {
    try {
      const client = getCacheClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        for (const k of keys) {
          await client.del(k);
        }
      }
    } catch (err) {
      console.error(`[Cache] Error invalidating pattern ${pattern}:`, err);
    }
  }

  /**
   * Invalidate all request-related caches
   */
  static async invalidateRequestCaches(): Promise<void> {
    await this.invalidatePattern('requests:*');
    await this.del('requests:urgent');
    await this.del('requests:homepage_feed');
  }
}

