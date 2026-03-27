import { useEffect, useRef } from "react"
import { Renderer, Stave, StaveNote, Voice, Formatter } from "vexflow"

function Staff({ note = "c/4", clef = "treble" }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const div = containerRef.current
    if (!div) return

    div.innerHTML = ""

    const renderer = new Renderer(div, Renderer.Backends.SVG)
    renderer.resize(300, 150)

    const context = renderer.getContext()

    const stave = new Stave(10, 20, 280)
    stave.addClef(clef)
    stave.setContext(context).draw()

    const staveNote = new StaveNote({
      keys: [note],
      duration: "w",
      clef: clef,
    })

    const voice = new Voice({
      num_beats: 4,
      beat_value: 4,
    })

    voice.addTickables([staveNote])

    new Formatter().joinVoices([voice]).format([voice], 200)

    voice.draw(context, stave)

  }, [note, clef])

  return <div ref={containerRef}></div>
}

export default Staff