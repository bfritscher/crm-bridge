import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useMainStore } from './stores/main'

window.Office.onReady((info) => {
  const app = createApp(App)
  app.use(createPinia())
  const mainStore = useMainStore()
  mainStore.info = info
  app.mount('#app')
  /*
  requires ReadWriteMailbox
  Office.context.mailbox.masterCategories.getAsync(function (asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
      const categories = asyncResult.value
      if (categories && categories.length > 0) {
        console.log('Master categories:')
        console.log(JSON.stringify(categories))
      } else {
        console.log('There are no categories in the master list.')
      }
    } else {
      console.error(asyncResult.error)
    }
  })
  */
})
