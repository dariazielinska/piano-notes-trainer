import { useState } from "react"
import ProfileSelect from "./views/ProfileSelect/ProfileSelect"
import Game from "./views/Game/Game"

function App() {
  const [activeProfile, setActiveProfile] = useState(null)

  return (
    <>
      {!activeProfile ? (
        <ProfileSelect onSelect={setActiveProfile} />
      ) : (
        <Game
          profile={activeProfile}
          onLogout={() => setActiveProfile(null)}
        />
      )}
    </>
  )
}

export default App