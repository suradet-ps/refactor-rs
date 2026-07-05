import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './design/base.css'
import './design/components.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
