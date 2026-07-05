import type { FounderReport } from "@/lib/reports/build";

/** Presentational report renderer (works in Server or Client Components). */
export function ReportView({ report }: { report: FounderReport }) {
  return (
    <article className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-black">{report.title}</h1>
        <p className="text-sm text-neutral-400">{report.subtitle}</p>
      </header>

      {report.sections.map((section) => (
        <section key={section.heading} className="space-y-2">
          <h2 className="text-lg font-bold text-white">{section.heading}</h2>
          {section.body && <p className="leading-7 text-neutral-300">{section.body}</p>}
          {section.bullets && section.bullets.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-300">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
          {section.subsections?.map((sub) => (
            <div key={sub.heading} className="mt-3">
              <h3 className="font-semibold text-neutral-200">{sub.heading}</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-neutral-300">
                {sub.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </article>
  );
}
