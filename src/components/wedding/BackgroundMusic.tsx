import { useCallback, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { MUSIC_SRC } from '@/lib/wedding'

const UNLOCK_EVENTS = ['pointerdown', 'touchend', 'keydown'] as const

/**
 * Background music. Tries to start as soon as the invitation loads; if the
 * browser blocks autoplay, it starts on the guest's first tap or key press
 * (including the "Open Invitation" button, which calls `play()` directly).
 */
export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mutedRef = useRef(false)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio || mutedRef.current || !audio.paused) return
    audio.play().catch(() => {
      // Autoplay blocked — the unlock listeners below retry on the next tap.
    })
  }, [])

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.6
    audioRef.current = audio

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    const unlock = () => play()
    const removeUnlock = () =>
      UNLOCK_EVENTS.forEach((e) => document.removeEventListener(e, unlock))
    audio.addEventListener('playing', removeUnlock)
    UNLOCK_EVENTS.forEach((e) => document.addEventListener(e, unlock))

    play()

    return () => {
      removeUnlock()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('playing', removeUnlock)
      audio.pause()
      audioRef.current = null
    }
  }, [play])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    // Silent (muted, or still blocked by autoplay) → start; otherwise mute.
    const unmute = mutedRef.current || audio.paused
    mutedRef.current = !unmute
    setMuted(!unmute)
    if (unmute) audio.play().catch(() => {})
    else audio.pause()
  }, [])

  return { play, muted, playing, toggleMute }
}

export function MusicToggle({
  muted,
  playing,
  onToggle,
}: {
  muted: boolean
  playing: boolean
  onToggle: () => void
}) {
  const silent = muted || !playing
  return (
    <button
      type="button"
      onClick={(e) => {
        // Keep the document-level autoplay unlock from also firing.
        e.stopPropagation()
        onToggle()
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      aria-label={silent ? 'Unmute music' : 'Mute music'}
      aria-pressed={!silent}
      className="fixed right-4 bottom-4 z-[70] flex size-12 items-center justify-center rounded-full border border-[var(--gold)] bg-[var(--ivory)]/90 text-primary shadow-[0_0_20px_oklch(0.78_0.13_85/0.45)] backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground sm:right-6 sm:bottom-6"
    >
      {silent ? (
        <VolumeX className="size-5" />
      ) : (
        <Volume2 className="size-5" />
      )}
    </button>
  )
}
