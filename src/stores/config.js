let config

/*
[
  {
    "name": "PB",
    "auth_url": "http://localhost:8090/login.html",
    "search_url": "http://localhost:8090/search_email?q=",
    "create_url": "http://localhost:8090/api/collections/contacts/records"
  },
  {
    "name": "EMBA",
    "search_url": "http://localhost:8000/api/search_email?q=",
    "disabled": true
  }
]
*/

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
    if (source.disabled) return acc
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
