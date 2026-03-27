const STORAGE_KEY = "piano-trainer-profiles"

export function loadProfiles() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveProfiles(profiles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
}

export function addProfile(name) {
  const profiles = loadProfiles()

  const newProfile = {
    id: Date.now(),
    name,
    levelIndex: 0
  }

  const updated = [...profiles, newProfile]
  saveProfiles(updated)

  return newProfile
}