import { useState, useRef, useEffect } from "react"
import Staff from "./Staff"
import { startMic } from "../audio/pitchDetection"
import { vexToSimple } from "../utils/noteUtils"
import { levels } from "../game/levels"
import { loadProfiles, saveProfiles } from "../game/profile"

const noteNames = {
  C: "DO",
  D: "RE",
  E: "MI",
  F: "FA",
  G: "SOL",
  A: "LA",
  B: "SI"
}

function formatNote(note) {
  if (!note) return ""
  const solfege = noteNames[note]
  return solfege ? `${solfege} (${note})` : note
}

const REQUIRED_PER_NOTE = 10

function Game({ profile, onLogout }) {
  const [levelIndex, setLevelIndex] = useState(profile.levelIndex || 0)
  const [currentNote, setCurrentNote] = useState(null)
  const [detected, setDetected] = useState("")
  const [started, setStarted] = useState(false)
  const [result, setResult] = useState(null)
  const [noteProgress, setNoteProgress] = useState({})

  const currentNoteRef = useRef(currentNote)
  currentNoteRef.current = currentNote

  const lockRef = useRef(false)

  const currentLevel = levels[levelIndex]

  useEffect(() => {
    const progress = {}
    currentLevel.notes.forEach(n => {
      progress[n] = 0
    })
    setNoteProgress(progress)
  }, [levelIndex])

  function getRandomNote() {
    const list = currentLevel.notes
    const notLearned = list.filter(n => noteProgress[n] < REQUIRED_PER_NOTE)
    const pool = notLearned.length > 0 ? notLearned : list
    return pool[Math.floor(Math.random() * pool.length)]
  }

  function randomNote() {
    let newNote

    do {
      newNote = getRandomNote()
    } while (newNote === currentNoteRef.current)

    setCurrentNote(newNote)
    setResult(null)
  }

  function getClefForNote(note) {
    if (currentLevel.clef !== "mixed") return currentLevel.clef

    const bassNotes = [
      "c/3","d/3","e/3","f/3","g/3","a/3","b/3","c/4"
    ]

    if (bassNotes.includes(note)) return "bass"

    return "treble"
  }
  async function handleStart() {
    randomNote()

    await startMic((note) => {
      if (lockRef.current) return

      setDetected(note)

      const expected = vexToSimple(currentNoteRef.current)

      if (note === expected) {
        setResult("good")

        setNoteProgress(prev => {
          const updated = {
            ...prev,
            [currentNoteRef.current]: (prev[currentNoteRef.current] || 0) + 1
          }
          const allDone = currentLevel.notes.every(
            note => (updated[note] || 0) >= REQUIRED_PER_NOTE
          )

          if (allDone && levelIndex < levels.length - 1) {
            setLevelIndex(prev => prev + 1)
          }

          return updated
        })

        lockRef.current = true

        setTimeout(() => {
          randomNote()
          lockRef.current = false
        }, 800)
      } else {
        setResult("bad")
      }
    })

    setStarted(true)
  }

  useEffect(() => {
    const profiles = loadProfiles()

    const updated = profiles.map(p =>
      p.id === profile.id
        ? { ...p, levelIndex }
        : p
    )

    saveProfiles(updated)
  }, [levelIndex])

  const totalProgress = Object.values(noteProgress).reduce((a, b) => a + b, 0)
  const maxProgress = currentLevel.notes.length * REQUIRED_PER_NOTE

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Piano Trainer 🎹</h1>

      <h2>👋 {profile?.name || "Gracz"}</h2>

      <button onClick={onLogout} style={{ marginBottom: "10px" }}>
        🔙 Zmień użytkownika
      </button>

      <p><strong>Poziom:</strong> {currentLevel.name}</p>

      <p>
        Postęp: {totalProgress} / {maxProgress}
      </p>

      {currentNote && (
        <Staff
          note={currentNote}
          clef={getClefForNote(currentNote)}
        />
      )}

      {!started && (
        <button onClick={handleStart}>
          Start 🎤
        </button>
      )}

      <p>Grasz: {formatNote(detected)}</p>

      {result === "good" && (
        <p style={{ color: "green" }}>✔️ dobrze!</p>
      )}

      {result === "bad" && (
        <p style={{ color: "red" }}>❌ spróbuj jeszcze</p>
      )}

      <button onClick={randomNote}>
        Nowa nuta
      </button>
    </div>
  )
}

export default Game