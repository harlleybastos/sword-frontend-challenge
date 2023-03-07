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
      <label for="username" class="block mb-2 text-sm">Username</label>
      <input
        required
        v-model="userName"
        @blur="validateUsername"
        type="text"
        class="border-2 border-gray-200 rounded-md h-[50px] p-4 text-lg"
        name="username"
        id="username"
        placeholder="Username"
        :aria-describedby="userNameError && 'username-error'"
        :aria-invalid="userNameError ? true : false"
      />
      <div v-if="userNameError !== ''" id="email-error" role="alert" class="text-sm text-red-600">
        {{ userNameError }}
      </div>
    </div>
    <div class="flex flex-col justify-center mb-4 w-[240px] md:w-[390px]">
      <label for="email" class="block mb-2 text-sm">E-mail</label>
      <input
        required
        v-model="email"
        @blur="validateEmail"
        type="email"
        class="border-2 border-gray-200 rounded-md h-[50px] p-4 text-lg"
        name="email"
        id="email"
        placeholder="E-mail"
        :aria-describedby="emailError && 'email-error'"
        :aria-invalid="emailError ? true : false"
      />
      <div v-if="emailError !== ''" id="email-error" role="alert" class="text-sm text-red-600">
        {{ emailError }}
      </div>
    </div>
    <div class="flex flex-col justify-center mb-4 w-[240px] md:w-[390px]">
      <label for="password" class="block mb-2 text-sm">Password</label>
      <input
        v-model="password"
        @blur="validatePassword"
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
        :disabled="(email && password && userName).length <= 0"
        :class="(email && password).length <= 0 ? 'bg-gray-400' : 'bg-black'"
        @click="() => register()"
        type="button"
        class="w-full h-[50px] rounded-md text-white"
      >
        Sign Up
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { auth } from '@/main'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { useToast } from 'vue-toastification'

export default {
  data() {
    return {
      userName: '',
      email: '',
      password: '',
      userNameError: '',
      emailError: '',
      passwordError: '',
      isLoading: false
    }
  },
  setup() {
    const toast = useToast()

    return { toast }
  },
  methods: {
    validateUsername() {
      const regexForUsername = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
      if (regexForUsername.test(this.email)) {
        this.userNameError = 'Your username must have between 8 and 20 characters'
      } else {
        this.userNameError = ''
      }
    },
    validateEmail() {
      const regexForPasswordAtLeastOneCharactherOneLetterAndOneNumber =
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

      if (!regexForPasswordAtLeastOneCharactherOneLetterAndOneNumber.test(this.password)) {
        this.passwordError =
          'Your password must have at least eight characters, at least one letter and one number.'
      } else {
        this.passwordError = ''
      }
    },
    validatePassword() {
      if (this.passwordError.length >= 6) {
        this.passwordError = 'Your password must have at least six characters !'
      } else {
        this.passwordError = ''
      }
    },
    async register() {
      try {
        this.isLoading = true
        await createUserWithEmailAndPassword(auth, this.email, this.password)
        await sendEmailVerification(auth.currentUser!)
        await updateProfile(auth.currentUser!, { displayName: this.userName })
        this.toast.success('User registration successful !', {
          timeout: 2000
        })
        this.$router.push('/')
      } catch (e) {
        this.toast.success('There was an error, please try to check the fields !', {
          timeout: 2000
        })
      } finally {
        this.isLoading = false
      }
    }
  },
  watch: {
    email(val) {
      if (!val) {
        this.emailError = 'E-mail is required'
      } else {
        this.emailError = ''
      }
    },
    password(val) {
      if (!val) {
        this.passwordError = 'Password is required'
      } else {
        this.passwordError = ''
      }
    }
  },
  computed: {
    isValid(): boolean {
      return Boolean(
        this.email &&
          this.password &&
          this.userName &&
          !this.emailError &&
          !this.passwordError &&
          !this.userNameError
      )
    }
  }
}
</script>
