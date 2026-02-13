import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import i18n from './locales'
import '@/utils/flexible'
import Vant from 'vant'
import 'vant/lib/index.css'
import '@/styles/reset.scss'
import { initVConsole } from '@/utils/vconsole'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(i18n)
app.use(Vant)
initVConsole()

app.mount('#app')
