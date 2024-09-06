import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
  const info = ref()
  const selectedContact = ref()
  
  return { info, selectedContact }
})
