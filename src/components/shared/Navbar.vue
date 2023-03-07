<template>
  <nav class="px-14 flex items-center justify-between w-full h-[80px] bg-gray-300">
    <div class="flex items-center justify-center gap-4">
      <p class="mr-4 text-2xl">LOGO</p>
      <router-link
        to="/"
        :class="$route.path === '/' && 'underline'"
        class="hidden font-bold text-center md:block underline-offset-8 hover:underline hover:cursor-pointer"
      >
        Discover
      </router-link>
    </div>
    <div class="gap-4 md:flex">
      <router-link
        :class="
          currentUser.displayName
            ? 'block font-bold text-black underline underline-offset-8'
            : 'hidden'
        "
        :to="`/user-account/${currentUser.displayName}`"
      >
        {{ currentUser.displayName }}
      </router-link>
      <router-link
        v-if="$route.path !== '/user-login'"
        :class="!currentUser.displayName ? 'block' : 'hidden'"
        to="/user-login"
        type="button"
        class="font-bold"
        >Login</router-link
      >
      <button
        @click="handleSignOut"
        :class="currentUser.displayName ? 'block' : 'hidden'"
        type="button"
        class="font-bold"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import { auth } from '@/main'
import { onAuthStateChanged, signOut } from '@firebase/auth'

export default {
  props: {
    currentUser: {
      type: Object,
      default: () => ({ displayName: '' })
    }
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser.displayName = user.displayName!
      }
    })
  },
  methods: {
    async handleSignOut() {
      await signOut(auth)
      this.currentUser.displayName = ''
      this.$router.push('/')
    }
  }
}
</script>
