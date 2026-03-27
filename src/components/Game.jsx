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

function Game({ profile, onLogout }) {
  const [levelIndex, setLevelIndex] = useState(profile.levelIndex || 0)
  const [currentNote, setCurrentNote] = useState(null)
  const [detected, setDetected] = useState("")
  const [started, setStarted] = useState(false)
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)

  const currentNoteRef = useRef(currentNote)
  currentNoteRef.current = currentNote

  const lockRef = useRef(false)

  const currentLevel = levels[levelIndex]

  function getRandomNote() {
    const list = currentLevel.notes
    return list[Math.floor(Math.random() * list.length)]
  }

  function randomNote() {
    let newNote

    do {
      newNote = getRandomNote()
    } while (newNote === currentNoteRef.current)

    setCurrentNote(newNote)
    setResult(null)
  }

  async function handleStart() {
    randomNote()

    await startMic((note) => {
      if (lockRef.current) return

      setDetected(note)

      const expected = vexToSimple(currentNoteRef.current)

      if (note === expected) {
        setResult("good")

        setScore(prev => {
          const newScore = prev + 1

          if (newScore >= 5 && levelIndex < levels.length - 1) {
            setLevelIndex(prev => prev + 1)
            return 0
          }

          return newScore
        })

        lockRef.current = true

        setTimeout(() => {
          randomNote()
          lockRef.current = false
        }, 1000)
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

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Piano Trainer 🎹</h1>

      <h2>👋 {profile.name}</h2>

      <button onClick={onLogout} style={{ marginBottom: "10px" }}>
        🔙 Zmień użytkownika
      </button>

      <p><strong>Poziom:</strong> {currentLevel.name}</p>
      <p><strong>Punkty:</strong> {score}/5</p>

      {currentNote && (
        <Staff note={currentNote} clef={currentLevel.clef} />
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