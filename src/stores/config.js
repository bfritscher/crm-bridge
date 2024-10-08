import { ref } from 'vue'
import { useMainStore } from './main'

let config

export function getConfig() {
  const mainStore = useMainStore()
  if (!config) {
    if (mainStore.isOutlook) {
      config = Office.context.roamingSettings.get('config')
    } else {
      config = JSON.parse(localStorage.getItem('CRM-bridge-config') || '[]')
    }
  }
  return config || []
}

export function setConfig(newconfig) {
  const mainStore = useMainStore()
  if (mainStore.isOutlook) {
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
  } else {
    localStorage.setItem('CRM-bridge-config', JSON.stringify(newconfig))
    config = newconfig
    return Promise.resolve(config)
  }
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
  document.querySelector('meta[name="theme-color"]').setAttribute('content', isDark.value ? '#121212' : '#ffffff');
}

applyThemeColor()

export function toggleThemeColor() {
  isDark.value = !isDark.value
  localStorage.setItem('CRM-bridge-theme-color', isDark.value ? DARK : LIGHT)
  applyThemeColor()
}
