export function SkillChips({ skills = [], tone = 'neutral' }) {
  if (!skills.length) return <p className="empty-copy">No skills detected.</p>
  return <div className={`skill-badges ${tone}`}>{skills.map((skill) => <span className="skill-badge" key={skill}>{skill}</span>)}</div>
}

export function PageIntro({ kicker, title, description }) {
  return <div className="page-intro"><p className="section-kicker">{kicker}</p><h1>{title}</h1>{description && <p>{description}</p>}</div>
}

export function AnalysisRequired({ onNavigate }) {
  return <section className="empty-state page-section"><span className="empty-icon" aria-hidden="true">R</span><h1>Start with your resume.</h1><p>Analyze a resume first to view your results.</p><button className="analyze-button" type="button" onClick={() => onNavigate('/analyze')}>Analyze resume <span aria-hidden="true">&#8594;</span></button></section>
}

export function ResultPanel({ title, description, children, className = '' }) {
  return <article className={`dashboard-panel result-panel ${className}`}><h2>{title}</h2>{description && <p className="panel-description">{description}</p>}{children}</article>
}
