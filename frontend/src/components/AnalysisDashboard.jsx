function formatCategoryName(category) {
  return category
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function SkillList({ skills, emptyMessage, tone }) {
  if (!skills.length) {
    return <p className="dashboard-empty">{emptyMessage}</p>
  }

  return (
    <div className={`skill-badges ${tone}`}>
      {skills.map((skill) => <span className="skill-badge" key={skill}>{skill}</span>)}
    </div>
  )
}

function AnalysisDashboard({ result, onReset }) {
  const score = Number(result.match_score) || 0
  const categoryEntries = Object.entries(result.skills_by_category || {})
  const sectionEntries = Object.entries(result.sections || {})

  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <div className="dashboard-header">
        <div>
          <p className="section-kicker">Analysis complete</p>
          <h2 id="dashboard-title">A clearer view of your fit.</h2>
          <p className="dashboard-description">Based on overlap between detected resume skills and job-description skills.</p>
        </div>
        <div className="score-display" aria-label={`Technical skill match ${score}%`}>
          <div className="score-ring" style={{ '--score': `${score * 3.6}deg` }}>
            <div><strong>{score}%</strong><span>technical skill match</span></div>
          </div>
        </div>
      </div>

      <div className="dashboard-metrics">
        <div className="metric-card metric-primary"><span>Match score</span><strong>{score}%</strong><small>Technical overlap</small></div>
        <div className="metric-card"><span>Resume skills</span><strong>{result.skill_count}</strong><small>Detected in resume</small></div>
        <div className="metric-card"><span>Matched skills</span><strong>{result.matched_skill_count}</strong><small>Shared with role</small></div>
        <div className="metric-card"><span>Missing skills</span><strong>{result.missing_skill_count}</strong><small>Found in job description</small></div>
        <div className="metric-card"><span>Resume sections</span><strong>{result.section_count}</strong><small>Detected sections</small></div>
        <div className="metric-card"><span>Job skills</span><strong>{result.total_job_skills}</strong><small>Recognized requirements</small></div>
      </div>

      <article className="dashboard-panel summary-panel">
        <div className="panel-heading"><div><span className="panel-index">01</span><h3>Resume summary</h3></div></div>
        <p className="summary-text">{result.resume_summary || result.summary || result.extracted_text?.slice(0, 520) || 'No resume summary was extracted.'}</p>
      </article>

      <div className="dashboard-columns">
        <article className="dashboard-panel matched-panel">
          <div className="panel-heading"><div><span className="panel-index">01</span><h3>Matched skills</h3></div><span className="panel-count">{result.matched_skill_count}</span></div>
          <p className="panel-description">Skills found in both your resume and the role.</p>
          <SkillList skills={result.matched_skills || []} emptyMessage="No matching technical skills detected." tone="matched" />
        </article>
        <article className="dashboard-panel missing-panel">
          <div className="panel-heading"><div><span className="panel-index">02</span><h3>Missing skills</h3></div><span className="panel-count">{result.missing_skill_count}</span></div>
          <p className="panel-description">These technical skills were detected in the job description but not in the resume.</p>
          <SkillList skills={result.missing_skills || []} emptyMessage="All detected job-description skills are present in the resume." tone="missing" />
        </article>
      </div>

      <div className="dashboard-lower-grid">
        <article className="dashboard-panel category-panel">
          <div className="panel-heading"><div><span className="panel-index">03</span><h3>Resume skills</h3></div></div>
          <p className="panel-description">Your detected skills, grouped by category.</p>
          {categoryEntries.length ? (
            <div className="category-list">
              {categoryEntries.map(([category, skills]) => (
                <div className="category-row" key={category}>
                  <h4>{formatCategoryName(category)}</h4>
                  <SkillList skills={skills} emptyMessage="" tone="neutral" />
                </div>
              ))}
            </div>
          ) : <p className="dashboard-empty">No resume skills detected.</p>}
        </article>

        <div className="dashboard-side-column">
          <article className="dashboard-panel recommendation-panel">
            <div className="panel-heading"><div><span className="panel-index">04</span><h3>Technical focus</h3></div></div>
            {result.recommendations?.length ? (
              <ul className="recommendation-list">
                {result.recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}
              </ul>
            ) : <p className="dashboard-empty">No additional technical focus areas identified.</p>}
          </article>
          <article className="dashboard-panel job-skills-panel">
            <div className="panel-heading"><div><span className="panel-index">05</span><h3>Job description skills</h3></div></div>
            <SkillList skills={result.job_description_skills || []} emptyMessage="No job skills detected." tone="neutral" />
          </article>
          <article className="dashboard-panel sections-panel">
            <div className="panel-heading"><div><span className="panel-index">06</span><h3>Resume structure</h3></div><span className="panel-count">{result.section_count}</span></div>
            {sectionEntries.length ? (
              <div className="section-tags">{sectionEntries.map(([section]) => <span key={section}>{formatCategoryName(section)}</span>)}</div>
            ) : <p className="dashboard-empty">No resume sections detected.</p>}
          </article>
        </div>
      </div>

      <div className="dashboard-footer">
        <p>Analysis is based on the text and technical skills detected from this resume.</p>
        <button type="button" className="reset-button" onClick={onReset}>Analyze another resume <span aria-hidden="true">&#8594;</span></button>
      </div>
    </section>
  )
}

export default AnalysisDashboard
