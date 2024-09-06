import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useMainStore } from './stores/main'

function applyOfficeTheme() {
  const bodyBackgroundColor = Office.context.officeTheme.bodyBackgroundColor
  const bodyForegroundColor = Office.context.officeTheme.bodyForegroundColor
  const controlBackgroundColor = Office.context.officeTheme.controlBackgroundColor
  const controlForegroundColor = Office.context.officeTheme.controlForegroundColor
  document.documentElement.style.setProperty('--body-bg-color', bodyBackgroundColor)
  document.documentElement.style.setProperty('--body-fg-color', bodyForegroundColor)
  document.documentElement.style.setProperty('--control-bg-color', controlBackgroundColor)
  document.documentElement.style.setProperty('--control-fg-color', controlForegroundColor)
}

window.Office.onReady((info) => {
  applyOfficeTheme()
  const app = createApp(App)
  app.use(createPinia())
  const mainStore = useMainStore()
  mainStore.info = info
  app.mount('#app')
  Office.context.mailbox.masterCategories.getAsync(function(asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
      const categories = asyncResult.value;
      if (categories && categories.length > 0) {
        console.log("Master categories:");
        console.log(JSON.stringify(categories));
      } else {
        console.log("There are no categories in the master list.");
      }
    } else {
      console.error(asyncResult.error);
    }
  });
})
