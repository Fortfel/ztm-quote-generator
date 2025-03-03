/**
 * Represents a quote from the ZenQuotes API
 */
export type ApiResponse = Array<{
  /** The quote text */
  q: string
  /** The author of the quote */
  a: string
  /** The image URL (if any) */
  i: string
  /** The category or context */
  c: string
  /** The HTML formatted quote */
  h: string
}>

/**
 * Structure for caching quotes with timestamp
 */
type CacheItem = {
  /** When the cache was created */
  timestamp: number
  /** The cached quote data */
  data: ApiResponse
}

/**
 * Client for fetching and managing quotes from ZenQuotes API
 * Includes caching functionality and timeout handling
 */
class QuoteClient {
  /** @see https://cors-anywhere.herokuapp.com/ */
  private readonly CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
  private readonly API_URL = 'https://zenquotes.io/api/quotes/'

  /** Default timeout for HTTP requests in milliseconds */
  private readonly HTTP_TIMEOUT = 5000
  private readonly CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds
  /** Key used for localStorage caching */
  private readonly CACHE_NAME = 'cache_quotes'

  /**
   * Fetches quotes from the API or cache
   * @param timeout - Request timeout in milliseconds
   * @param useCache - Whether to use cached data if available
   * @returns Promise resolving to an array of quotes
   * @throws Error if the API request fails
   */
  public async getQuotes(timeout = this.HTTP_TIMEOUT, useCache = true): Promise<ApiResponse> {
    if (useCache) {
      const cachedData = this.getFromCache(this.CACHE_NAME)
      if (cachedData) {
        console.log('Loading quotes from cache')
        return cachedData
      }
    }

    const requests = Array.from({ length: 2 }, () =>
      this.fetchWithTimeout<ApiResponse>((import.meta.env.DEV ? this.CORS_PROXY : '') + this.API_URL, {
        options: { method: 'GET' },
        timeout,
      }),
    )

    const responses = await Promise.all(requests)
    const combinedResponses = responses.flat()

    if (useCache) {
      this.saveToCache(this.CACHE_NAME, combinedResponses)
    }

    return combinedResponses
  }

  /**
   * Removes all cached quotes from localStorage
   */
  public cleanCache(): void {
    localStorage.removeItem(this.CACHE_NAME)
  }

  /**
   * Gets statistics about the cached quotes
   * @returns Object containing item count and total size in bytes
   */
  public getCacheStats(): { itemCount: number; totalSize: number } {
    let itemCount = 0
    let totalSize = 0

    const cacheItem = localStorage.getItem(this.CACHE_NAME)
    if (cacheItem) {
      totalSize = this.CACHE_NAME.length * 2 + cacheItem.length * 2
      try {
        const cacheData = JSON.parse(cacheItem) as CacheItem
        itemCount = cacheData.data.length
      } catch (error) {
        console.error('Error parsing cache data:', error)
      }
    }

    return { itemCount, totalSize }
  }

  /**
   * Saves quote data to localStorage
   * @param key - Cache key
   * @param data - Quote data to cache
   */
  private saveToCache(key: string, data: ApiResponse): void {
    try {
      const cacheItem: CacheItem = {
        timestamp: Date.now(),
        data,
      }
      localStorage.setItem(key, JSON.stringify(cacheItem))
    } catch (error) {
      console.error('Error saving to cache:', error)
    }
  }

  /**
   * Retrieves cached quote data if available and valid
   * @param key - Cache key
   * @returns Cached quote data or null if not found/invalid
   */
  private getFromCache(key: string): ApiResponse | null {
    try {
      const cacheData = localStorage.getItem(key)
      if (!cacheData) return null

      const cacheItem = JSON.parse(cacheData) as CacheItem
      if (!this.isCacheValid(cacheItem)) {
        localStorage.removeItem(key)
        return null
      }

      return cacheItem.data
    } catch (error) {
      console.error('Error retrieving from cache:', error)
      return null
    }
  }

  /**
   * Checks if cached data is still valid based on timestamp
   * @param cacheItem - The cache item to validate
   * @returns boolean indicating if cache is still valid
   */
  private isCacheValid(cacheItem: CacheItem): boolean {
    return Date.now() - cacheItem.timestamp < this.CACHE_DURATION
  }

  /**
   * Fetches data from URL with timeout functionality
   * @param url - The URL to fetch from
   * @param params - Object containing fetch options including timeout
   * @returns Promise resolving to the API response
   * @throws Error if request times out or fails
   */
  private async fetchWithTimeout<TApiResponse>(
    url: string,
    {
      options,
      timeout = this.HTTP_TIMEOUT,
    }: {
      options: RequestInit
      timeout: number
    },
  ): Promise<TApiResponse> {
    const controller = new AbortController()
    const id = setTimeout(() => {
      controller.abort()
    }, timeout)

    try {
      const response = await fetch(url, { ...options, signal: controller.signal })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status.toString()}`)
      }

      return (await response.json()) as TApiResponse
    } finally {
      clearTimeout(id)
    }
  }
}

export { QuoteClient }
