<template>
  <div class="contact-detail">
    <contact-item
      v-if="mainStore.selectedContact"
      :contact="mainStore.selectedContact"
      hide-info
      hide-title
      avatar-size="64px"
      @click="back"
    />
    <div v-if="contact" class="c-edit" :class="{ lock: isSaving }">
      <div>
        <div v-for="field in mainStore.selectedContact._meta.fields" :key="field">
          <label :for="`c_${field}`">{{ field }}</label>
        </div>
      </div>
      <div class="flex">
        <div v-for="field in mainStore.selectedContact._meta.fields" :key="field">
          <textarea
            v-if="mainStore.selectedContact._meta?.textarea?.includes(field)"
            :id="`c_${field}`"
            v-model="contact[field]"
          ></textarea>
          <input v-else :id="`c_${field}`" type="text" v-model="contact[field]" />
        </div>
      </div>
    </div>
    <div class="d-flex justify-right">
      <button @click="save" class="btn btn-primary" :disabled="isSaving">Save</button>
      <button @click="back" class="btn" :disabled="isSaving">Back</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useMainStore } from '@/stores/main'

import ContactItem from './ContactItem.vue'

const mainStore = useMainStore()
const contact = ref()
const isSaving = ref(false)

watchEffect(() => {
  if (mainStore.selectedContact && mainStore.selectedContact._meta.resource_url) {
    fetch(mainStore.selectedContact._meta.resource_url, {
      headers: {
        Authorization: `Bearer ${mainStore.tokens[mainStore.selectedContact._meta.source.name]}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        contact.value = data
      })
  }
})
function back() {
  mainStore.selectedContact = undefined
}

async function save() {
  isSaving.value = true
  try {
    const rawResponse = await fetch(mainStore.selectedContact._meta.resource_url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${mainStore.tokens[mainStore.selectedContact._meta.source.name]}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        Object.fromEntries(
          Object.entries(contact.value).filter(([key]) =>
            mainStore.selectedContact._meta.fields.includes(key)
          )
        )
      )
    })
    if (!rawResponse.ok) {
      throw new Error('Failed to save contact')
    }
    Object.assign(
      mainStore.selectedContact,
      await mainStore.searchDataSourceEmail(
        mainStore.selectedContact._meta.source,
        mainStore.selectedContact.email
      )
    )
    back()
  } catch (error) {
    console.error(error)
  } finally {
    isSaving.value = false
  }
}
</script>
<style scoped>
.contact-detail {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.c-edit {
  display: flex;
  gap: 1rem;
  margin: 1rem 0 0.5rem 0;
}
.c-edit div {
  margin-bottom: 0.2rem;
  display: flex;
  flex-direction: column;
}
label::first-letter {
  text-transform: capitalize;
}
.flex {
  flex: 1;
}
.lock {
  pointer-events: none;
  opacity: 0.5;
}
</style>
