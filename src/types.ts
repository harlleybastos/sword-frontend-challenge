export interface ShapeTopic {
  id: number
  node_id: string
  name: string
  full_name: string
  private: false
  isSelected: boolean
  topic: string
  html_url: string
  sortBy: string
  owner: {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: false
  }
}

export interface ShapeTopics {
  items: ShapeTopic[]
}

export type ShapeDataTopicSection = {
  isLoading: boolean
  repositories: ShapeTopic[]
  selectedRepositories: ShapeTopic[]
  availableTopics: string[]
  selectedTopics: string[]
  staredRepositories: ShapeTopic[]
  sortOption: string
  isSelectOpen: boolean
}

export type ShapeDataBookmarkSection = {
  isLoading: boolean
  staredRepositories: ShapeTopic[]
}

export type ShapeDataNavbar = {
  currentUser: {
    displayName: string
  }
}
