// import { getFontColorForBackground } from '@/utils/color.util'

const mainColor = '#mainColor'
const fontColor = '#fontColor'
// --vdp : Vue Date picker color variables
const style = `.theme-text-color { color: ${mainColor}; }
    .theme-background-color { color: ${fontColor}; background-color: ${mainColor}; }
    .theme-hover-background-color:hover { color: ${fontColor}; background-color: ${mainColor}; }
    .theme-hover-text-color:hover { color: ${mainColor}; }
    .theme-border-color { border-color: ${mainColor} !important; }
    body { --vdp-selected-bg-color: ${mainColor}; --vdp-hover-bg-color: ${mainColor}; }`

// Update main theme color
export function setMainColor (color) {
  const regExp = new RegExp(mainColor, 'g')
  const fontRegExp = new RegExp(fontColor, 'g')
  color = color.indexOf('#') === -1 ? `#${color}` : color

  // Get text color
  // const textColor = getFontColorForBackground(color)
  const textColor = '#fff'

  const themeTag = document.getElementById('theme-color')
  if (themeTag != null) {
    themeTag.innerHTML = style.replace(regExp, color).replace(fontRegExp, textColor)
  }
}
