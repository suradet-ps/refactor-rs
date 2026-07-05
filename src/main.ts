import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './design/base.css'
import './design/components.css'

const app = createApp(App)

app.config.errorHandler = (err, _instance, info) => {
  console.error('[Global Error]', err, info)
}

app.use(router)
app.mount('#app')
