import { PitchDetector } from "pitchy"
import { frequencyToNote } from "./audioUtils"

let audioContext
let analyser
let detector
let input
let buffer

export async function startMic(onPitchDetected) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

  audioContext = new AudioContext()
  input = audioContext.createMediaStreamSource(stream)

  analyser = audioContext.createAnalyser()
  analyser.fftSize = 2048

  input.connect(analyser)

  detector = PitchDetector.forFloat32Array(analyser.fftSize)
  buffer = new Float32Array(detector.inputLength)

  function getVolume(buffer) {
    let sum = 0
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i]
    }
    return Math.sqrt(sum / buffer.length)
  }

  function update() {
    analyser.getFloatTimeDomainData(buffer)

    const [pitch, clarity] = detector.findPitch(buffer, audioContext.sampleRate)

    const volume = getVolume(buffer)
    if (volume > 0.02 && clarity > 0.82 && pitch > 80 && pitch < 1000) {
      const note = frequencyToNote(pitch)
      onPitchDetected(note)
    }

    requestAnimationFrame(update)
  }

  update()
}