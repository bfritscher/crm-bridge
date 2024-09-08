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
      <!-- add event/task/comment? -->
      <!-- related group members -->
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
      <div
        v-if="!mainStore.showSettings && !mainStore.selectedContact"
        id="settings-icon"
        aria-label="Settings"
        tabindex="0"
        @click="mainStore.showSettings = true"
      >
        <i class="ms-Icon enlarge ms-Icon--Settings ms-fontColor-white"></i>
      </div>
    </main>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
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

function selectContact(contact) {
  if (mainStore.selectedContact === contact || contact.isNotFound) return
  mainStore.selectedContact = contact
}
</script>
<style scoped>
.contact-item {
  padding: 8px;
}
</style>

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
