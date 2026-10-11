type LegalSection = {
  title: string;
  paragraphs: string[];
};

export function LegalPage({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: LegalSection[];
}) {
  return (
    <article className="legal-page page-container">
      <header className="legal-heading">
        <p className="legal-eyebrow">বাজার দর · নীতিমালা</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <p className="legal-updated">সর্বশেষ হালনাগাদ: ১১ অক্টোবর ২০২৬</p>
      </header>
      <div className="legal-content">
        {sections.map((section, index) => (
          <section className="legal-section" key={section.title}>
            <h2>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
