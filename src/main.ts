import '@/style/tailwind.css'
import { throwIfNull } from '@/_utility'
import { ApiResponse, QuoteClient } from '@/js/_api.ts'

/**
 * Represents references to DOM elements used in the application
 */
type DOMReferences = Readonly<{
  /** Main application container element */
  app: HTMLElement
  /** Element displaying the quote text */
  quote: HTMLElement
  /** Element displaying the quote author */
  author: HTMLElement
  /** Button for sharing quote on Twitter */
  twitterButton: HTMLButtonElement
  /** Button for generating new quote */
  newQuoteButton: HTMLButtonElement
  /** Loading indicator element */
  loading: HTMLElement
}>

/**
 * Main application class responsible for managing the quote generator
 * Handles DOM interactions, quote fetching, and display logic
 */
class App {
  public readonly domRefs: DOMReferences
  public readonly quoteClient: QuoteClient
  public quotes: ApiResponse = []

  /** Threshold for long quote text that requires smaller font size */
  private readonly LONG_QUOTE_THRESHOLD = 120

  /**
   * Creates a new instance of the application
   */
  constructor() {
    this.domRefs = this.initDomRefs()
    this.quoteClient = new QuoteClient()

    this.initialize().catch((error: unknown) => {
      console.error('Error initializing app:', error)
    })
  }

  /**
   * Initializes the DOM references for the application
   * @throws Error if any required DOM element is not found
   * @returns Object containing references to DOM elements
   */
  private initDomRefs(): DOMReferences {
    const app = throwIfNull(document.querySelector<HTMLElement>('#app'), 'App element not found')
    const quote = throwIfNull(document.querySelector<HTMLElement>('#quote'), 'Quote element not found')
    const author = throwIfNull(document.querySelector<HTMLElement>('#author'), 'Author element not found')
    const twitterButton = throwIfNull(document.querySelector<HTMLButtonElement>('#twitter'), 'Twitter button not found') // prettier-ignore
    const newQuoteButton = throwIfNull(document.querySelector<HTMLButtonElement>('#new-quote'), 'New quote button not found') // prettier-ignore
    const loading = throwIfNull(document.querySelector<HTMLElement>('#loading'), 'Loading element not found')

    return Object.freeze({
      app,
      quote,
      author,
      twitterButton,
      newQuoteButton,
      loading,
    })
  }

  /**
   * Initializes the application by fetching quotes and setting up event handlers
   * @throws Error if quote fetching fails
   */
  private async initialize(): Promise<void> {
    // this.clearCache()
    this.quotes = await this.quoteClient.getQuotes()

    await this.displayNewQuote()
    this.bindEvents()
  }

  /**
   * Binds event listeners to DOM elements
   * Sets up click handlers for new quote and Twitter sharing
   */
  private bindEvents(): void {
    this.domRefs.newQuoteButton.addEventListener('click', () => {
      this.handleNewQuoteClick().catch((error: unknown) => {
        console.error('Error displaying new quote:', error)
      })
    })

    this.domRefs.twitterButton.addEventListener('click', () => {
      const quoteText = this.domRefs.quote.textContent || ''
      const authorText = this.domRefs.author.textContent || ''
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)} - ${encodeURIComponent(authorText)}`
      window.open(tweetUrl, '_blank')
    })
  }

  /**
   * Handles click event for new quote button
   * Shows loading state, displays new quote, and hides loading state
   */
  private async handleNewQuoteClick(): Promise<void> {
    this.showButtonLoading()
    try {
      await this.displayNewQuote()
    } finally {
      this.hideButtonLoading()
    }
  }

  /**
   * Displays a new random quote with animation delay
   * Adjusts text size based on quote length
   */
  private displayNewQuote(): Promise<void> {
    // symulate promise resolve in 1 - 2s
    return new Promise((resolve) => {
      setTimeout(
        () => {
          const randomIndex = Math.floor(Math.random() * this.quotes.length)
          const quote = this.quotes[randomIndex]

          // Check quote length to determine styling
          const longQuoteClasses = ['!text-2xl', 'lg:!text-3xl']

          if (quote.q.length > this.LONG_QUOTE_THRESHOLD) {
            this.domRefs.quote.classList.add(...longQuoteClasses)
          } else {
            this.domRefs.quote.classList.remove(...longQuoteClasses)
          }
          this.domRefs.quote.textContent = quote.q
          this.domRefs.author.textContent = quote.a || 'Unknown'
          this.hideLoading()

          resolve()
        },
        1000 + Math.floor(Math.random() * 1000),
      )
    })
  }

  /**
   * Hides the loading indicator and shows the quote icon
   */
  private hideLoading(): void {
    this.domRefs.loading.classList.add('hidden')
    this.domRefs.app.querySelector('.fas.fa-quote-left')?.classList.remove('!hidden')
  }

  /**
   * Shows loading state for the new quote button
   */
  private showButtonLoading(): void {
    this.domRefs.newQuoteButton.disabled = true
    this.domRefs.newQuoteButton.querySelector('svg')?.classList.remove('hidden')
  }

  /**
   * Hides loading state for the new quote button
   */
  private hideButtonLoading(): void {
    this.domRefs.newQuoteButton.disabled = false
    this.domRefs.newQuoteButton.querySelector('svg')?.classList.add('hidden')
  }

  /**
   * Clears the quote cache
   */
  public clearCache(): void {
    this.quoteClient.cleanCache()
    alert('Cache cleared successfully')
  }

  /**
   * Displays cache statistics in the console
   * Shows the number of cached items and total cache size
   */
  public displayCacheStats(): void {
    const stats = this.quoteClient.getCacheStats()
    const cacheSizeKB = (stats.totalSize / 1024).toFixed(2)
    console.log(`Cache contains ${stats.itemCount.toString()} items using approximately ${cacheSizeKB} KB`)
  }
}

new App()
