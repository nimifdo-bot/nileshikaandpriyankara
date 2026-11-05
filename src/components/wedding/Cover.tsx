import { useEffect, useRef, useState } from 'react'
import { MailOpen, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { INTRO_VIDEO_SRC, WEDDING } from '@/lib/wedding'
import { Mandala, Petals } from './ornaments'

type Stage = 'closed' | 'video' | 'opening' | 'gone'

/**
 * Full-screen cover. "Open Invitation" plays the wedding animation video,
 * then the gold curtains part to reveal the invitation.
 */
export function Cover({
  guest,
  onStart,
  onOpen,
}: {
  guest: string | null
  /** Called on the "Open Invitation" tap (a user gesture, so audio may start). */
  onStart: () => void
  /** Called once the video has ended or been skipped. */
  onOpen: () => void
}) {
  const [stage, setStage] = useState<Stage>('closed')
  const videoRef = useRef<HTMLVideoElement>(null)
  const finished = useRef(false)

  useEffect(() => {
    document.body.style.overflow =
      stage === 'closed' || stage === 'video' ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [stage])

  if (stage === 'gone') return null

  function startVideo() {
    const video = videoRef.current
    onStart()
    setStage('video')
    if (!video) return finishVideo()
    video.muted = true
    video.currentTime = 0
    // Muted so the background music carries the moment; also lets it autoplay.
    video.play().catch(() => finishVideo())
  }

  function finishVideo() {
    if (finished.current) return
    finished.current = true
    videoRef.current?.pause()
    setStage('opening')
    onOpen()
    window.scrollTo({ top: 0 })
    setTimeout(() => setStage('gone'), 1400)
  }

  const opening = stage === 'opening'

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation cover"
    >
      {(['left', 'right'] as const).map((side) => (
        <div
          key={side}
          className="gold-velvet absolute top-0 h-full w-1/2 border-[var(--gold)]/50 transition-transform duration-[1300ms] ease-in-out"
          style={{
            left: side === 'left' ? 0 : undefined,
            right: side === 'right' ? 0 : undefined,
            borderRightWidth: side === 'left' ? 1 : 0,
            borderLeftWidth: side === 'right' ? 1 : 0,
            transform: opening
              ? `translateX(${side === 'left' ? '-100%' : '100%'})`
              : 'none',
          }}
        />
      ))}
      <div
        className="relative flex h-full flex-col items-center justify-center px-6 text-center transition-opacity duration-500"
        style={{ opacity: stage === 'closed' ? 1 : 0 }}
      >
        <Petals />
        <div className="relative mb-6 size-36 sm:size-44">
          <div className="absolute inset-0 rounded-full bg-[var(--ivory)]" />
          <Mandala spin className="relative size-full rounded-full" />
        </div>
        <p className="font-display text-sm tracking-[0.4em] text-[var(--gold)] uppercase">
          The Wedding Of
        </p>
        <h1 className="couple-names font-script text-gold-foil mt-3 leading-tight">
          <span className="couple-name">{WEDDING.bride.name}</span>{' '}
          <span className="couple-amp">&amp;</span>{' '}
          <span className="couple-name">{WEDDING.groom.name}</span>
        </h1>
        <p className="mt-4 text-lg tracking-wider text-[var(--ivory)]/85 italic sm:text-xl">
          {WEDDING.dateLong}
        </p>
        <p className="guest-greeting font-script text-gold-foil mt-8">
          Dear {guest ?? 'Guest'}
        </p>
        <Button
          onClick={startVideo}
          disabled={stage !== 'closed'}
          size="lg"
          className="mt-10 rounded-full border border-[var(--gold)] bg-[var(--gold)] px-8 text-base tracking-[0.2em] text-[var(--bronze-deep)] uppercase shadow-[0_0_30px_oklch(0.78_0.13_85/0.45)] hover:bg-[var(--ivory)]"
        >
          <MailOpen /> Open Invitation
        </Button>
      </div>

      <div
        className={`absolute inset-0 z-10 flex items-center justify-center bg-[var(--bronze-deep)] transition-opacity duration-500 ${
          stage === 'video' ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={stage !== 'video'}
      >
        <video
          ref={videoRef}
          src={INTRO_VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onEnded={finishVideo}
          onError={() => {
            if (stage === 'video') finishVideo()
          }}
          className="h-full w-full object-contain"
        />
        {stage === 'video' && (
          <button
            type="button"
            onClick={finishVideo}
            className="font-display absolute top-4 right-4 flex items-center gap-2 rounded-full border border-[var(--gold)] bg-[var(--bronze-deep)]/70 px-5 py-2 text-sm tracking-[0.2em] text-[var(--gold)] uppercase backdrop-blur transition-colors hover:bg-[var(--gold)] hover:text-[var(--bronze-deep)] sm:top-6 sm:right-6"
          >
            Skip <SkipForward className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}
