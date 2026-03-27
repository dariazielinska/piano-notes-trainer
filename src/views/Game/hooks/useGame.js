import { useState, useRef, useEffect } from "react"
import { startMic } from "../../../audio/pitchDetection"
import { vexToSimple } from "../../../audio/audioUtils"
import { getRandomNote, isLevelComplete } from "../logic/logic"
import { REQUIRED_PER_NOTE } from "../config/config"

export function useGame(levels, profile) {
  const [levelIndex, setLevelIndex] = useState(profile?.levelIndex || 0)
  const [currentNote, setCurrentNote] = useState(null)
  const [detected, setDetected] = useState("")
  const [result, setResult] = useState(null)
  const [started, setStarted] = useState(false)
  const [noteProgress, setNoteProgress] = useState({})

  const currentNoteRef = useRef(currentNote)
  currentNoteRef.current = currentNote

  const lockRef = useRef(false)

  const currentLevel = levels[levelIndex]

  useEffect(() => {
    if (!currentLevel) return

    const progress = {}
    currentLevel.notes.forEach(n => (progress[n] = 0))
    setNoteProgress(progress)
  }, [levelIndex])

  function nextNote() {
    const note = getRandomNote(
      currentLevel.notes,
      noteProgress,
      REQUIRED_PER_NOTE
    )
    setCurrentNote(note)
    setResult(null)
  }

  async function start() {
    nextNote()

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

          if (
            isLevelComplete(
              currentLevel.notes,
              updated,
              REQUIRED_PER_NOTE
            )
          ) {
            if (levelIndex < levels.length - 1) {
              setLevelIndex(prev => prev + 1)
            }
          }

          return updated
        })

        lockRef.current = true

        setTimeout(() => {
          nextNote()
          lockRef.current = false
        }, 700)
      } else {
        setResult("bad")
      }
    })

    setStarted(true)
  }

  return {
    currentLevel,
    currentNote,
    detected,
    result,
    started,
    noteProgress,
    start,
    nextNote,
  }
}