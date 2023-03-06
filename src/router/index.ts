import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import UserLogin from '../components/UserLogin/UserLogin.vue'
import UserAccount from '../components/UserAccount/UserAccount.vue'
import UserRegister from '../components/UserRegister/UserRegister.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/user-login',
      name: 'login',
      component: UserLogin
    },
    {
      path: '/user-account/:userName',
      name: 'account',
      component: UserAccount
    },
    {
      path: '/user-register',
      name: 'register',
      component: UserRegister
    }
  ]
})

export default router
