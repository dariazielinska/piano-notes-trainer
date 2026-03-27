import { useState } from "react"
import ProfileSelect from "./components/ProfileSelect"
import Game from "./components/Game"

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