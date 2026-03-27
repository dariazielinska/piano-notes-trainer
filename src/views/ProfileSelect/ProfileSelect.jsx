import { useState } from "react"
import { loadProfiles, addProfile } from "../../profile/profilesStorage"

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
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Kto gra? 🎹</h1>

      {profiles.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => onSelect(profile)}
              style={{
                display: "block",
                margin: "10px auto",
                padding: "12px 20px",
                fontSize: "18px"
              }}
            >
              {profile.name}
            </button>
          ))}
        </div>
      )}

      {!showInput && (
        <button onClick={() => setShowInput(true)}>
          ➕ Nowy użytkownik
        </button>
      )}

      {showInput && (
        <div style={{ marginTop: "15px" }}>
          <input
            placeholder="Imię"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "8px", marginRight: "10px" }}
          />

          <button onClick={handleAdd}>
            Zapisz
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileSelect