import { useState } from "react"
import { loadProfiles, addProfile } from "../../profile/profilesStorage"
import Parrot from "../../components/Parrot/Parrot"
import "./styles/ProfileSelect.css"

function ProfileSelect({ onSelect }) {
  const [profiles, setProfiles] = useState(loadProfiles())
  const [showInput, setShowInput] = useState(false)
  const [name, setName] = useState("")

  function handleAdd() {
    if (!name.trim()) return

    const newProfile = addProfile(name)

    setProfiles(prev => [...prev, newProfile])
    setName("")
    setShowInput(false)
  }

  return (
    <div className="profile-container">
      <Parrot animation="idle"/>
      <h1 className="title">Witaj w Polly Piano 🦜🎹</h1>
      {profiles.length > 0 && (
        <div className="profile-list">
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => onSelect(profile)}
              className="profile-card"
            >
              {profile.name}
            </button>
          ))}
        </div>
      )}

      {!showInput && (
        <button className="add-btn" onClick={() => setShowInput(true)}>
          ➕ Nowy użytkownik
        </button>
      )}

      {showInput && (
        <div className="input-row">
          <input
            className="input"
            placeholder="Imię"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button className="save-btn" onClick={handleAdd}>
            Zapisz
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileSelect