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

type Options = {
  attempts: number
}

type Parameters = {
  options?: Partial<Options>
}

class App {
  //TODO[fortf] use WeakMap or WeakSet here?
  //TODO[fortf] use WeakMap for eventlisteners?
  //TODO[fortf] add compose and pipe to utilities / usage with arr.reduce
  public domRefs: Readonly<DOMReferences>
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
   * @returns An object containing references to DOM elements.
   */
  private initDomRefs(): DOMReferences {
    return {
      app: document.querySelector('#app') as HTMLElement,
    }
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
