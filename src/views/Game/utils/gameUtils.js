const noteNames = {
  C: "DO",
  D: "RE",
  E: "MI",
  F: "FA",
  G: "SOL",
  A: "LA",
  B: "SI"
}

export function formatNote(note) {
  if (!note) return ""
  const solfege = noteNames[note]
  return solfege ? `${solfege} (${note})` : note
}

export function getClefForNote(note, currentLevel) {
  if (!currentLevel || currentLevel.clef !== "mixed") {
    return currentLevel?.clef || "treble"
  }

  const bassNotes = [
    "c/3","d/3","e/3","f/3","g/3","a/3","b/3","c/4"
  ]

  return bassNotes.includes(note) ? "bass" : "treble"
}

export function calculateProgress(noteProgress, notes, required) {
  const total = Object.values(noteProgress).reduce((a, b) => a + b, 0)
  const max = notes.length * required

  return {
    total,
    max,
    percent: max ? (total / max) * 100 : 0
  }
}