<template>
  <div class="contact-detail">
    <contact-item
      v-if="mainStore.selectedContact"
      :contact="mainStore.selectedContact"
      hide-info
      hide-title
      avatar-size="64px"
      @click="mainStore.selectedContact = undefined"
    />
    if editMode
    <label>Firstname <input type="text" /></label>
    <label>Lastname <input type="text" /></label>
    <label>Email <input type="email" /></label>
    <label>Title <input type="text" /></label>
    <label>Info <textarea></textarea></label>
    auto field from detailed contact lookup?
    <button @click="mainStore.selectedContact = undefined">back</button>
    <button>save</button>
    comment? add event/task/comment Timeline
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMainStore } from '@/stores/main'

import ContactItem from './ContactItem.vue'

const mainStore = useMainStore()
</script>
