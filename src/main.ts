import '@/style/tailwind.css'
import { tw } from '@/_utility'

/**
 * Represents references to DOM elements used in the application.
 */
type DOMReferences = {
  /** Reference to the main application container element. */
  app: HTMLElement
}

/**
 * Options for configuring the application.
 */
type Options = {
  attempts: number
}

/**
 * Configuration parameters for the application.
 */
type Parameters = {
  /** Optional configuration options for the application. */
  options?: Partial<Options>
}

class App {
  public readonly domRefs: Readonly<DOMReferences>
  private readonly options: Readonly<Options>
  private readonly defaultOptions = {
    attempts: 5,
  } as const satisfies Options

  /**
   * Creates a new instance of the application.
   * @param options - Optional configuration for the application.
   */
  constructor({ options }: Parameters = {}) {
    this.options = { ...this.defaultOptions, ...options }
    this.domRefs = this.initDomRefs()

    this.initialize()
    const div = document.createElement('div')
    div.className = 'bg-stripes-fuchsia-300 sm:bg-red-500 font-poppins'
    div.innerText = 'KEK'
    this.domRefs.app.appendChild(div)
  }

  /**
   * Initializes the DOM references for the application.
   * @throws Error if the app element is not found.
   * @returns An object containing references to DOM elements.
   */
  private initDomRefs(): Readonly<DOMReferences> {
    const app = document.querySelector<HTMLElement>('#app')
    if (!app) throw new Error('App element not found')

    return Object.freeze({
      app,
    })
  }

  private initialize(): void {}
}

var a = '<div class="min-h-screen"></div>'

new App()
