import Color from 'color-convert'
// import design from '@/design'

// W3C Compliant -> https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
// Return true if color is dark following W3C rules
export function isDarkBackgroundColor (color) {
  const rgb = Color.hex.rgb(color)
  const C = [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255]

  C.forEach((ratio, index) => {
    if (ratio <= 0.03928) {
      C[index] = ratio / 12.92
    } else {
      C[index] = Math.pow((ratio + 0.055) / 1.055, 2.4)
    }
  })
  const L = 0.2126 * C[0] + 0.7152 * C[1] + 0.0722 * C[2]

  return (L < 0.179)
  // return (Color.hex.hsl(color)[2] < 55)
}

// Update main theme color
export function getFontColorForBackground (backgroundColor) {
  return isDarkBackgroundColor(backgroundColor)
    ? '#fff'
    : '#000'
//    ? design['global-color-light-text'] : design['global-color-dark-text']
}
