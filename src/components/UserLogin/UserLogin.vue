<template>
  <form class="flex flex-col items-center justify-center w-full h-[100vh] mx-auto">
    <div class="flex flex-col justify-center mb-4 w-[240px] md:w-[390px]">
      <label for="email" class="block mb-2 text-sm">E-mail</label>
      <input
        @blur="validateEmail"
        v-model="email"
        type="text"
        class="border-2 border-gray-200 rounded-md h-[50px] p-4 text-lg"
        name="email"
        id="email"
        placeholder="E-mail"
        required
        :aria-describedby="emailError && 'email-error'"
        :aria-invalid="emailError ? true : false"
      />
      <div v-if="emailError" id="email-error" role="alert" class="text-sm text-red-600">
        {{ emailError }}
      </div>
    </div>
    <div class="flex flex-col justify-center mb-4 w-[240px] md:w-[390px]">
      <label for="password" class="block mb-2 text-sm">Password</label>
      <input
        @blur="validatePassword"
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
    <div class="flex items-center justify-center w-[240px] md:w-[390px] mt-3">
      <button
        :disabled="(email && password).length <= 0"
        :class="(email && password).length <= 0 ? 'bg-gray-400' : 'bg-black'"
        @click="login"
        type="button"
        class="w-full bg-black h-[50px] rounded-md text-white"
      >
        Sign in
      </button>
    </div>
    <div
      class="flex flex-col items-center justify-center mb-4 w-[240px] md:w-[500px] text-[18px] mt-2"
    >
      <p>
        Don't have an account?<router-link to="/user-register" href="#" class="pl-2 underline"
          >Click here to sign up.</router-link
        >
      </p>
    </div>
  </form>
</template>

<script lang="ts">
import { auth } from '@/main'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useToast } from 'vue-toastification'

export default {
  setup() {
    const toast = useToast()

    return { toast }
  },
  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      passwordError: ''
    }
  },
  methods: {
    validateEmail() {
      const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (!regexForEmail.test(this.email)) {
        this.emailError = 'Please enter a valid email address'
      } else {
        this.emailError = ''
      }
    },
    validatePassword() {
      const regexForPasswordAtLeastOneCharactherOneLetterAndOneNumber =
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

      if (!regexForPasswordAtLeastOneCharactherOneLetterAndOneNumber.test(this.password)) {
        this.passwordError =
          'Your password must have at least eight characters, at least one letter and one number.'
      } else {
        this.passwordError = ''
      }
    },
    async login() {
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password)
        this.toast.success('Login successful !', {
          timeout: 2000
        })
        this.$router.push('/')
      } catch (e) {
        this.toast.error(
          'There was an error durring the login, please check the both e-mail and password !',
          {
            timeout: 2000
          }
        )
      }
    }
  },
  watch: {
    email(val) {
      if (!val) {
        this.emailError = 'E-mail is required!'
      } else {
        this.emailError = ''
      }
    },
    password(val) {
      if (!val) {
        this.passwordError = 'Password is required!'
      } else {
        this.passwordError = ''
      }
    }
  }
}
</script>
