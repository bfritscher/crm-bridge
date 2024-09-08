<template>
  <div class="settings">
    <h3>Settings</h3>
    <textarea v-model="config" @input="validate"></textarea>
    <div v-if="errorMessage" class="ms-fontColor-red">{{ errorMessage }}</div>
    <button @click="save" :disabled="isSaving || !!errorMessage">save</button>
    <button @click="back" :disabled="isSaving">back</button>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getConfig, setConfig } from '../stores/config'
import { useMainStore } from '../stores/main'
const mainStore = useMainStore()
const config = ref()
const parsedConfig = ref()

const errorMessage = ref('')

onMounted(() => {
  config.value = JSON.stringify(getConfig(), null, 2)
})

function validate(event) {
  try {
    parsedConfig.value = JSON.parse(event.target.value)
    errorMessage.value = null
  } catch (error) {
    errorMessage.value = error
  }
}
const isSaving = ref(false)
function back() {
  mainStore.showSettings = false
}
async function save() {
  if (errorMessage.value) return
  isSaving.value = true
  try {
    await setConfig(parsedConfig.value)
    back()
  } catch (error) {
    console.error(error)
  } finally {
    isSaving.value = false
  }
}
</script>
<style scoped>
.settings {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
textarea {
  height: 200px;
  white-space: pre;
  font-family: monospace;
}
</style>
