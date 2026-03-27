import { useState, useRef } from "react"
import Staff from "./components/Staff"
import { startMic } from "./audio/pitchDetection"
import { vexToSimple } from "./utils/noteUtils"

const notes = ["c/4", "d/4", "e/4", "f/4", "g/4"]

const getRandomNote = () =>
  notes[Math.floor(Math.random() * notes.length)]

function App() {
  const [currentNote, setCurrentNote] = useState(getRandomNote)
  const [detected, setDetected] = useState("")
  const [started, setStarted] = useState(false)
  const [result, setResult] = useState(null)

  const currentNoteRef = useRef(currentNote)
  currentNoteRef.current = currentNote
  const lockRef = useRef(false)

  function randomNote() {
    let newNote

    do {
      newNote = getRandomNote()
    } while (newNote === currentNoteRef.current)

    setCurrentNote(newNote)
    setResult(null)
  }

  async function handleStart() {
    await startMic((note) => {
      if (lockRef.current) return

      setDetected(note)

      const expected = vexToSimple(currentNoteRef.current)

      if (note === expected) {
        setResult("good")

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

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Piano Trainer 🎹</h1>
      <Staff note={currentNote} />
      {!started && (
        <button onClick={handleStart} style={{ fontSize: "18px", padding: "10px" }}>
          Start 🎤
        </button>
      )}
      <p>Grasz: {detected}</p>
      {result === "good" && (
        <p style={{ color: "green", fontSize: "20px" }}>✔️ dobrze!</p>
      )}
      {result === "bad" && (
        <p style={{ color: "red", fontSize: "20px" }}>❌ spróbuj jeszcze</p>
      )}
      <button onClick={randomNote} style={{ marginTop: "10px" }}>
        Nowa nuta
      </button>
    </div>
  )
}

export default App