<template>
  <div v-if="isLoading" class="flex items-center justify-center w-full h-screen">
    <div>
      <svg
        aria-hidden="true"
        class="w-20 h-20 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
  </div>

  <form v-else class="flex flex-col items-center justify-center w-full h-[100vh] mx-auto">
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
        :disabled="!isValid"
        :class="!isValid ? 'bg-gray-400' : 'bg-black'"
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
      passwordError: '',
      isLoading: false
    }
  },
  props: {
    currentUser: {
      type: Object,
      default: () => ({ displayName: '' })
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
      if (this.password.length >= 6) {
        this.passwordError = ''
      } else {
        this.passwordError =
          'Your password must have at least eight characters, at least one letter and one number.'
      }
    },
    async login() {
      try {
        this.isLoading = true
        const getUser = auth.currentUser?.displayName
        await signInWithEmailAndPassword(auth, this.email, this.password)
        this.toast.success('Login successful !', {
          timeout: 2000
        })
        this.$router.push('/')
        this.$emit('update-current-user', { displayName: getUser })
      } catch (e) {
        this.toast.error(
          'There was an error durring the login, please check the both e-mail and password !',
          {
            timeout: 2000
          }
        )
      } finally {
        this.isLoading = false
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
  },
  computed: {
    isValid(): boolean {
      return Boolean(this.email && this.password && !this.emailError && !this.passwordError)
    }
  }
}
</script>
