<template>
  <div class="flex flex-col px-14">
    <h1 class="mt-4 mb-4 text-2xl font-bold">Bookmarked repositories</h1>

    <div class="w-full mt-4">
      <div class="flex w-full h-full gap-4">
        <div
          class="shrink-0 relative h-[180px] w-[300px] hover:scale-125 transition-all text-center flex justify-center items-center bg-gray-300"
          v-for="repo in starredSelectedRepositories"
          :key="repo.id"
        >
          <div>
            <h2 class="w-full text-xl font-bold">{{ repo.name }}</h2>
          </div>
          <button type="button" class="absolute top-0 right-0 p-4" @click="toggleStar(repo)">
            <img
              v-if="repo.isSelected"
              src="../../assets/svg/selected-star.svg"
              alt="Selected"
              width="30"
            />
            <img v-else src="../../assets/svg/unselected-star.svg" alt="Not selected" width="30" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="selectedRepositories.length === 0">
      <p class="text-lg text-center">Stared a repository and toggle a topic to see it here !</p>
    </div>

    <div class="w-full mt-10">
      <h2 class="mb-2 text-lg font-bold">Toggle topics to show</h2>
      <div class="flex flex-wrap">
        <button
          v-for="topic in availableTopics"
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
            <select
              id="sort-by"
              v-model="sortOption"
              class="py-1 border rounded appearance-nonepx-2"
            >
              <option value="stars">Stars</option>
              <option value="forks">Forks</option>
              <option value="help-wanted-issues">Help Wanted Issues</option>
              <option value="updated">Updated</option>
            </select>
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
                <h2 class="w-full text-xl font-bold">{{ repo.name }}</h2>
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
import type { ShapeDataTopicSection, ShapeTopic } from '../../types'

export default {
  data(): ShapeDataTopicSection {
    return {
      isLoading: false,
      repositories: JSON.parse(localStorage.getItem('repositories') || '[]'),
      availableTopics: ['Vue', 'Typescript', 'Javascript', 'Go', 'CSS', 'Node'],
      selectedTopics: JSON.parse(localStorage.getItem('selectedTopics') || '[]'),
      selectedRepositories: [],
      staredRepositories: JSON.parse(localStorage.getItem('staredRepositories') || '[]'),
      sortOption: 'stars'
    }
  },
  created() {
    if (this.repositories.length === 0) {
      this.fetchRepositoriesForAllTopics()
    } else {
      this.isLoading = false
    }

    if (this.selectedTopics.length === 0) {
      this.toggleSelected(this.availableTopics[0])
    }

    // Load previously starred repositories from cache
    this.loadRepositoriesFromCache()
  },
  methods: {
    async fetchRepositoriesForSpecificyTopicAndSort(topic: string, sortBy: string = 'stars') {
      try {
        axios.defaults.headers.common['Authorization'] = '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'

        const cachedData = localStorage.getItem(`selectedRepositories-${topic}-${sortBy}`)
        if (cachedData) {
          // If there is cached data for this topic/sort, use it
          const cachedRepositories = JSON.parse(cachedData)
          this.selectedRepositories.push(...cachedRepositories)
          return cachedRepositories
        }

        // Otherwise, fetch the data from the API and store it in localStorage
        const { data } = await axios.get(
          `https://api.github.com/search/repositories?q=topic:${topic}&sort=${sortBy}&order=desc`
        )

        const repositoriesWithTopic = data.items.map((repo: ShapeTopic) => ({
          ...repo,
          topic: topic.toLowerCase()
        }))
        this.selectedRepositories.push(...repositoriesWithTopic)
        localStorage.setItem(
          `selectedRepositories-${topic}-${sortBy}`,
          JSON.stringify(repositoriesWithTopic)
        )
        return repositoriesWithTopic
      } catch (error) {
        console.error(error)
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
      const selectedRepos = this.staredRepositories.filter((repo) =>
        this.selectedTopics.includes(repo.topic)
      )
      this.selectedRepositories = selectedRepos
    },

    toggleSelected(topic: string) {
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

      // Clear selected repositories and fetch new ones for the currently selected topics
      this.selectedRepositories = []
      for (const topic of this.selectedTopics) {
        this.fetchRepositoriesForSpecificyTopicAndSort(topic, this.sortOption)
      }
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
      localStorage.setItem('staredRepositories', JSON.stringify(this.staredRepositories))
    }
  },

  watch: {
    sortOption(newVal: string, oldVal: string) {
      if (newVal !== oldVal) {
        // Reload repositories with the new sorting option
        for (const topic of this.selectedTopics) {
          this.fetchRepositoriesForSpecificyTopicAndSort(topic, newVal)
        }
      }
    },
    selectedTopics: function (newVal, oldVal) {
      const selectedRepos = this.repositories.filter((repo) => newVal.includes(repo.topic))
      this.selectedRepositories = selectedRepos
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
