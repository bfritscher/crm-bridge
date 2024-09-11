<template>
  <div class="ms-font-m ms-Fabric">
    <header v-if="!mainStore.isOutlook" class="d-flex align-center">
      <img src="@/assets/crmbridge.svg" alt="CRM Bridge" class="logo" />
      <h2 class="ms-font-xl">
        CRM Bridge
      </h2>
    </header>
    <main id="app-body">
      <settings-page v-if="mainStore.showSettings" />
      <template v-else-if="!mainStore.selectedContact">
        <div class="search-box">
          <input
            @input="searchContact($event.target.value)"
            placeholder="Search"
            class="search"
            v-model="searchQuery"
          />
          <div class="count" v-if="mainStore.contacts.length > 5">{{ mainStore.contacts.length }} results</div>
          <button v-if="searchQuery" @click="clearSearch" class="clear-button">X</button>
        </div>
        <div
          v-if="mainStore.isComposeMode && mainStore.contacts.length > 0 && searchQuery.length > 1"
        >
          <div class="d-flex justify-right">
            <button @click="addAllMail('to')" class="button">To</button>
            <button @click="addAllMail('cc')" class="button">Cc</button>
            <button @click="addAllMail('bcc')" class="button">Bcc</button>
          </div>
        </div>
        <div id="contacts">
          <contact-item
            v-for="contact in mainStore.contacts"
            :key="contact.email"
            :contact="contact"
            @click="selectContact(contact)"
            class="contact-item"
          />
        </div>
      </template>
      <div v-else>
        <contact-detail :contact="mainStore.selectedContact" />
      </div>
      <div v-if="!mainStore.showSettings && !mainStore.selectedContact" class="d-flex">
        <a class="button" aria-label="Settings" tabindex="0" @click="showSettings">
          <i class="ms-Icon ms-Icon--Settings"></i>
        </a>
      </div>
    </main>
  </div>
</template>
<script setup>
import { nextTick, onMounted, watchEffect, ref } from 'vue'
import { useMainStore } from './stores/main'
import ContactItem from './components/ContactItem.vue'
import ContactDetail from './components/ContactDetail.vue'
import SettingsPage from './components/SettingsPage.vue'
import { debounce, addMailRecipients } from './utils'

const mainStore = useMainStore()

onMounted(() => {
  if (Office.context?.mailbox?.item) {
    mainStore.parseItem(Office.context.mailbox.item)
    Office.context.mailbox.item.addHandlerAsync(Office.EventType.RecipientsChanged, () => {
      if (searchQuery.value < 1) {
        mainStore.parseItem(Office.context.mailbox.item)
      }
    })
  }
})

let scrollPosition

function selectContact(contact) {
  if (mainStore.selectedContact === contact || contact.isNotFound) return
  scrollPosition = window.scrollY
  mainStore.selectedContact = contact
}

watchEffect(() => {
  if (mainStore.selectedContact) {
    window.scrollTo(0, 0)
  } else {
    nextTick(() => {
      window.scrollTo(0, scrollPosition)
    })
  }
})

const searchQuery = ref('')
const searchContact = debounce(mainStore.searchContact, 250)
function clearSearch() {
  searchQuery.value = ''
  searchContact('')
}

function showSettings() {
  mainStore.showSettings = true
  window.scrollTo(0, 0)
}

function addAllMail(type) {
  addMailRecipients(
    type,
    mainStore.contacts.map((c) => {
      return {
        emailAddress: c.email,
        displayName: `${c.firstname} ${c.lastname}`
      }
    })
  )
}
</script>
<style scoped>
.logo {
  height: 32px;
  margin-right: 8px;
}
header {
  padding: 8px;
  color: var(--neutralDark);
  background-color: var(--neutralPrimarySurface);
}
.contact-item {
  padding: 8px;
}
.search-box {
  position: relative;
}
.search {
  width: 100%;
  padding: 8px;
  border-bottom-color: var(--neutralPrimary);
}

.count {
  position: absolute;
  right: 30px;
  top: 8px;
  color: var(--neutralPrimary);
  font-size: 12px;
}

.clear-button {
  position: absolute;
  right: 4px;
  top: 0;
}
#app-body {
  flex-direction: column;
}
</style>
