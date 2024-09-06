<template>
  <div class="ms-font-m ms-Fabric">
    <section v-if="!isOutlook" id="sideload-msg">
      <h2 class="ms-font-xl">
        Please
        <a
          target="_blank"
          href="https://learn.microsoft.com/office/dev/add-ins/testing/test-debug-office-add-ins#sideload-an-office-add-in-for-testing"
          >sideload</a
        >
        your add-in to see app body.
      </h2>
    </section>
    <main id="app-body" v-else>
      <!-- search input or tab? -->
      <!-- add contact -->
      <!-- details link or dialog? -->
      <!-- add event/task/comment? -->
      <!-- related group members -->
      <div id="contacts" v-if="!mainStore.selectedContact">
        <contact-item v-for="contact in contacts" :key="contact.email" :contact="contact" @click="selectContact(contact)"/>
      </div>
      <div v-else>
        <contact-detail :contact="mainStore.selectedContact" />
      </div>
      <div id="settings-icon" aria-label="Settings" tabindex="0" @click="openDialog">
        <i class="ms-Icon enlarge ms-Icon--Settings ms-fontColor-white"></i>
      </div>
    </main>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, reactive, nextTick } from 'vue'
import { useMainStore } from './stores/main'
import ContactItem from './components/ContactItem.vue'
import ContactDetail from './components/ContactDetail.vue'

const mainStore = useMainStore()

const isOutlook = mainStore.info.host === Office.HostType.Outlook
const BLACKLIST = []
BLACKLIST.push(Office.context.mailbox.userProfile.emailAddress)
const contacts = ref([])

Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, () => {
  parseItem(Office.context.mailbox.item)
})

function parseItem(item) {
  if (!item) return
  const emails = new Set([item.from].concat(item.to).concat(item.cc).concat(item.bcc))
  const rawcontacts = [
    ...[...emails]
      .filter((c) => !BLACKLIST.includes(c.emailAddress))
      .map((c) => reactive({ email: c.emailAddress, displayName: c.displayName, isLoading: true }))
  ]
  rawcontacts.forEach((contact) => {
    loadEmail(contact.email)
      .then((update) => {
        contact.isLoading = false
        Object.assign(contact, update)
      })
      .catch((error) => {
        contact.isLoading = false
        contact.isNotFound = true
      })
  })
  contacts.value = rawcontacts
}

onMounted(() => {
  parseItem(Office.context.mailbox.item)
})

const CACHE = {}

const services = [
  {
    name: 'PB',
    endpoint: 'http://localhost:8090',
    token:
      ''
  },
  {
    name: 'EMBA',
    endpoint: 'http://localhost:8000/api',
    token: ''
  }
]

async function loadEmail(email) {
  if (CACHE.hasOwnProperty(email)) {
    return CACHE[email]
  }
  return Promise.any(
    services.map((service) => {
      return fetch(`${service.endpoint}/search_email?q=${email}`, {
        headers: {
          Authorization: `Bearer ${service.token}`
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((data) => {
          data._service = service.name
          CACHE[email] = data
          return data
        })
    })
  )
}

function selectContact(contact) {
  if (mainStore.selectedContact === contact || contact.isNotFound) return
  mainStore.selectedContact = contact
}

let settingsDialog;

function receiveMessage(event) {
  console.log('receiveMessage', event.message)
}

function dialogClosed(event) {
  console.log('dialogClosed', event)
}

function openDialog() {
  const dialogOptions = { width: 40, height: 40, displayInIframe: false }

  Office.context.ui.displayDialogAsync('https://localhost:3000/login.html?url=https://crm.bf0.ch/login.html', dialogOptions, function (asyncResult) {
    settingsDialog = asyncResult.value
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      console.log(asyncResult.error.code + ': ' + asyncResult.error.message)
    } else {
      settingsDialog.addEventHandler(Office.EventType.DialogMessageReceived, receiveMessage)
      settingsDialog.addEventHandler(Office.EventType.DialogEventReceived, dialogClosed)
    }
  })
}
</script>



<style>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  color: var(--body-fg-color);
  background-color: var(--body-bg-color);
}
#app-body {
  flex-direction: column;
}
.ms-Fabric {
  color: var(--body-fg-color);
}

</style>
