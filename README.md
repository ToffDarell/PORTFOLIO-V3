# Toff Darell Vergara - Portfolio v3

The third version of my portfolio: [toffdarell.dev](https://www.toffdarell.dev/).

Full stack developer and fourth-year IT student at Bukidnon State University. The site shows my builds, services, stack, certifications and testimonials, with an AI version of me in the corner that answers questions about my work.

Stack: Vite 6, React 19, TypeScript, plain CSS custom properties, Three.js, GSAP, Lenis, React Router 7, Phosphor icons, Poppins. Contact form through EmailJS; chatbot through Groq on a Vercel Edge Function.

## What's inside

- **Home** - the headline, a tools marquee, and a bento of every page.
- **Projects** - three featured builds (Ka-Buksuan opens its live demo), my CV, a screenshot strip, a 3D reel of all nine builds, and case-study cards.
- **Services** - six services, how I work (plan, build, ship), and the project pipeline as a live diagram.
- **Stack & Certs** - 35 technologies by category, and four certifications with verify links.
- **Testimonials**, **About**, **FAQs / Contact** - with a contact form and a ready-made Gmail draft for proposals.
- **Chatbot** - "Ask Toff", bottom-right. Answers from the same data the pages render, plus live-chat links (Messenger, Gmail, Instagram).
- Light and dark themes, black and white. A separate app-style layout below 1100px.

## Run it

```bash
npm install
cp .env.example .env   # then fill in the keys
npm run dev            # http://localhost:5173
npm run build          # typecheck + production build to dist/
```

On `npm run dev` there is no `/api`, so the chatbot calls Groq directly with `VITE_GROQ_API_KEY`. That branch only exists in dev builds; production uses `api/chat.ts`. To run the real Edge Function locally, use `vercel dev`.

## Environment variables

| Variable | Used by | Where to set it |
|---|---|---|
| `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` | Contact form | `.env` and Vercel |
| `GROQ_API_KEY` | Chatbot (`api/chat.ts`, server-side) | Vercel only |
| `VITE_GROQ_API_KEY` | Chatbot on `npm run dev` only | `.env` only |

Without the EmailJS keys, the form falls back to opening the visitor's mail app (`src/lib/contact.ts`).

## Editing content

Almost everything is data. Change the file, not the page component.

| What | Where |
|---|---|
| Name, handle, photo, email, socials, Home headline | `src/data/profile.ts` |
| Projects (write-ups, screenshots, links, stack) | `src/data/work.ts` - screenshots in `public/projects/` |
| Tech stack and certifications | `src/data/stack.ts` - logos in `public/icons/tech/`, certificates in `public/certs/` |
| Services | `src/data/services.ts` |
| FAQs | `src/data/faqs.ts` |
| How the builds are grouped (Projects "by stack") | `src/data/ai-stack.ts` |
| Gmail templates, Messenger and Instagram links | `src/lib/gmail.ts` |
| What the chatbot knows | `src/data/chatPrompt.ts` (projects, stack, certs and services are pulled in automatically) |
| Tools marquee on Home | `src/components/ToolsMarquee.tsx` |
| Colors | `src/styles/tokens.css` - the palette lives only here |
| SEO, share image, favicon | `index.html`, `public/og-image.jpg`, `public/favicon.png` |
| CV | `public/resume.pdf` |

Add a project to `work.ts` and it shows up in the reel, the case studies, the screenshot strip, Home and the chatbot.

## Deploy

Built for Vercel. `vercel.json` carries the redirect to `www`, the security headers, the Content Security Policy (which allows the Ka-Buksuan demo to be framed) and the SPA rewrite so routes like `/projects` load directly. Set the environment variables above in Vercel -> Settings -> Environment Variables.

## Notes

- The background shader measures the visitor's frame rate and steps down on slow machines (`src/lib/perf.ts`). Keep large `backdrop-filter` blurs off the layers above it.
- From 1100px down, the site switches to the phone layout (`TabBar`, `HomeMobile`, `src/styles/mobile-app.css`).
- Anything new above the fold on Home must join the intro hold-back list in `src/styles/boot.css`, or it shows through the intro animation.
- `npm run lint` does not work yet: the ESLint config has no TypeScript parser. `npm run build` does the type checking.

## Credits

- Built on the [Portfolio Template](LICENSE) by BrewedOps (MIT).
- Contour background technique inspired by landonorris.com by OFF+BRAND. Simplex noise by Ashima Arts / Ian McEwan (MIT).
- Icons: [Phosphor](https://phosphoricons.com) (MIT), [Devicon](https://devicon.dev) and [Simple Icons](https://simpleicons.org). Tool and brand logos are trademarks of their owners.
- Font: Poppins (SIL Open Font License).

## License

The code is MIT - see [LICENSE](LICENSE). My photos, CV, certificates, project screenshots, testimonials and written content are mine and are not covered by that license.
