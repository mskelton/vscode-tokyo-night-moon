// @ts-check
import fs from "node:fs/promises"

/** @param {Record<string, any>} json */
function createTheme(json) {
  json.name = "Tokyo Night Moon"
  json.author = "Mark Skelton"
  json.maintainers = ["Mark Skelton <info@mskelton.dev>"]
  json.semanticClass = "tokyo-night-moon"

  // Map all the colors to the new palette
  json.semanticTokenColors = Object.fromEntries(
    Object.entries(json.semanticTokenColors).map(([key, value]) => {
      value.foreground = applyColor(value.foreground)
      value.background = applyColor(value.background)

      return [key, value]
    }),
  )

  json.colors = Object.fromEntries(
    Object.entries(json.colors).map(([key, value]) => {
      return [key, applyColor(value)]
    }),
  )

  json.tokenColors = json.tokenColors.map((/** @type {any} */ token) => {
    if (token.settings) {
      token.settings.foreground = applyColor(token.settings.foreground)
      token.settings.background = applyColor(token.settings.background)
    }

    return token
  })

  // Manual overrides
  json.colors["editorSuggestWidget.selectedBackground"] = palette.bgHighlight

  return json
}

const seen = new Set()
const mapped = new Set()

/** @param {string} color */
function parseColor(color) {
  const [_, hex, alpha] = color.match(/^#([0-9a-f]{3,6})([0-9a-f]{2})?$/i) ?? []

  if (hex.length === 3) {
    return [`#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`, alpha]
  }

  return [`#${hex}`, alpha]
}

/** @param {string | undefined} color */
function applyColor(color) {
  if (!color) {
    return color
  }

  const [hex, alpha] = parseColor(color)
  seen.add(hex)

  if (colorMap[hex]) {
    mapped.add(hex)
    return `${colorMap[color]}${alpha ?? ""}`
  }

  return colorMap[color] || color
}

const palette = {
  bg: "#222436",
  bgDark: "#1e2030",
  bgHighlight: "#2f334d",
  blue0: "#3e68d7",
  blue1: "#65bcff",
  blue2: "#0db9d7",
  blue5: "#89ddff",
  blue6: "#b4f9f8",
  blue7: "#394b70",
  blue: "#82aaff",
  comment: "#7a88cf",
  cyan: "#86e1fc",
  dark3: "#545c7e",
  dark5: "#737aa2",
  fg: "#c8d3f5",
  fgDark: "#828bb8",
  fgGutter: "#3b4261",
  green1: "#4fd6be",
  green2: "#41a6b5",
  green: "#c3e88d",
  magenta2: "#ff007c",
  magenta: "#c099ff",
  orange: "#ff966c",
  purple: "#fca7ea",
  red1: "#c53b53",
  red: "#ff757f",
  teal: "#4fd6be",
  terminalBlack: "#444a73",
  yellow: "#ffc777",
}

const colorMap = {
  "#000000": "#000000",
  "#007a75": "",
  "#0d0f17": "",
  "#0da0ba": "",
  "#0db9d7": "",
  "#0f0f14": "",
  "#101014": "",
  "#111117": "",
  "#13131a": "",
  "#14141b": "",
  "#16161e": "",
  "#164846": "",
  "#1a1b26": "",
  "#1abc9c": "",
  "#1b1e2e": "",
  "#1c1d29": "",
  "#1c5957": "",
  "#1e202e": "",
  "#1f202e": "",
  "#20222c": "",
  "#202330": "",
  "#222333": "",
  "#232433": "",
  "#25aac2": "",
  "#282a3b": "",
  "#292e42": "",
  "#29355a": "",
  "#2ac3de": "",
  "#2b2b3b": "",
  "#363b54": "",
  "#394b70": "",
  "#3b3e52": "",
  "#3d59a1": "",
  "#414761": "",
  "#41a6b5": "",
  "#42465d": "",
  "#425882": "",
  "#449dab": "",
  "#4e5579": "",
  "#506fca": "",
  "#515670": "",
  "#51597d": "",
  "#515c7e": "",
  "#545c7e": "",
  "#5a638c": "",
  "#6183bb": "",
  "#61bdf2": "",
  "#646e9c": "",
  "#668ac4": "",
  "#68b3de": "",
  "#698cd6": "",
  "#6d91de": "",
  "#703438": "",
  "#73daca": "",
  "#747ca1": "",
  "#787c99": "",
  "#7aa2f7": "",
  "#7dcfff": "",
  "#7e83b2": "",
  "#80a856": "",
  "#823c41": "",
  "#85353e": "",
  "#868bc4": "",
  "#89ddff": "",
  "#914c54": "",
  "#944449": "",
  "#963c47": "",
  "#9699a8": "",
  "#9a7ecc": "",
  "#9aa5ce": "",
  "#9abdf5": "",
  "#9d7cd8": "",
  "#9ece6a": "",
  "#a6333f": "",
  "#a9b1d6": "",
  "#acb0d0": "",
  "#b267e6": "",
  "#b4f9f8": "",
  "#ba3c97": "",
  "#bb616b": "",
  "#bb9af7": "",
  "#bba461": "",
  "#bbc2e0": "",
  "#c0caf5": "",
  "#c0cefc": "",
  "#c24242": "",
  "#c2985b": "",
  "#c49a5a": "",
  "#c97018": "",
  "#d9d4cd": "",
  "#db4b4b": "",
  "#de5971": "",
  "#e0af68": "",
  "#e2bd3a": "",
  "#f7768e": "",
  "#fc7b7b": "",
  "#ff5370": "",
  "#ff9e64": "",
  "#ffdb69": "",
  "#ffffff": "#ffffff",
}

const raw = await fs.readFile(
  new URL("../themes/tokyo-night-color-theme.json", import.meta.url),
  "utf-8",
)

const json = JSON.parse(raw.replace(/\/\/.*/g, ""))
const theme = createTheme(json)

seen.forEach((color) => {
  if (mapped.has(color)) {
    return
  }

  console.log(`Unmapped color: ${color}`)
})

await fs.writeFile(
  new URL("../themes/tokyo-night-moon-color-theme.json", import.meta.url),
  JSON.stringify(theme, null, 2),
)
