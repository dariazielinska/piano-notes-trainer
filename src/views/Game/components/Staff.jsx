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
    context.scale(1.5, 1.5)

    const stave = new Stave(10, 20, 180)
    stave.addClef(clef)
    stave.setContext(context).draw()

    const staveNote = new StaveNote({
      keys: [note],
      duration: "q",
      clef: clef,
    })

    staveNote.setStyle({
      fillStyle: "#222",
      strokeStyle: "#222",
    })

    const voice = new Voice({
      num_beats: 1,
      beat_value: 4,
    })

    voice.addTickables([staveNote])
    voice.setStrict(false)

    const formatter = new Formatter()
    formatter.joinVoices([voice]).format([voice], 300)

    voice.draw(context, stave)
    const svg = div.querySelector("svg")

    if (svg) {
      svg.setAttribute("viewBox", "0 40 100 100")
      svg.style.width = "200px"
      svg.style.height = "250px"
    }

  }, [note, clef])

  return <div ref={containerRef}></div>
}

export default Staff