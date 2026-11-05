import { useState, type FormEvent } from 'react'
import { Check, Heart, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const OPTIONS = ['Joyfully Accept', 'Regretfully Decline'] as const
// The plain status saved with each Netlify Forms submission.
const STATUS: Record<(typeof OPTIONS)[number], string> = {
  'Joyfully Accept': 'Attending',
  'Regretfully Decline': 'Not Attending',
}
type State = 'idle' | 'pending' | 'success' | 'error'

export function RsvpForm({ guest }: { guest: string | null }) {
  const [state, setState] = useState<State>('idle')
  const [attendance, setAttendance] =
    useState<(typeof OPTIONS)[number]>('Joyfully Accept')
  const [guests, setGuests] = useState(1)
  const attending = attendance === 'Joyfully Accept'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'pending') return
    const body = new URLSearchParams()
    new FormData(event.currentTarget).forEach((value, key) =>
      body.append(key, String(value)),
    )
    setState('pending')
    try {
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new Error('Submission failed')
      if (/\bdata-netlify\s*=/i.test(await response.text()))
        throw new Error('Form handling is unavailable')
      setState('success')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="py-10 text-center" role="status">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Heart className="size-7 fill-current" />
        </div>
        <p className="font-script mt-6 text-4xl text-[var(--gold-deep)]">
          Thank you!
        </p>
        <p className="mt-3 text-lg text-muted-foreground">
          {attending
            ? 'Your reply has been received. We can’t wait to celebrate with you.'
            : 'Your reply has been received. You will be missed — thank you for letting us know.'}
        </p>
      </div>
    )
  }

  return (
    <form
      name="rsvp"
      method="POST"
      action="/__forms.html"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={submit}
      onChange={() => {
        if (state === 'error') setState('idle')
      }}
      className="text-left"
    >
      <input type="hidden" name="form-name" value="rsvp" />
      <input type="hidden" name="invited-as" value={guest ?? ''} />
      <input type="hidden" name="attendance" value={STATUS[attendance]} />
      <input type="hidden" name="guests" value={attending ? guests : 0} />
      <p hidden>
        <label>
          Leave empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <fieldset disabled={state === 'pending'} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="rsvp-name" className="text-base">
            Full Name
          </Label>
          <Input
            id="rsvp-name"
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            defaultValue={guest ?? ''}
            className="h-11 bg-white/70 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rsvp-phone" className="text-base">
            Phone / WhatsApp Number
          </Label>
          <Input
            id="rsvp-phone"
            name="phone"
            type="tel"
            required
            maxLength={20}
            autoComplete="tel"
            placeholder="+94 7X XXX XXXX"
            className="h-11 bg-white/70 text-base"
          />
        </div>
        <div className="space-y-2">
          <span className="text-base font-medium">Will you attend?</span>
          <div
            className="grid grid-cols-2 gap-3"
            role="radiogroup"
            aria-label="Attendance"
          >
            {OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={attendance === option}
                onClick={() => setAttendance(option)}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-md border px-3 py-3 text-base transition-colors',
                  attendance === option
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-white/60 hover:border-primary/60',
                )}
              >
                {attendance === option && <Check className="size-4" />}
                {option}
              </button>
            ))}
          </div>
        </div>
        {attending && (
          <div className="space-y-2">
            <span className="text-base font-medium">Number of Guests</span>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Fewer guests"
                onClick={() => setGuests((n) => Math.max(1, n - 1))}
              >
                <Minus />
              </Button>
              <span
                className="font-display w-10 text-center text-2xl tabular-nums"
                aria-live="polite"
              >
                {guests}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="More guests"
                onClick={() => setGuests((n) => Math.min(10, n + 1))}
              >
                <Plus />
              </Button>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="rsvp-message" className="text-base">
            Wishes for the couple (optional)
          </Label>
          <Textarea
            id="rsvp-message"
            name="message"
            maxLength={1000}
            rows={3}
            className="bg-white/70 text-base"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-full text-base tracking-[0.2em] uppercase"
        >
          {state === 'pending' ? 'Sending…' : 'Send RSVP'}
        </Button>
        {state === 'error' && (
          <p role="alert" className="text-center text-destructive">
            We couldn’t confirm your reply was sent. Your details are still here
            — please try again in a moment.
          </p>
        )}
      </fieldset>
    </form>
  )
}
