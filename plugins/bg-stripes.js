import plugin from 'tailwindcss/plugin'

// Default styles
const defaultStyles = {
  size: '7.07px',
  angle: '135deg',
  opacity: 50,
  bgOpacity: 10,
}

// Helper to create color with opacity
const withOpacity = (color, opacity) => {
  // Handle direct hex values
  if (typeof color === 'string') {
    if (color.startsWith('oklch(')) {
      const values = color.slice(6, -1).split(' ')
      return `oklch(${values[0]} ${values[1]} ${values[2]} / ${opacity / 100})`
    }
    if (color.startsWith('#')) {
      return `${color} / ${opacity}%`
    }
    if (color.startsWith('rgb(')) {
      return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity / 100})`)
    }
    if (color.startsWith('rgba(')) {
      return color.replace(/[\d.]+\)$/, `${opacity / 100})`)
    }
  }
  // Return a default value if color is not in an expected format
  return `currentColor / ${opacity}%`
}

module.exports = plugin.withOptions(
  function (options = {}) {
    return function ({ addUtilities, matchUtilities, theme }) {
      const config = { ...defaultStyles, ...options }
      const utilities = {}
      const themeColors = theme('colors')

      const addColor = (name, color, prevColor = null) => {
        // Skip if color is not a string or is undefined
        if (typeof color !== 'string' || !color) return

        const stripeColor = withOpacity(color, config.opacity)
        const bgColor = prevColor ? withOpacity(prevColor, config.bgOpacity) : withOpacity(color, config.bgOpacity)

        utilities[`.bg-stripes-${name}`] = {
          backgroundColor: bgColor,
          backgroundImage: `linear-gradient(${config.angle}, ${stripeColor} 10%, transparent 0, transparent 50%, ${stripeColor} 0, ${stripeColor} 60%, transparent 0, transparent)`,
          backgroundSize: `${config.size} ${config.size}`,
        }
      }

      // Generate utilities for theme colors
      if (themeColors && typeof themeColors === 'object') {
        for (const [name, value] of Object.entries(themeColors)) {
          // Skip if value is null, undefined, or not an expected type
          if (!value) continue

          // Handle both direct colors and color scales
          if (typeof value === 'string') {
            // Direct color value (like black or white)
            addColor(name, value)
          } else if (typeof value === 'object') {
            // Color scale object
            let previousColor = null
            for (const [shade, color] of Object.entries(value)) {
              if (!color || typeof color !== 'string') continue
              const colorKey = shade === 'DEFAULT' ? name : `${name}-${shade}`
              addColor(colorKey, color, previousColor)
              previousColor = color
            }
          }
        }
      }

      addUtilities(utilities)

      // Add arbitrary value support
      matchUtilities({
        'bg-stripes': (value) => {
          if (!value || typeof value !== 'string') return {}
          return {
            backgroundColor: withOpacity(value, config.bgOpacity),
            backgroundImage: `linear-gradient(${config.angle}, ${withOpacity(value, config.opacity)} 10%, transparent 0, transparent 50%, ${withOpacity(value, config.opacity)} 0, ${withOpacity(value, config.opacity)} 60%, transparent 0, transparent)`,
            backgroundSize: `${config.size} ${config.size}`,
          }
        },
      })
    }
  },
  function (options) {
    return {
      theme: {
        extend: {},
      },
    }
  },
)
