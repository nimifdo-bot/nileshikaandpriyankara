export const WEDDING = {
  bride: {
    name: 'Nileshika',
    fullName: 'Nileshika Fernando',
    father: 'Mr. Jayanath Fernando',
    mother: 'Mrs. Sarojini Mendis',
    phone: '075 065 2498',
  },
  groom: {
    name: 'Priyankara',
    fullName: 'Priyankara Demel',
    father: 'Mr. Kumara Demel',
    mother: 'Mrs. Nimala Manamperi',
    phone: '075 299 3656',
  },
  date: new Date('2026-12-17T09:30:00+05:30'),
  dateLong: 'Thursday, 17th December 2026',
  dateShort: '17 . 12 . 26',
  rsvpBy: '1st December 2026',
  venue: {
    name: 'Sushi House & Resort',
    area: 'Panadura, Sri Lanka',
    address: '631, Keselwatte, 3 Old Galle Rd, Panadura',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Sushi+House+%26+Resort+Keselwatte+Panadura',
    embedUrl:
      'https://maps.google.com/maps?q=Sushi%20House%20%26%20Resort%2C%20Keselwatte%2C%20Panadura&z=15&output=embed',
  },
  events: [
    {
      title: 'Wedding Reception',
      time: '9.30 A.M. onwards',
      description:
        'Join us for lunch, music and celebration as we begin this new chapter together.',
    },
    {
      title: 'Poruwa Ceremony',
      time: '10.00 A.M.',
      description:
        'Following age-old Sri Lankan tradition, the couple will ascend the poruwa to exchange vows amid blessings, jayamangala gatha and the warmth of family.',
    },
  ],
}

export const COUPLE = `${WEDDING.bride.name} & ${WEDDING.groom.name}`

export const MUSIC_SRC = '/media/wedding-music.mp3'
export const INTRO_VIDEO_SRC = '/media/wedding-animation.mp4'

/** Image CDN URL for a file in public/img. */
export function img(file: string, width: number) {
  return `/.netlify/images?url=/img/${file}&w=${width}&fm=webp`
}

/** Local Sri Lankan number (e.g. "075 065 2498") → tel: link in +94 format. */
export function telHref(phone: string) {
  return `tel:+94${phone.replace(/\D/g, '').replace(/^0/, '')}`
}

function icsDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

export function calendarLinks() {
  const start = WEDDING.date
  const end = new Date(start.getTime() + 7 * 60 * 60 * 1000)
  const title = `Wedding of ${COUPLE}`
  const location = `${WEDDING.venue.name}, ${WEDDING.venue.address}, Sri Lanka`
  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${icsDate(start)}/${icsDate(end)}&location=${encodeURIComponent(location)}&details=Wedding%20reception%20from%209.30%20a.m.%2C%20Poruwa%20ceremony%20at%2010.00%20a.m.`
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nileshika & Priyankara//Wedding//EN',
    'BEGIN:VEVENT',
    `UID:wedding-${icsDate(start)}@nileshika-priyankara`,
    `DTSTAMP:${icsDate(start)}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  return {
    google,
    ics: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`,
  }
}
