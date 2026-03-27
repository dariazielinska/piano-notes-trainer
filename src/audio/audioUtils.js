export function vexToSimple(note) {
  return note.split("/")[0].toUpperCase()
}

export function frequencyToNote(freq) {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  const A4 = 440
  const semitone = 12 * Math.log2(freq / A4)
  const noteIndex = Math.round(semitone) + 69

  return noteNames[noteIndex % 12]
}