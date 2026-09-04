import { AnalysisRequired, PageIntro, ResultPanel, SkillChips } from '../components/AnalysisPageParts'

function Recommendations({ result, onNavigate }) {
  if (!result) return <AnalysisRequired onNavigate={onNavigate} />
  return <section className="page-section"><PageIntro kicker="Next steps" title="Turn the analysis into momentum." description="A few practical ways to strengthen your application for this role." /><div className="result-grid two-up"><ResultPanel title="Resume recommendations"><ul className="recommendation-list">{result.recommendations?.length ? result.recommendations.map((item) => <li key={item}>{item}</li>) : <li>No additional recommendations identified.</li>}</ul></ResultPanel><ResultPanel title="Missing skills" description="Consider adding evidence of these skills where accurate."><SkillChips skills={result.missing_skills} tone="missing" /></ResultPanel></div></section>
}

export default Recommendations
