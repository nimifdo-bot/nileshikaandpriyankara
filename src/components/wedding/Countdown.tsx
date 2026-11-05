import { useEffect, useState } from 'react'
import { WEDDING } from '@/lib/wedding'

const UNITS = ['Days', 'Hours', 'Minutes', 'Seconds'] as const
type Unit = (typeof UNITS)[number]

function remaining(now: number): Record<Unit, number> {
  const diff = Math.max(0, WEDDING.date.getTime() - now)
  return {
    Days: Math.floor(diff / 86_400_000),
    Hours: Math.floor(diff / 3_600_000) % 24,
    Minutes: Math.floor(diff / 60_000) % 60,
    Seconds: Math.floor(diff / 1000) % 60,
  }
}

export function Countdown() {
  // Starts null so server and first client render match.
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const left = now === null ? null : remaining(now)
  const isToday = left !== null && Object.values(left).every((v) => v === 0)

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 sm:gap-5">
        {UNITS.map((unit) => (
          <div
            key={unit}
            className="rounded-t-full border border-[var(--gold)]/60 bg-white/5 px-1 pt-6 pb-4 text-center backdrop-blur-sm sm:pt-9"
          >
            <div className="font-display text-3xl text-[var(--gold)] tabular-nums sm:text-5xl">
              {left ? String(left[unit]).padStart(2, '0') : '--'}
            </div>
            <div className="mt-2 text-xs tracking-[0.25em] text-[var(--ivory)]/80 uppercase sm:text-sm">
              {unit}
            </div>
          </div>
        ))}
      </div>
      {isToday && (
        <p className="font-script mt-8 text-center text-4xl text-[var(--gold)]">
          Today is the day!
        </p>
      )}
    </div>
  )
}
