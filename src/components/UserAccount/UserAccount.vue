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

  <form v-else class="flex flex-col items-start justify-center w-full mx-14">
    <h1 class="text-3xl mt-14 mb-14">My Account</h1>
    <div class="flex flex-col justify-center mb-4 w-[240px] md:w-[390px]">
      <label for="username" class="flex items-center mb-2 text-md">Username </label>
      <input
        v-model="username"
        @blur="validateUsername"
        type="text"
        class="border-2 border-gray-200 rounded-md h-[50px] p-4 text-lg"
        name="username"
        id="username"
        placeholder="Username"
        required
        :aria-describedby="userNameError && 'username-error'"
        :aria-invalid="userNameError ? true : false"
      />
      <div v-if="userNameError" id="username-error" role="alert" class="text-sm text-red-600">
        {{ userNameError }}
      </div>
    </div>
    <div class="flex flex-col justify-center mb-4 w-[240px] md:w-[390px]">
      <label for="username" class="flex items-center mb-2 text-md">E-mail</label>
      <input
        v-model="email"
        @blur="validateUsername"
        type="email"
        class="border-2 border-gray-200 rounded-md h-[50px] p-4 text-lg"
        name="email"
        id="email"
        placeholder="email"
        required
        :aria-describedby="emailError && 'email-error'"
        :aria-invalid="emailError ? true : false"
      />
      <div v-if="emailError" id="email-error" role="alert" class="text-sm text-red-600">
        {{ emailError }}
      </div>
    </div>
    <div class="flex flex-col justify-center mb-4 w-[240px] md:w-[390px]">
      <label for="password" class="block mb-2 text-md">Password</label>
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
    <div class="flex items-center justify-center w-[240px] md:w-[100px] mt-3">
      <button
        @click="updateData"
        :disabled="(email && password && username).length <= 0"
        :class="(email && password).length <= 0 ? 'bg-gray-400' : 'bg-black'"
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
import { onAuthStateChanged, updateEmail, updatePassword, updateProfile } from '@firebase/auth'
import { useToast } from 'vue-toastification'

export default {
  setup() {
    const toast = useToast()

    return { toast }
  },
  data() {
    return {
      username: '',
      userNameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      isLoading: false
    }
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
      const regexForPasswordAtLeastOneCharactherOneLetterAndOneNumber =
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

      if (!regexForPasswordAtLeastOneCharactherOneLetterAndOneNumber.test(this.password)) {
        this.passwordError =
          'Your password must have at least eight characters, at least one letter and one number.'
      } else {
        this.passwordError = ''
      }
    },
    async updateData() {
      try {
        this.isLoading = true
        const userData = auth.currentUser
        await updateEmail(userData!, this.email)
        await updatePassword(userData!, this.password)
        await updateProfile(userData!, { displayName: this.username })
        this.toast.success('User successfully updated !', {
          timeout: 2000
        })
        this.$router.push('/')
      } catch (e) {
        this.toast.error(
          'There was an error updating the data. Please try logout and login again or review all the fields !',
          {
            timeout: 2000
          }
        )
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.username = user.displayName!
        this.email = user.email!
      }
    })
  },
  watch: {
    username(val) {
      if (!val) {
        this.userNameError = 'Username is required'
      } else {
        this.userNameError = ''
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
