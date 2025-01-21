import '@/style/tailwind.css'
import { tw } from '@/_utility'

//TODO[fortf] README

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
  //TODO[fortf] use WeakMap for eventlisteners?
  //TODO[fortf] add compose and pipe to utilities / usage with arr.reduce
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

  private initialize(): void {
    this.setupBodyClass()
  }

  /**
   * Sets up the body class.
   */
  private setupBodyClass(): void {
    document.body.classList.add(
      ...tw`space-between minh-screen m-0 flex justify-center bg-slate-900 text-slate-400 antialiased`.split(' '),
    )
  }
}

new App()
