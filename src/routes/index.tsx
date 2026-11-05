import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  CalendarPlus,
  ChevronDown,
  Clock,
  MapPin,
  Navigation,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Cover } from '@/components/wedding/Cover'
import { Countdown } from '@/components/wedding/Countdown'
import { RsvpForm } from '@/components/wedding/RsvpForm'
import {
  MusicToggle,
  useBackgroundMusic,
} from '@/components/wedding/BackgroundMusic'
import {
  Divider,
  Mandala,
  Petals,
  Reveal,
  SectionTitle,
} from '@/components/wedding/ornaments'
import {
  COUPLE,
  WEDDING,
  calendarLinks,
  img,
  telHref,
} from '@/lib/wedding'

/** Guest name from `?guest=` (or the older `?to=`), trimmed and capped. */
function guestFromSearch(search: object) {
  const { guest, to } = search as { guest?: unknown; to?: unknown }
  const raw = guest ?? to
  if (raw == null || typeof raw === 'object') return undefined
  // The router JSON-parses search values, so `?guest=123` arrives as a number.
  const name = String(raw).replace(/\s+/g, ' ').trim().slice(0, 60)
  return name || undefined
}

export const Route = createFileRoute('/')({
  // Personalised link previews (WhatsApp etc.) — read from the server-rendered HTML.
  head: ({ match }) => {
    const guest = guestFromSearch(match.search)
    if (!guest) return {}
    const title = `Dear ${guest}, you're invited — ${COUPLE}`
    const description = `Dear ${guest}, you are warmly invited to the wedding of ${COUPLE} on ${WEDDING.dateLong} at ${WEDDING.venue.name}, ${WEDDING.venue.area}.`
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
      ],
    }
  },
  component: Invitation,
})

const NAV = [
  { href: '#home', label: 'Home' },
  { href: '#events', label: 'Events' },
  { href: '#venue', label: 'Venue' },
  { href: '#rsvp', label: 'RSVP' },
]

const GALLERY = [
  { file: 'gallery-1.jpg', alt: 'Nileshika and Priyankara gazing at each other in a garden aisle' },
  { file: 'gallery-2.jpg', alt: 'Nileshika and Priyankara laughing together in school uniforms' },
  { file: 'gallery-3.jpg', alt: 'A portrait of Nileshika and Priyankara' },
  { file: 'gallery-4.jpg', alt: 'Nileshika and Priyankara strolling along the beach' },
]

const CONTACTS = [WEDDING.bride, WEDDING.groom]

function Invitation() {
  // Read the raw query (no validateSearch) so shared links are never rewritten/redirected.
  const guest = guestFromSearch(Route.useSearch()) ?? null
  const [opened, setOpened] = useState(false)
  const music = useBackgroundMusic()

  const calendar = calendarLinks()

  return (
    <div className="paper min-h-screen overflow-x-hidden text-foreground">
      <Cover
        guest={guest}
        onStart={music.play}
        onOpen={() => setOpened(true)}
      />
      <MusicToggle
        muted={music.muted}
        playing={music.playing}
        onToggle={music.toggleMute}
      />

      <nav
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-700 ${opened ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      >
        <div className="mx-auto mt-3 flex w-fit items-center gap-1 rounded-full border border-[var(--gold)]/50 bg-[var(--ivory)]/85 px-2 py-1.5 shadow-sm backdrop-blur sm:gap-2">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display rounded-full px-3 py-1 text-xs tracking-[0.15em] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground sm:px-4 sm:text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="home" className="relative px-5 pt-24 pb-16 text-center sm:pt-28">
        <Mandala
          spin
          className="absolute -top-40 left-1/2 w-[38rem] max-w-none -translate-x-1/2 opacity-25"
        />
        <div className="relative mx-auto max-w-3xl">
          <Reveal>
            <p className="font-display text-sm tracking-[0.4em] text-[var(--gold-deep)] uppercase sm:text-base">
              Sri Suba Mangalam!
            </p>
            <p className="mt-6 text-xl text-muted-foreground italic sm:text-2xl">
              With the blessings of the Triple Gem and our beloved families,
              <br className="hidden sm:block" /> you are invited to the wedding
              of
            </p>
          </Reveal>
          <div className="mt-10 grid items-center gap-8 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
            <Reveal delay={150}>
              <h1 className="couple-name-hero font-script mx-auto leading-none text-primary">
                {WEDDING.bride.name}
              </h1>
              <p className="font-display mt-2 text-sm tracking-[0.2em] uppercase">
                {WEDDING.bride.fullName}
              </p>
              <p className="mt-3 text-lg text-muted-foreground italic">
                Daughter of
                <br />
                {WEDDING.bride.father} &amp; {WEDDING.bride.mother}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <span className="font-script text-gold-foil text-6xl">&amp;</span>
            </Reveal>
            <Reveal delay={450}>
              <h1 className="couple-name-hero font-script mx-auto leading-none text-primary">
                {WEDDING.groom.name}
              </h1>
              <p className="font-display mt-2 text-sm tracking-[0.2em] uppercase">
                {WEDDING.groom.fullName}
              </p>
              <p className="mt-3 text-lg text-muted-foreground italic">
                Son of
                <br />
                {WEDDING.groom.father} &amp; {WEDDING.groom.mother}
              </p>
            </Reveal>
          </div>
          <Reveal delay={200} className="mt-12">
            <div className="font-display mx-auto flex w-fit items-center gap-5 text-primary">
              <span className="border-y border-[var(--gold)] px-3 py-2 text-sm tracking-[0.3em] sm:text-base">
                DECEMBER
              </span>
              <span className="text-6xl leading-none sm:text-7xl">17</span>
              <span className="border-y border-[var(--gold)] px-3 py-2 text-sm tracking-[0.3em] sm:text-base">
                2026
              </span>
            </div>
            <p className="mt-4 text-xl italic">{WEDDING.dateLong}</p>
            <p className="font-display mt-1 text-sm tracking-[0.25em] text-muted-foreground uppercase">
              {WEDDING.venue.name} · {WEDDING.venue.area}
            </p>
            <p className="font-display mt-8 text-xs tracking-[0.5em] text-[var(--gold-deep)] uppercase">
              Together begins forever
            </p>
          </Reveal>
        </div>
        <Reveal className="relative mx-auto mt-14 max-w-6xl">
          <img
            src={img('elephant.png', 400)}
            alt=""
            aria-hidden
            className="float-y absolute -bottom-6 -left-10 hidden w-56 mix-blend-multiply lg:block"
          />
          <img
            src={img('elephant.png', 400)}
            alt=""
            aria-hidden
            className="float-y absolute -right-10 -bottom-6 hidden w-56 -scale-x-100 mix-blend-multiply [animation-delay:-3s] lg:block"
          />
          <div className="gold-frame mx-auto max-w-4xl overflow-hidden rounded-sm bg-card p-2 shadow-xl">
            <img
              src={img('hero.png', 1400)}
              srcSet={`${img('hero.png', 700)} 700w, ${img('hero.png', 1400)} 1400w`}
              sizes="(min-width: 896px) 896px, 100vw"
              alt="Illustration of a traditional Sri Lankan poruwa wedding ceremony by a lake at sunset"
              className="w-full"
            />
          </div>
        </Reveal>
        <a
          href="#countdown"
          className="mt-10 inline-flex flex-col items-center text-sm tracking-[0.3em] text-muted-foreground uppercase"
        >
          Scroll down
          <ChevronDown className="mt-1 animate-bounce" />
        </a>
      </section>

      <section id="countdown" className="gold-velvet relative overflow-hidden px-5 py-20">
        <Petals />
        <div className="relative mx-auto max-w-3xl">
          <Reveal>
            <SectionTitle
              eyebrow="The Big Day Awaits"
              title="Counting Down to Forever"
              light
            />
            <Countdown />
          </Reveal>
        </div>
      </section>

      <section id="events" className="px-5 py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionTitle eyebrow="Celebrate With Us" title="Wedding Events" />
          </Reveal>
          <div className="grid gap-8 md:grid-cols-2">
            {WEDDING.events.map((event, i) => (
              <Reveal key={event.title} delay={i * 150}>
                <article className="gold-frame relative h-full overflow-hidden rounded-t-[10rem] bg-card px-8 pt-14 pb-10 text-center shadow-md">
                  <Mandala className="mx-auto mb-5 size-20" />
                  <h3 className="font-display text-2xl tracking-[0.15em] text-primary uppercase">
                    {event.title}
                  </h3>
                  <p className="mt-3 flex items-center justify-center gap-2 text-xl text-[var(--gold-deep)]">
                    <Clock className="size-5" /> {event.time}
                  </p>
                  <p className="mt-1 flex items-center justify-center gap-2 text-lg">
                    <MapPin className="size-5 text-[var(--gold-deep)]" />{' '}
                    {WEDDING.venue.name}, Panadura
                  </p>
                  <Divider className="my-5" />
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14 text-center">
            <p className="font-script text-4xl text-[var(--gold-deep)]">
              Save the Date
            </p>
            <p className="mt-1 text-lg text-muted-foreground">
              Add the wedding to your calendar
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <a href={calendar.google} target="_blank" rel="noreferrer">
                  <CalendarPlus /> Google Calendar
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary text-primary"
              >
                <a
                  href={calendar.ics}
                  download="nileshika-priyankara-wedding.ics"
                >
                  <CalendarPlus /> Apple / Outlook
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/60 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionTitle eyebrow="Captured Moments" title="Our Gallery" />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GALLERY.map((photo, i) => (
              <Reveal key={photo.file} delay={i * 120}>
                <div className="group overflow-hidden rounded-sm border border-[var(--gold)]/50 bg-card p-1.5 shadow">
                  <img
                    src={img(photo.file, 700)}
                    alt={photo.alt}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="venue" className="px-5 py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionTitle eyebrow="The Setting" title="Venue" />
          </Reveal>
          <Reveal>
            <div className="gold-frame grid overflow-hidden rounded-sm bg-card shadow-lg md:grid-cols-2">
              <img
                src={img('venue.png', 900)}
                alt="Wedding pavilion at Sushi House & Resort, Panadura at golden hour"
                loading="lazy"
                className="h-64 w-full object-cover md:h-full"
              />
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <MapPin className="size-8 text-[var(--gold-deep)]" />
                <h3 className="font-display mt-3 text-3xl tracking-[0.12em] text-primary uppercase">
                  {WEDDING.venue.name}
                </h3>
                <p className="mt-1 text-xl text-muted-foreground italic">
                  {WEDDING.venue.address}
                </p>
                <p className="mt-4 text-lg">{WEDDING.dateLong}</p>
                <Button asChild size="lg" className="mt-6 rounded-full">
                  <a href={WEDDING.venue.mapsUrl} target="_blank" rel="noreferrer">
                    <Navigation /> View on Map
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal className="mt-8">
            <iframe
              title="Map to Sushi House & Resort, Panadura"
              src={WEDDING.venue.embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full rounded-sm border border-[var(--gold)]/50 grayscale-[30%] sepia-[30%]"
            />
          </Reveal>
        </div>
      </section>

      <section id="rsvp" className="gold-velvet relative overflow-hidden px-5 py-24">
        <Mandala
          spin
          className="absolute -right-40 -bottom-40 w-[30rem] opacity-10 mix-blend-screen"
        />
        <div className="relative mx-auto max-w-xl">
          <Reveal>
            <SectionTitle
              eyebrow="Kindly Reply"
              title="Will You Join Us?"
              light
            />
            <p className="-mt-6 mb-10 text-center text-lg text-[var(--ivory)]/80 italic">
              We joyfully await your presence. Please let us know by{' '}
              {WEDDING.rsvpBy}.
            </p>
            <div className="rounded-sm border border-[var(--gold)]/70 bg-card p-6 shadow-2xl sm:p-10">
              <RsvpForm key={guest ?? ''} guest={guest} />
            </div>
            <div className="mt-10 text-center">
              <p className="text-lg text-[var(--ivory)]/80 italic">
                For any enquiries, please call
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {CONTACTS.map((person) => (
                  <a
                    key={person.phone}
                    href={telHref(person.phone)}
                    aria-label={`Call ${person.name} on ${person.phone}`}
                    className="group flex items-center gap-3 rounded-full border border-[var(--gold)]/70 bg-white/5 px-5 py-2.5 text-[var(--ivory)] backdrop-blur-sm transition-colors hover:bg-[var(--gold)] hover:text-[var(--bronze-deep)]"
                  >
                    <Phone className="size-4 text-[var(--gold)] group-hover:text-current" />
                    <span className="font-display text-sm tracking-[0.15em] uppercase">
                      {person.name}
                    </span>
                    <span className="text-lg tabular-nums">{person.phone}</span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="px-5 py-20 text-center">
        <Reveal>
          <Mandala className="mx-auto size-28" />
          <p className="font-script mt-4 text-4xl text-[var(--gold-deep)]">
            Save the Date
          </p>
          <p className="font-display mt-2 text-3xl tracking-[0.3em] text-primary">
            {WEDDING.dateShort}
          </p>
          <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground italic">
            Kindly confirm your attendance by {WEDDING.rsvpBy}. We look forward
            to celebrating with you!
          </p>
          <Divider className="my-8" />
          <p className="font-script text-5xl text-primary">{COUPLE}</p>
          <p className="font-display mt-3 text-sm tracking-[0.25em] text-muted-foreground uppercase">
            {WEDDING.venue.name} · {WEDDING.venue.area}
          </p>
        </Reveal>
      </footer>
    </div>
  )
}
