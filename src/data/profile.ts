/**
 * YOUR IDENTITY - start here.
 *
 * Everything that says who you are lives in this file: name, handle, photo,
 * socials, email and the Home headline.
 *
 * Page-specific copy (projects, services, testimonials, FAQs) lives in the
 * other files in src/data/ and at the top of each view component.
 */

export type SocialLink = {
  label: string
  href: string
  iconPath: string
}

export type Stat = { value: string; label: string }

export type Profile = {
  name: string
  /** First name, used in "Hi, I'm ___." on About. */
  firstName: string
  handle: string
  /** Short role line under the handle on phones. */
  role: string
  /** Square image. An SVG, WebP or PNG with a transparent background looks best. */
  avatarSrc: string
  /** Tooltip / screen-reader label on the verified tick next to your name. */
  verifiedLabel: string
  email: string
  location: string
  /** Three short proof facts shown on phones under the Home lede. */
  stats: Stat[]
  displayName: { line1: string; line2: string }
  hero: {
    body: string
    portraitSrc: string
    portraitAlt: string
  }
  socials: SocialLink[]
}

export const profile: Profile = {
  name: 'Toff Darell Vergara',
  firstName: 'Toff',
  handle: '@toffdarell',
  role: 'Aspiring Full Stack Developer',
  avatarSrc: '/me/toff.webp',
  verifiedLabel: 'Cisco CCNA certified',
  email: 'topedarell13@gmail.com',
  location: 'Bukidnon, Philippines',
  stats: [
    { value: '9', label: 'Systems built' },
    { value: '4', label: 'Certifications' },
    { value: 'GMT+8', label: 'Philippines' },
  ],
  // The intro types this line, then flies it into the Home headline.
  // Keep it short: two halves, 5-8 words total.
  displayName: { line1: 'I build things', line2: 'that actually work.' },
  hero: {
    body: 'Aspiring full stack developer and fourth-year IT student building web systems, SaaS and AI tools that solve real problems.',
    portraitSrc: '/me/toff.webp',
    portraitAlt: 'Portrait of Toff Darell Vergara',
  },
  socials: [
    { label: 'GitHub profile', href: 'https://github.com/ToffDarell', iconPath: '/icons/github.svg' },
    { label: 'LinkedIn profile', href: 'https://www.linkedin.com/in/toff-darell-vergara-839462408/', iconPath: '/icons/linkedin.svg' },
    { label: 'Facebook profile', href: 'https://www.facebook.com/toffdarell', iconPath: '/icons/facebook.svg' },
    { label: 'Instagram profile', href: 'https://www.instagram.com/topewooo/', iconPath: '/icons/instagram.svg' },
  ],
}
