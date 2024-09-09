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
      <settings-page v-if="mainStore.showSettings" />
      <div id="contacts" v-else-if="!mainStore.selectedContact">
        <contact-item
          v-for="contact in mainStore.contacts"
          :key="contact.email"
          :contact="contact"
          @click="selectContact(contact)"
          class="contact-item"
        />
      </div>
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
import { nextTick, onMounted, watchEffect } from 'vue'
import { useMainStore } from './stores/main'
import ContactItem from './components/ContactItem.vue'
import ContactDetail from './components/ContactDetail.vue'
import SettingsPage from './components/SettingsPage.vue'

const mainStore = useMainStore()

const isOutlook = mainStore.info.host === Office.HostType.Outlook

onMounted(() => {
  if (Office.context?.mailbox?.item) {
    mainStore.parseItem(Office.context.mailbox.item)
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
    console.log('scrolling to', scrollPosition)
    nextTick(() => {
      window.scrollTo(0, scrollPosition)
    })
  }
})

function showSettings() {
  mainStore.showSettings = true
  window.scrollTo(0, 0)
}
</script>
<style scoped>
.contact-item {
  padding: 8px;
}
#app-body {
  flex-direction: column;
}
</style>
