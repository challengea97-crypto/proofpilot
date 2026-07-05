import { ContentPage } from "@/components/ContentPage";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy Policy" updated="July 2026">
      <p>
        This describes what Teckro collects and how it&apos;s used. It&apos;s a starting template —
        have it reviewed for your jurisdiction before relying on it.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Your email address (for sign-in).</li>
        <li>The projects, ideas and notes you create.</li>
        <li>Billing details handled by Stripe — we never see or store your card number.</li>
      </ul>

      <h2>How we use it</h2>
      <p>
        To provide the Service: authenticate you, store your projects, generate research and
        reports, and process payments. We don&apos;t sell your data.
      </p>

      <h2>AI processing</h2>
      <p>
        When you run research or an analysis, the relevant brief is sent to our AI provider (Groq)
        to generate the output. Don&apos;t submit information you don&apos;t want processed this way.
      </p>

      <h2>Storage &amp; security</h2>
      <p>
        Data is stored in Supabase (Postgres) with row-level security, so each account can only
        access its own records. Shared reports are reachable only via the private link you generate.
      </p>

      <h2>Your rights</h2>
      <p>
        You can view your data in the app and delete your projects and reports at any time. Contact
        us to request account deletion.
      </p>

      <h2>Cookies</h2>
      <p>
        We use essential cookies to keep you signed in. We don&apos;t use advertising trackers.
      </p>
    </ContentPage>
  );
}
