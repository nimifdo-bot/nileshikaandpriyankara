# Nileshika & Priyankara — Wedding Invitation

An online wedding invitation for the wedding of Nileshika Fernando and Priyankara Demel on Thursday, 17th December 2026 at Sushi House & Resort, Panadura.

Guests land on a gold curtain cover. Tapping **Open Invitation** plays the wedding animation video (with a Skip button), then the curtains part to reveal the invitation: names and families, a live countdown, the Poruwa ceremony and reception, add-to-calendar links, a photo gallery, the venue with a map, an RSVP form, and tap-to-call numbers for the couple. Background music plays throughout, with a mute/unmute button always visible in the corner.

Personalise the cover for a guest by adding `?to=Name` to the link, e.g. `/?to=Uncle%20Sunil`.

## Technologies

- TanStack Start (React 19) with Vite and Tailwind CSS 4
- Netlify Forms for RSVP submissions
- Netlify Image CDN for responsive WebP images

## Running locally

```bash
pnpm install
netlify dev
```

Wedding details (names, phone numbers, date, venue, events) live in `src/lib/wedding.ts`.
