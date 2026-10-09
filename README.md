# sushnt.dev

My portfolio site, built with Next.js (App Router) and TypeScript.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Where things live

- `data/content.ts` is all the site's content: bio, story, domains, projects and links. Edit this file to update the site.
- `app/page.tsx` is the Home page (intro, story, domains).
- `app/projects/page.tsx` is the Projects page.
- `app/contact/page.tsx` is the Contact page.
- `app/globals.css` holds all styles. Light and dark colors are CSS variables at the top.
- `components/` contains the nav, the dark mode toggle, the Redis terminal demo, the contact form and the icons.

## Dark mode

The toggle in the nav switches themes and remembers the choice. On a first visit the site follows the visitor's OS setting. A small script in `app/layout.tsx` sets the theme before the page paints, so there's no flash.

## To do

- Add your LinkedIn URL (`profile.linkedin`). The link stays hidden until it's set.
- Add project demos: put GIFs or MP4s in `public/demos/` and set `demo.src` on each project, e.g. `"/demos/trainlog.mp4"`.
- Add GitHub links for the journaling app, Brainly and the diabetes app once their repos are public (set `links` in `data/content.ts`).
- The contact form currently opens the visitor's email app. To send messages directly, add an API route (e.g. with Resend).
