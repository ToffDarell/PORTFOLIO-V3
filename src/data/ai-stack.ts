/**
 * The builds as a tree: you at the root, the kinds of system as branches,
 * each build a leaf. Shown in the Projects "every build" pop-up (AIStackGrid)
 * and as the chips on Home and the Projects card. Copy comes from work.ts, so
 * a project is written up once.
 *
 * Status matches the resume: "Live" (deployed, people use it), "Client"
 * (built for a real client), "Capstone" (the capstone project), "Academic"
 * (a coursework build), "Proposed" (built as a proposal).
 */

import {
  Sparkle,
  VideoCamera,
  Buildings,
  Eye,
  Archive,
  ShoppingBag,
  GameController,
  Bank,
  Terminal,
  Browsers,
  Cpu,
  QrCode,
  DeviceMobile,
} from '@/components/slab'
import type { Icon } from '@/components/slab'
import { profile } from '@/data/profile'
import { workById, type WorkStatus } from '@/data/work'

export type StackStatus = WorkStatus

export type StackLogo = { src: string; name: string }

export type StackNode = {
  id: string
  name: string
  /** One plain sentence a non-technical reader understands. */
  what: string
  /** The real stack. Rendered small and muted. */
  stack?: string
  status?: StackStatus
  /** Phosphor glyph for the card's mark tile. Every node has one. */
  Icon: Icon
  logos?: StackLogo[]
  children?: StackNode[]
}

/** A leaf straight from work.ts. */
const build = (id: string, Icon: Icon): StackNode => {
  const w = workById(id)
  if (!w) throw new Error(`Unknown build: ${id}`)
  return { id, Icon, name: w.short, what: w.description, stack: w.tags.join(' · '), status: w.status }
}

export const aiStack: StackNode = {
  id: 'root',
  Icon: Sparkle,
  name: profile.name,
  what: 'Eleven systems, from real-time chat and SaaS to computer vision, Android and C.',
  stack: 'Web · SaaS · AI',
  children: [
    {
      id: 'web',
      Icon: Browsers,
      name: 'Web systems & SaaS',
      what: 'Full stack apps for real organizations: lenders, schools, barangays, shops and a city transit office.',
      children: [
        build('paymonitor', Bank),
        build('cpag', Archive),
        build('barangay', Buildings),
        build('mugna', ShoppingBag),
        build('blackout', GameController),
        build('borongan', QrCode),
      ],
    },
    {
      id: 'realtime',
      Icon: VideoCamera,
      name: 'Real-time & AI',
      what: 'Live video between strangers, and cameras that read helmets and plates.',
      children: [build('ka-buksuan', VideoCamera), build('saferide', Eye)],
    },
    {
      id: 'systems',
      Icon: Cpu,
      name: 'Mobile, games & systems',
      what: 'An Android inventory app, a Java game engine built from scratch and C data structures.',
      children: [build('jams-gadget', DeviceMobile), build('skyfall', GameController), build('homeroom', Terminal)],
    },
  ],
}
