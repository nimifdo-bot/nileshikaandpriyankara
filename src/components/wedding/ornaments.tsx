import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { img } from '@/lib/wedding'

export function Mandala({
  className,
  spin = false,
}: {
  className?: string
  spin?: boolean
}) {
  return (
    <img
      src={img('mandala.png', 480)}
      alt=""
      aria-hidden
      className={cn(
        'pointer-events-none select-none mix-blend-multiply',
        spin && 'spin-slow',
        className,
      )}
    />
  )
}

export function Divider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3 text-[var(--gold-deep)]',
        className,
      )}
      aria-hidden
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-current sm:w-24" />
      <svg viewBox="0 0 24 24" className="size-5 fill-current">
        <path d="M12 2c1.5 3 4 5 7 5-3 1-5 3.5-5 7 0 3-1 6-2 8-1-2-2-5-2-8 0-3.5-2-6-5-7 3 0 5.5-2 7-5z" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-current sm:w-24" />
    </div>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  light = false,
}: {
  eyebrow: string
  title: string
  light?: boolean
}) {
  return (
    <div className="mb-12 text-center">
      <p
        className={cn(
          'font-script text-3xl sm:text-4xl',
          light ? 'text-[var(--gold)]' : 'text-[var(--gold-deep)]',
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          'font-display mt-1 text-3xl tracking-[0.18em] uppercase sm:text-4xl',
          light ? 'text-[var(--ivory)]' : 'text-primary',
        )}
      >
        {title}
      </h2>
      <Divider className="mt-5" />
    </div>
  )
}

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  duration: `${9 + ((i * 7) % 8)}s`,
  delay: `${(i * 1.3) % 9}s`,
  scale: 0.6 + ((i * 13) % 10) / 15,
}))

export function Petals() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            scale: p.scale,
          }}
        />
      ))}
    </div>
  )
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={cn('reveal', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
