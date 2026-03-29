import Staff from "./components/Staff"
import { REQUIRED_PER_NOTE } from "./config/config"
import { levels } from "./logic/levels"
import { useGame } from "./hooks/useGame"
import { formatNote, getClefForNote, calculateProgress } from "./utils/gameUtils"
import "./styles/Game.css"

function Game({ profile, onLogout }) {
  const {
    currentLevel,
    currentNote,
    detected,
    result,
    started,
    noteProgress,
    start,
    nextNote,
  } = useGame(levels, profile)

  const { total, max, percent } = calculateProgress(
    noteProgress,
    currentLevel.notes,
    REQUIRED_PER_NOTE
  )

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
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="note-box">
        {currentNote && (
          <Staff
            note={currentNote}
            clef={getClefForNote(currentNote)}
            result={result}
          />
        )}
      </div>

      {!started && (
        <button onClick={start} className="start-btn">
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

      <button onClick={nextNote} className="secondary-btn">
        🔁 Zmień nutę
      </button>

    </div>
  )
}

export default Game