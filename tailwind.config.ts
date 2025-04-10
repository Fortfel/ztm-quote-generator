import type { Config } from 'tailwindcss'

import defaultTheme from 'tailwindcss/defaultTheme'
import { consoleLogNode } from './src/_utility'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    //TODO[fortf] Removing background during autocomplete for inputs etc
    // https://stackoverflow.com/questions/2781549/removing-input-background-colour-for-chrome-autocomplete
    // https://stackoverflow.com/questions/64148246/tailwindcss-input-field-change-in-react
    // https://stackoverflow.com/questions/75919757/autofill-input-in-dark-mode-with-tailwind
    // https://github.com/tailwindlabs/tailwindcss/discussions/8679     - put same styles in tailwind.css file as in this topic?

    require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/container-queries'),
    // https://github.com/jamiebuilds/tailwindcss-animate/tree/main
    // require('./plugins/bg-stripes')({
    //   // Optional configuration
    //   size: '7.07px',
    //   angle: '135deg',
    //   opacity: 50,
    //   bgOpacity: 10,
    // }),
  ],
} satisfies Config
