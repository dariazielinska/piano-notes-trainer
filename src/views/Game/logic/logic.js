export function getRandomNote(notes, progress, required) {
  const notLearned = notes.filter(n => (progress[n] || 0) < required)
  const pool = notLearned.length ? notLearned : notes

  return pool[Math.floor(Math.random() * pool.length)]
}

export function isLevelComplete(notes, progress, required) {
  return notes.every(n => (progress[n] || 0) >= required)
}