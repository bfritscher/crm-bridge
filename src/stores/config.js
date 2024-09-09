import { ref } from 'vue'

let config

export function getConfig() {
  if (!config) {
    config = Office.context.roamingSettings.get('config')
  }
  return config || []
}

export function setConfig(newconfig) {
  Office.context.roamingSettings.set('config', newconfig)
  return new Promise((resolve, reject) => {
    Office.context.roamingSettings.saveAsync((result) => {
      if (result.status === Office.AsyncResultStatus.Failed) {
        reject(result.error)
      } else {
        config = newconfig
        resolve(config)
      }
    })
  })
}

function optionLabel(entry, source) {
  const option = {
    label: source.name,
    url: entry
  }
  if (Object.prototype.hasOwnProperty.call(entry, 'url')) {
    option.url = entry.url
  }
  if (entry.label) {
    option.label = entry.label
  }
  if (entry.mapping) {
    option.mapping = entry.mapping
  }
  option.source = source
  return option
}

export function getCreateOptions() {
  return getConfig().reduce((acc, source) => {
    if (!source.enabled) return acc
    if (source.create_url) {
      if (Array.isArray(source.create_url)) {
        source.create_url.forEach((entry) => {
          acc.push(optionLabel(entry, source))
        })
      } else {
        acc.push(optionLabel(source.create_url, source))
      }
    }
    return acc
  }, [])
}


export const DARK = 'dark'
export const LIGHT = 'light'

export const isDark = ref((localStorage.getItem('CRM-bridge-theme-color') || DARK) === DARK)

function applyThemeColor() {
  document.body.classList.toggle('dark', isDark.value)
}

applyThemeColor()

export function toggleThemeColor() {
  isDark.value = !isDark.value
  localStorage.setItem('CRM-bridge-theme-color', isDark.value ? DARK : LIGHT)
  applyThemeColor()
}
