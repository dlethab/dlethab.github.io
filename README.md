# dlethab.github.io

My personal site: a matchday tactics board. Experience plays up front, projects in midfield, leadership at the back, and there's a penalty shootout hidden on the centre spot.

## Develop

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run deploy    # build + publish dist/ to the gh-pages branch
```

## Editing content

All content lives in [`src/data/content.js`](src/data/content.js):

- `profile`: name, bio, links
- `squad`: the eleven on the pitch (`line`, `pos`, `number`, `x`/`y` position, bullets, tools, links)
- `archive`: older entries shown in the Archive drawer

The résumé is served from `public/resume.pdf`.

## Stack

React 19 · Vite · Tailwind CSS · Framer Motion
