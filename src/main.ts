import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'

import './assets/base.css'
import 'vue-toastification/dist/index.css'

const firebaseConfig = {
  apiKey: 'AIzaSyDX2divx0IWi6Kqzfm-t3vB3OdrfYMYumo',
  authDomain: 'sword-tech-project.firebaseapp.com',
  projectId: 'sword-tech-project',
  storageBucket: 'sword-tech-project.appspot.com',
  messagingSenderId: '538702585448',
  appId: '1:538702585448:web:18bf84a34f566a909b65dd'
}

const options = {
  position: 'top-center',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false
}

initializeApp(firebaseConfig)

export const auth = getAuth()

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)

app.use(router)

app.use(Toast, options)

app.mount('#app')
