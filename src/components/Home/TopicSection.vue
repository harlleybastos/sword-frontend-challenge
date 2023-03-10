<template>
  <div class="flex flex-col px-14">
    <h1 class="mt-4 mb-4 text-2xl font-bold">Bookmarked repositories</h1>

    <div v-if="staredRepositories.length >= 1" class="w-full mt-4">
      <div class="flex w-full h-full gap-4 overflow-x-scroll">
        <div
          class="shrink-0 mb-11 mt-11 ml-11 cursor-pointer relative h-[180px] w-[300px] hover:scale-125 transition-all text-center flex justify-center items-center bg-gray-300"
          v-for="repo in staredRepositories"
          :key="repo.name"
        >
          <div>
            <h2 class="w-full text-xl font-bold">
              <a :href="repo.owner.html_url" target="_blank">{{ repo.name }}</a>
            </h2>
          </div>
          <button
            type="button"
            data-test="star"
            class="absolute top-0 right-0 p-4"
            @click="toggleStar(repo)"
          >
            <img
              v-if="repo.isSelected"
              src="../../assets/svg/selected-star.svg"
              alt="Selected"
              width="30"
              data-test="star-selected"
            />
            <img v-else src="../../assets/svg/unselected-star.svg" alt="Not selected" width="30" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="staredRepositories.length === 0">
      <p class="text-lg text-center">Stared a repository and toggle a topic to see it here !</p>
    </div>

    <div class="w-full mt-10">
      <h2 class="mb-2 text-lg font-bold">Toggle topics to show</h2>
      <div class="flex flex-wrap">
        <button
          v-for="topic in availableTopics"
          :disabled="isLoading"
          :key="topic"
          :class="{
            'bg-blue-500 text-white': selectedTopics.includes(topic),
            'bg-gray-200 text-gray-700': !selectedTopics.includes(topic)
          }"
          class="px-4 py-2 m-1 transition-colors duration-200 rounded-full hover:bg-blue-600 hover:text-white"
          @click="toggleSelected(topic)"
        >
          {{ topic }}
        </button>
      </div>
    </div>
    <div>
      <div v-for="topic in selectedTopics" :key="topic">
        <div class="flex">
          <h2 class="mt-5 mb-5 text-2xl font-bold">Top {{ topic }}</h2>
          <div class="flex items-center ml-4 w-[100px]">
            <div class="relative">
              <img
                v-if="isSelectOpen"
                class="absolute transform rotate-[180deg] -translate-y-1/2 top-1/2 right-[-30px] cursor-pointer"
                src="../../assets/svg/arrow-down.png"
                width="25"
              />
              <img
                v-else
                class="absolute transform -translate-y-1/2 cursor-pointer top-1/2 right-[-30px]"
                src="../../assets/svg/arrow-down.png"
                width="20"
              />
              <select
                @click="isSelectOpen = !isSelectOpen"
                id="sort-by"
                v-model="sortOption"
                class="flex justify-center px-2 py-1 text-center border-2 border-gray-500 border-none rounded appearance-none"
              >
                <option value="stars">Stars</option>
                <option value="forks">Forks</option>
                <option value="help-wanted-issues">Help Wanted Issues</option>
                <option value="updated">Updated</option>
              </select>
            </div>
          </div>
        </div>

        <div class="w-full mt-4">
          <div v-if="isLoading" class="text-center text-gray-500">
            <span
              class="inline-block w-8 h-8 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"
            ></span>
            <span class="ml-2">Loading...</span>
          </div>
          <div
            style="touch-action: pan-y"
            class="flex w-full h-full gap-3 overflow-hidden overflow-x-auto scroll-smooth"
          >
            <div
              class="shrink-0 mb-11 mt-11 cursor-pointer ml-11 relative h-[195px] w-[300px] hover:scale-125 z-30 hover:h-[200px] transition-all text-center flex justify-center items-center bg-gray-300"
              v-for="repo in selectedRepositories.filter(
                (rep) => rep.topic === topic.toLocaleLowerCase()
              )"
              :key="repo.name"
            >
              <div>
                <h2 class="w-full text-xl font-bold">
                  <a :href="repo.html_url" target="_blank">{{ repo.name }}</a>
                </h2>
              </div>
              <button type="button" class="absolute top-0 right-0 p-4" @click="toggleStar(repo)">
                <img
                  v-if="repo.isSelected"
                  src="../../assets/svg/selected-star.svg"
                  alt="Selected"
                  width="30"
                />
                <img
                  v-else
                  src="../../assets/svg/unselected-star.svg"
                  alt="Not selected"
                  width="30"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { useToast } from 'vue-toastification'
import type { ShapeDataTopicSection, ShapeTopic } from '../../types'

export default {
  data(): ShapeDataTopicSection {
    return {
      isLoading: false,
      repositories: JSON.parse(localStorage.getItem('staredRepositories') || '[]'),
      availableTopics: ['Vue', 'Typescript', 'Javascript', 'Go', 'CSS', 'Node'],
      selectedTopics: JSON.parse(localStorage.getItem('selectedTopics') || '[]'),
      selectedRepositories: [],
      staredRepositories: JSON.parse(localStorage.getItem('staredRepositories') || '[]'),
      sortOption: localStorage.getItem('sortOption') || 'stars',
      isSelectOpen: false
    }
  },
  setup() {
    const toast = useToast()

    return { toast }
  },
  created() {
    if (this.repositories.length === 0) {
      this.fetchRepositoriesForAllTopics()
    } else {
      this.isLoading = false
    }

    if (this.selectedTopics.length === 0) {
      this.toggleSelected(this.availableTopics[0])
    } else {
      const selectedTopics = JSON.parse(localStorage.getItem('selectedTopics') || '[]')
      this.selectedTopics = selectedTopics

      for (const topic of selectedTopics) {
        this.fetchRepositoriesForSpecificyTopicAndSort(topic, this.sortOption)
      }
    }

    // Load previously starred repositories from cache
    const staredRepoNames = this.staredRepositories.map((repo) => repo.name)
    this.selectedRepositories.forEach((repo) => {
      repo.isSelected = staredRepoNames.some((name) => name === repo.name)
    })

    // Load previously selected topics from cache
  },
  methods: {
    async fetchRepositoriesForSpecificyTopicAndSort(topic: string, sortBy: string = 'stars') {
      try {
        this.isLoading = true

        const cachedData = localStorage.getItem(`selectedRepositories-${topic}-${sortBy}`)
        if (cachedData) {
          // If there is cached data for this topic/sort, use it
          const cachedRepositories = JSON.parse(cachedData)
          this.selectedRepositories = this.selectedRepositories.concat(cachedRepositories)
          return cachedRepositories
        }

        // Otherwise, fetch the data from the API and store it in localStorage
        const { data } = await axios.get(
          `https://api.github.com/search/repositories?q=topic:${topic}&sort=${sortBy}&order=desc`,
          {
            headers: {
              Authorization: 'token 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'
            }
          }
        )

        const repositoriesWithTopic = data.items.map((repo: ShapeTopic) => ({
          ...repo,
          topic: topic.toLowerCase(),
          sortBy: sortBy
        }))

        this.selectedRepositories = this.selectedRepositories.concat(repositoriesWithTopic)
        localStorage.setItem(
          `selectedRepositories-${topic}-${sortBy}`,
          JSON.stringify(repositoriesWithTopic)
        )
      } catch (error) {
        this.toast.error('There was an error fetching repositories from the API !', {
          timeout: 2000
        })
      } finally {
        this.isLoading = false
      }
    },

    async fetchRepositoriesForAllTopics() {
      this.isLoading = true
      this.repositories = []

      for (const topic of this.selectedTopics) {
        await this.fetchRepositoriesForSpecificyTopicAndSort(topic, this.sortOption)
      }
    },

    loadRepositoriesFromCache() {
      const selectedRepos = []
      for (const topic of this.selectedTopics) {
        const cachedData = localStorage.getItem(`selectedRepositories-${topic}-${this.sortOption}`)
        if (cachedData) {
          const cachedRepositories = JSON.parse(cachedData)
          selectedRepos.push(...cachedRepositories)
        }
      }
      this.selectedRepositories = selectedRepos

      // Update isSelected property of all repositories based on staredRepositories
      const starredNames = this.staredRepositories.map((r) => r.name)
      const allRepos = [...this.selectedRepositories, ...this.repositories]
      allRepos.forEach((r) => {
        r.isSelected = starredNames.includes(r.name)
      })
    },

    toggleSelected(topic: string) {
      this.isLoading = true
      const index = this.selectedTopics.indexOf(topic)
      if (index === -1) {
        // Topic is not currently selected
        this.selectedTopics.push(topic)
        localStorage.setItem('selectedTopics', JSON.stringify(this.selectedTopics))
      } else {
        // Topic is already selected
        this.selectedTopics.splice(index, 1)
        localStorage.setItem('selectedTopics', JSON.stringify(this.selectedTopics))
      }

      // Set isSelected property for bookmarked repositories
      this.selectedRepositories.forEach((repo) => {
        const isStarred = this.staredRepositories.some((r) => r.name === repo.name)
        repo.isSelected = isStarred ? true : false
      })

      this.fetchRepositoriesForSpecificyTopicAndSort(topic, this.sortOption)
    },

    toggleStar(repo: ShapeTopic) {
      const index = this.staredRepositories.findIndex((r) => r.name === repo.name)
      if (index === -1) {
        // Repository is not currently starred
        this.staredRepositories.push({ ...repo, isSelected: true }) // create a new object
        repo.isSelected = true
      } else {
        // Repository is currently starred
        this.staredRepositories.splice(index, 1)
        repo.isSelected = false
      }

      // Update isSelected property of all repositories
      const allRepos = [...this.selectedRepositories, ...this.repositories]
      allRepos.forEach((r) => {
        if (r.name === repo.name) {
          r.isSelected = repo.isSelected
        }
      })

      localStorage.setItem('staredRepositories', JSON.stringify(this.staredRepositories))
    }
  },

  watch: {
    sortOption(newVal: string) {
      this.selectedRepositories = []
      localStorage.setItem('sortOption', newVal) // store the new value in localStorage
      for (const topic of this.selectedTopics) {
        this.fetchRepositoriesForSpecificyTopicAndSort(topic, newVal)
      }
    },
    selectedTopics: {
      handler(newVal, oldVal) {
        console.log('selectedTopics changed:', newVal)
      }
    }
  },
  computed: {
    starredSelectedRepositories(): ShapeTopic[] {
      return this.selectedRepositories.filter((repo) => {
        const starredRepos = this.staredRepositories.filter(
          (starredRepo) => starredRepo.name === repo.name
        )
        return starredRepos.length > 0
      })
    }
  }
}
</script>
