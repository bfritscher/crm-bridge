import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { getConfig } from '../stores/config'

export const CACHE = {}

export const useMainStore = defineStore('main', () => {
  const info = ref()
  const selectedContact = ref()
  const showSettings = ref(false)

  const tokens = ref(JSON.parse(localStorage.getItem('CRM-bridge-tokens') || '{}'))

  function saveTokens() {
    localStorage.setItem('CRM-bridge-tokens', JSON.stringify(tokens.value))
  }

  const dataSourcesInvalidTokens = new Set()

  async function loadEmail(email) {
    if (Object.prototype.hasOwnProperty.call(CACHE, email)) {
      return CACHE[email]
    }
    return Promise.any(
      getConfig().map((source) => {
        if (source.disabled) {
          return Promise.reject('Source is disabled')
        }
        return searchDataSource(source, email)
      })
    )
  }

  function searchDataSource(source, email) {
    return fetch(`${source.search_url}${email}`, {
      headers: {
        Authorization: `Bearer ${tokens.value[source.name]}`
      }
    })
      .then((response) => {
        if (response.status === 401) {
          handleMissingTokens(source)
          throw new Error('Invalid token')
        }
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        if (!Object.prototype.hasOwnProperty.call(data, '_meta')) {
          data._meta = {}
        }
        data._meta.source = source
        CACHE[email] = data
        return data
      })
  }

  const BLACKLIST = []
  if (Office.context?.mailbox?.userProfile?.emailAddress) {
    BLACKLIST.push(Office.context.mailbox.userProfile.emailAddress)
  }
  const contacts = ref([])

  Office.context?.mailbox?.addHandlerAsync(Office.EventType.ItemChanged, () => {
    parseItem(Office.context.mailbox.item)
  })

  function parseItem(item) {
    if (!item) return
    const emails = new Set([item.from].concat(item.to).concat(item.cc).concat(item.bcc))
    const rawcontacts = [
      ...[...emails]
        .filter((c) => !BLACKLIST.includes(c.emailAddress))
        .map((c) => {
          const parts = c.displayName.split(' ')
          let firstname = parts.shift()
          let lastname = ''
          if (parts.length > 0) {
            lastname = parts.join(' ')
          }
          const emailparts = c.emailAddress.split('@')[0].split('.')
          if (emailparts.length > 1) {
            // switch for hes-so directory
            if (lastname.toLowerCase().includes(emailparts[0].toLowerCase())) {
              ;[firstname, lastname] = [lastname, firstname]
            }
          }
          return reactive({ email: c.emailAddress, firstname, lastname, isLoading: true })
        })
    ]
    rawcontacts.forEach((contact) => {
      loadEmail(contact.email)
        .then((update) => {
          contact.isLoading = false
          Object.assign(contact, update)
        })
        .catch(() => {
          contact.isLoading = false
          contact.isNotFound = true
        })
    })
    contacts.value = rawcontacts
  }

  function handleMissingTokens(source) {
    if (dataSourcesInvalidTokens.has(source)) {
      return
    }
    openAuthDialog(source)
  }

  function openAuthDialog(source) {
    dataSourcesInvalidTokens.add(source)
    const dialogOptions = { width: 40, height: 40, displayInIframe: false }
    Office.context.ui.displayDialogAsync(
      //https://crm.bf0.ch/login.html
      `${window.location.protocol}//${window.location.host}/login.html?url=${source.auth_url}`,
      dialogOptions,
      function (asyncResult) {
        const settingsDialog = asyncResult.value
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
          console.error(asyncResult.error.code + ': ' + asyncResult.error.message)
          dataSourcesInvalidTokens.delete(source)
        } else {
          settingsDialog.addEventHandler(Office.EventType.DialogMessageReceived, (event) => {
            tokens.value[source.name] = event.message
            saveTokens()
            dataSourcesInvalidTokens.delete(source)
            settingsDialog.close()
            parseItem(Office.context.mailbox.item)
          })
          settingsDialog.addEventHandler(Office.EventType.DialogEventReceived, (event) => {
            console.log('dialog closed', event)
            dataSourcesInvalidTokens.delete(source)
          })
        }
      }
    )
  }

  async function addContact(option, contact) {
    const mapping = Object.assign(
      {
        email: 'email',
        firstname: 'firstname',
        lastname: 'lastname'
      },
      option.mapping
    )
    const data = {
      [mapping.email]: contact.email,
      [mapping.firstname]: contact.firstname,
      [mapping.lastname]: contact.lastname
    }
    console.log('addContact', option, data)
    await fetch(option.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokens.value[option.source.name]}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    // refresh contact
    Object.assign(
      contact,
      { isNotFound: false },
      await searchDataSource(option.source, contact.email)
    )
    selectedContact.value = contact
  }

  return {
    info,
    selectedContact,
    showSettings,
    contacts,
    tokens,
    parseItem,
    loadEmail,
    searchDataSource,
    addContact
  }
})
