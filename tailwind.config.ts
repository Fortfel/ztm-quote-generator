import type { Config } from 'tailwindcss'
import plugin = require('tailwindcss/plugin')
import defaultTheme = require('tailwindcss/defaultTheme')
import { consoleLogNode } from './src/_utility'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }
      md: '768px',
      // => @media (min-width: 768px) { ... }
      lg: '1024px',
      // => @media (min-width: 1024px) { ... }
      xl: '1280px',
      // => @media (min-width: 1280px) { ... }
      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        // sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
    },
  },
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
    /**
     * Adds bg-stripes functionality
     */
    plugin(function ({ addUtilities, matchUtilities, theme }) {
      const utilities = {}
      const themeColors = theme('colors')

      const addColor = (name, color, bgColor = 'transparent') =>
        (utilities[`.bg-stripes-${name}`] = {
          backgroundColor: bgColor,
          backgroundImage: `linear-gradient(135deg, ${color} 10%, transparent 0, transparent 50%, ${color} 0, ${color} 60%, transparent 0, transparent)`,
          backgroundSize: '7.07px 7.07px',
        })

      for (const [name, value] of Object.entries<string>(themeColors)) {
        const colorValues = typeof value === 'object' ? value : { base: value }

        let previousNumber = null
        for (const [shade, color] of Object.entries<string>(colorValues)) {
          const [r, g, b, a] = toRgba(color, 50)
          const [pr, pg, pb, pa] = previousNumber
            ? toRgba(previousNumber, 10)
            : [r, g, b, 0.1]

          addColor(
            `${name}-${shade}`,
            rgbaToHex(r, g, b, a),
            rgbaToHex(pr, pg, pb, pa),
          )

          previousNumber = color
        }
      }

      addUtilities(utilities)

      matchUtilities({
        'bg-stripes': (value: any) => {
          const color = rgbaToHex(...toRgba(value, 50))
          const bgColor = rgbaToHex(...toRgba(value, 10))
          return {
            backgroundColor: `${bgColor}`,
            backgroundImage: `linear-gradient(135deg, ${color} 10%, transparent 0, transparent 50%, ${color} 0, ${color} 60%, transparent 0, transparent)`,
            backgroundSize: '7.07px 7.07px',
          }
        },
      })
    }),
  ],
  corePlugins: {
    preflight: true, // set to true to normalize all styes in a browser
  },
} satisfies Config

// Utility functions
const toRgba = (
  hexCode: string,
  opacity = 50,
): [number, number, number, number] => {
  let hex = hexCode.replace('#', '')

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const a = opacity / 100 // Convert opacity to a decimal value

  return [r, g, b, a] // Return as an array
}

const rgbaToHex = (r: number, g: number, b: number, a = 1) => {
  const toHex = (value: number) => value.toString(16).padStart(2, '0') // Convert to hex and pad with zero if needed

  const rHex = toHex(r)
  const gHex = toHex(g)
  const bHex = toHex(b)
  const aHex = toHex(Math.round(a * 255)) // Convert alpha to a hex value (range 0-255)

  return `#${rHex}${gHex}${bHex}${a < 1 ? aHex : ''}` // Append alpha if less than 1
}
