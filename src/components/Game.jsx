import { useState, useRef, useEffect } from "react"
import Staff from "./Staff"
import { startMic } from "../audio/pitchDetection"
import { vexToSimple } from "../utils/noteUtils"
import { levels } from "../game/levels"
import { loadProfiles, saveProfiles } from "../game/profile"
import "./Game.css"

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
  const [levelIndex, setLevelIndex] = useState(profile?.levelIndex || 0)
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
    if (!currentLevel) return

    const progress = {}
    currentLevel.notes.forEach(n => {
      progress[n] = 0
    })
    setNoteProgress(progress)
  }, [levelIndex])

  function getRandomNote() {
    if (!currentLevel) return null
    const list = currentLevel.notes
    const notLearned = list.filter(n => (noteProgress[n] || 0) < REQUIRED_PER_NOTE)
    const pool = notLearned.length > 0 ? notLearned : list
    return pool[Math.floor(Math.random() * pool.length)]
  }

  function randomNote() {
    const newNote = getRandomNote()
    if (!newNote) return

    setCurrentNote(newNote)
    setResult(null)
  }

  function getClefForNote(note) {
    if (!currentLevel || currentLevel.clef !== "mixed") return currentLevel?.clef || "treble"

    const bassNotes = [
      "c/3","d/3","e/3","f/3","g/3","a/3","b/3","c/4"
    ]

    return bassNotes.includes(note) ? "bass" : "treble"
  }

  async function handleStart() {
    randomNote()

    await startMic((note) => {
      if (lockRef.current) return
      if (!currentNoteRef.current) return

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
            n => (updated[n] || 0) >= REQUIRED_PER_NOTE
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
        }, 700)
      } else {
        setResult("bad")
      }
    })

    setStarted(true)
  }

  useEffect(() => {
    if (!profile) return

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
    <div className="game">

      <h1 className="title">🎹 Piano Trainer</h1>

      <div className="user-bar">
        <span>👋 {profile?.name}</span>
        <button onClick={onLogout} className="small-btn">
          Zmień
        </button>
      </div>

      <div className="level">{currentLevel.name}</div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(totalProgress / maxProgress) * 100}%` }}
        />
      </div>

      <div className="note-box">
        {currentNote && (
          <Staff
            note={currentNote}
            clef={getClefForNote(currentNote)}
          />
        )}
      </div>

      {!started && (
        <button onClick={handleStart} className="start-btn">
          🎤 Start
        </button>
      )}

      <div className="detected">
        {detected ? formatNote(detected) : "Zagraj nutę 🎵"}
      </div>

      {result === "good" && (
        <div className="good">✔️ Super!</div>
      )}

      {result === "bad" && (
        <div className="bad">Jeszcze raz 🙂</div>
      )}

      <button onClick={randomNote} className="secondary-btn">
        🔁 Zmień nutę
      </button>

    </div>
  )
}

export default Game