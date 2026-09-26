import { ArrowLeft } from '@/components/slab'
import { useNavigate } from 'react-router-dom'
import { profile } from '@/data/profile'

/**
 * Privacy Policy. Legal text has to describe YOUR site and what
 * it collects, so none is supplied. Write it (or have a lawyer or a policy
 * generator write it) and paste it into the sections below.
 */
export default function Privacy() {
  const navigate = useNavigate()

  return (
    <main className="legal-page" aria-label="Privacy Policy">
      <div className="legal-page__card">
        <button
          className="legal-page__back"
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          <ArrowLeft weight="bold" size={15} aria-hidden="true" />
          Back to home
        </button>

        <h1 className="legal-page__title">Privacy Policy</h1>
        <p className="legal-page__updated">Last updated: September 26, 2026</p>

        <div className="legal-page__body">
          <h2>Who this covers</h2>
          <p>This site, toffdarell.dev, is run by {profile.name}. This policy covers this site only.</p>

          <h2>What is collected</h2>
          <p>
            The contact form collects the name, email address and message you type in. The chat
            collects the questions you ask it. There are no analytics or advertising trackers. Your
            browser keeps your theme and accessibility choices in local storage, on your device.
          </p>

          <h2>How it is used</h2>
          <p>
            Contact messages are delivered to my inbox through EmailJS and used only to reply to
            you. Chat questions are sent to Groq to generate an answer and are not stored by this
            site. Nothing is sold or shared for marketing.
          </p>

          <h2>How long it is kept</h2>
          <p>
            Messages stay in my email until they are no longer needed. To have yours deleted, email
            me and I will remove it.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy: <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
        </div>
      </div>
    </main>
  )
}
