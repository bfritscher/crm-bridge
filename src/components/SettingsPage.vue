<template>
  <div class="settings">
    <h3>Settings</h3>
    <button @click="toggleThemeColor()">Toggle theme: {{ isDark ? 'Dark' : 'Light' }}</button>
    <h4 class="d-flex align-center">
      Data Sources
      <button @click="showJson = !showJson">
        <i v-if="showJson" class="ms-Icon ms-Icon--EditNote"></i>
        <i v-else class="ms-Icon ms-Icon--Code"></i>        
      </button>
    </h4>
    <div v-if="showJson">
      <textarea v-model="configJson" @input="validate"></textarea>
    </div>
    <template v-else>
    <div v-for="(ds, index) in config" :key="index" class="datasource">
      <div class="d-flex align-center">
        <input v-model="ds.name" placeholder="Data Source Name (unique)" required />
        <label><input v-model="ds.enabled" type="checkbox" /> Enabled</label>
        <div class="flex"></div>
        <button @click="removeDataSource(index)" class="ms-fontColor-red">X</button>
      </div>
      <label>AuthURL</label>
      <input v-model="ds.auth_url" placeholder="https://domain/login" />
      <label>SearchURL</label>
      <input v-model="ds.search_url" placeholder="https://domain/search?email=" />
      <label>CreateURLs</label>
      <div v-if="Array.isArray(ds.create_url)" class="create-urls">
        <div v-for="(create_url, index2) in ds.create_url" :key="index2" class="create-url">
          <div class="d-flex align-center">
            <input v-model="create_url.label" :placeholder="ds.name || 'label'" />
            <button @click="removeCreateUrl(ds, index2)" class="ms-fontColor-red">X</button>
          </div>
          <input v-model="create_url.url" placeholder="https://domain/contact/post" />
          <label>Mappings (optional)</label>
          <div class="mappings">
            <div v-for="(v, k) in create_url.mapping" :key="k" class="d-flex align-center">
              {{ k }}:&nbsp;
              <input v-model="create_url.mapping[k]" placeholder="remote field" />
              <button @click="delete create_url.mapping[k]" class="ms-fontColor-red">X</button>
            </div>
            <div class="d-flex justify-right">
              <input v-model="temp[`${index}_${index2}`]" placeholder="local field" />
              <button @click="addMapping(create_url, `${index}_${index2}`)">Add</button>
            </div>
          </div>
        </div>
        <div class="d-flex justify-right">
          <button @click="addCreateUrl(ds.create_url)">Add Create URL</button>
        </div>
      </div>
      <input v-else v-model="ds.create_url" />
    </div>
    <div class="d-flex justify-right">
      <button @click="addDataSource">Add data source</button>
    </div>
  </template>
    <div v-if="errorMessage" class="ms-fontColor-red">{{ errorMessage }}</div>

    <div class="d-flex justify-right">
      <button @click="save" class="btn btn-primary" :disabled="isSaving || !!errorMessage">
        Save
      </button>
      <button @click="back" class="btn" :disabled="isSaving">Back</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { getConfig, setConfig } from '../stores/config'
import { useMainStore } from '../stores/main'
import { toggleThemeColor, isDark } from '../stores/config'
const mainStore = useMainStore()
const config = ref()
const configJson = ref()
const temp = ref({})
const errorMessage = ref('')
const showJson = ref(false)

onMounted(() => {
  config.value = getConfig()
  configJson.value = JSON.stringify(config.value, null, 2)
})

watch(() => config.value, (value) => {
  const json = JSON.stringify(value, null, 2)
  if (json !== configJson.value) {
    configJson.value = json
  }
}, { deep: true })

function validate(event) {
  try {
    config.value = JSON.parse(event.target.value)
    errorMessage.value = null
  } catch (error) {
    errorMessage.value = error
  }
}
const isSaving = ref(false)
function back() {
  mainStore.showSettings = false
  window.scrollTo(0, 0)
}
async function save() {
  if (errorMessage.value) return
  isSaving.value = true
  try {
    await setConfig(config.value)
    back()
  } catch (error) {
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

function addDataSource() {
  config.value.push({
    name: '',
    enabled: false,
    auth_url: '',
    search_url: '',
    create_url: []
  })
}

function removeDataSource(index) {
  config.value.splice(index, 1)
}

function addCreateUrl(create_url) {
  create_url.push({
    label: '',
    url: '',
    mapping: {}
  })
}

function removeCreateUrl(ds, index) {
  ds.create_url.splice(index, 1)
}

function addMapping(createUrl, index) {
  const key = temp.value[index]
  if (!key) return
  if (!Object.prototype.hasOwnProperty.call(createUrl, 'mapping')) {
    createUrl.mapping = {}
  }
  createUrl.mapping[key] = ''
  temp.value[index] = ''
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
  width: 100%;
  height: 200px;
  white-space: pre;
  font-family: monospace;
  font-size: 10px;
}

label {
  font-size: 10px;
  display: block;
  padding-top: 4px;
  color: var(--neutralPrimary);
}

input {
  font-size: 12px;
  font-family: monospace;
  width: 100%;
}

.datasource {
  color: var(--neutralDark);
  background-color: var(--neutralPrimarySurface);
  padding: 8px;
  margin-bottom: 1rem;
  font-size: 10px;
}
.datasource button {
  font-size: 12px;
  padding: 4px;
}
.create-urls {
  margin-left: 16px;
}
.create-url {
  border: 1px solid var(--neutralTertiary);
  margin-bottom: 8px;
  padding: 4px;
}
.mappings {
  margin-left: 16px;
}
</style>
