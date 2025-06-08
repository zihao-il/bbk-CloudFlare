import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import {useThemeStore} from "./store/theme.js";
import {createI18nInstance} from './locale'
import '@varlet/ui/es/action-sheet/style/index'

const app = createApp(App);
const pinia = createPinia()

app.use(pinia)

pinia.use(piniaPluginPersistedstate)
const store = useThemeStore(pinia);
const vuei18n = createI18nInstance(store.language);

app.use(vuei18n)
app.mount('#zihao_il')