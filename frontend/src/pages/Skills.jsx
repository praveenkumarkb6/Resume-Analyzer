import { AnalysisRequired, PageIntro, ResultPanel, SkillChips } from '../components/AnalysisPageParts'
import { formatName } from '../utils/analysis'

function Skills({ result, onNavigate }) {
  if (!result) return <AnalysisRequired onNavigate={onNavigate} />
  const categories = Object.entries(result.skills_by_category || {})
  return <section className="page-section"><PageIntro kicker="Skills analysis" title="See the language of the role." description="Compare what your resume says with what the opportunity asks for." /><div className="result-grid two-up"><ResultPanel title="Matched skills" description="Skills found in both your resume and the job description."><SkillChips skills={result.matched_skills} tone="matched" /></ResultPanel><ResultPanel title="Missing skills" description="Recognized job skills not currently detected in your resume."><SkillChips skills={result.missing_skills} tone="missing" /></ResultPanel><ResultPanel title="Resume skills" description="All skills detected in your resume."><SkillChips skills={result.skills} /></ResultPanel><ResultPanel title="Job description skills" description="Recognized technical requirements from the role."><SkillChips skills={result.job_description_skills} tone="job" /></ResultPanel></div>{categories.length > 0 && <ResultPanel title="Skills by category" className="category-panel"><div className="category-list">{categories.map(([category, skills]) => <div className="category-row" key={category}><h3>{formatName(category)}</h3><SkillChips skills={skills} /></div>)}</div></ResultPanel>}</section>
}

export default Skills
