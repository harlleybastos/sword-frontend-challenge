<template>
  <form class="flex flex-col items-start justify-center w-full mx-14">
    <h1 class="text-3xl mt-14 mb-14">My Account</h1>
    <div class="flex flex-col justify-center mb-4 w-[240px] md:w-[390px]">
      <label for="username" class="flex items-center mb-2 text-md"
        >Username
        <div v-if="username.length <= 0">*</div></label
      >
      <input
        v-model="username"
        type="text"
        class="border-2 border-gray-200 rounded-md h-[50px] p-4 text-lg"
        name="username"
        id="username"
        placeholder="Username"
        required
        :aria-describedby="usernameError && 'username-error'"
        :aria-invalid="usernameError ? true : false"
      />
      <div v-if="usernameError" id="username-error" role="alert" class="text-sm text-red-600">
        {{ usernameError }}
      </div>
    </div>
    <div class="flex flex-col justify-center mb-4 w-[240px] md:w-[390px]">
      <label for="password" class="block mb-2 text-md">Password</label>
      <input
        v-model="password"
        type="password"
        class="border-2 border-gray-200 rounded-md h-[50px] p-4 text-lg"
        name="password"
        id="password"
        placeholder="Password"
        required
        :aria-describedby="passwordError && 'password-error'"
        :aria-invalid="passwordError ? true : false"
      />
      <div v-if="passwordError" id="password-error" role="alert" class="text-sm text-red-600">
        {{ passwordError }}
      </div>
    </div>
    <div class="flex items-center justify-center w-[240px] md:w-[100px] mt-3">
      <button
        @click="updateData"
        type="button"
        class="w-full bg-black h-[50px] rounded-md text-white"
      >
        Save
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { auth } from '@/main'
import { onAuthStateChanged, updateProfile } from '@firebase/auth'

export default {
  data() {
    return {
      username: '',
      password: '',
      usernameError: '',
      passwordError: ''
    }
  },
  methods: {
    async updateData() {
      const useData = auth.currentUser
      await updateProfile(useData!, { displayName: this.username })
      this.$router.push('/')
    }
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.username = user.displayName!
      } else {
        console.log('logo n trouxa')
      }
    })
  },
  watch: {
    username(val) {
      if (!val) {
        this.usernameError = 'Username is required'
      } else {
        this.usernameError = ''
      }
    },
    password(val) {
      if (!val) {
        this.passwordError = 'Password is required'
      } else {
        this.passwordError = ''
      }
    }
  }
}
</script>
