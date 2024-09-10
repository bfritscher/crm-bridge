const colorPrefixes = [
  'Red',
  'Green',
  'DarkOrange',
  'Yellow',
  'Berry',
  'LightGreen',
  'Marigold',
  'DarkRed',
  'Cranberry',
  'Pumpkin',
  'Peach',
  'Gold',
  'Brass',
  'Brown',
  'Forest',
  'Seafoam',
  'DarkGreen',
  'LightTeal',
  'Teal',
  'Steel',
  'Blue',
  'RoyalBlue',
  'Cornflower',
  'Navy',
  'Lavender',
  'Purple',
  'Grape',
  'Lilac',
  'Pink',
  'Magenta',
  'Plum',
  'Beige',
  'Mink',
  'Platinum'
]

function hashString(str) {
  if (!str) {
    return 0
  }
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

export function getColors(str) {
  const prefix = colorPrefixes[hashString(str) % colorPrefixes.length]
  return {
    background: `var(--colorPalette${prefix}Background2)`,
    foreground: `var(--colorPalette${prefix}Foreground2)`
  }
}
