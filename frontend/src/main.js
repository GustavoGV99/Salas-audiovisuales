// import './assets/main.css'   

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css'



const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(VCalendar, {});
app.mount('#app')

