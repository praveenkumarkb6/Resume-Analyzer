import { AnalysisRequired, PageIntro, ResultPanel } from '../components/AnalysisPageParts'
import { formatName } from '../utils/analysis'

function ResumeStructure({ result, onNavigate }) {
  if (!result) return <AnalysisRequired onNavigate={onNavigate} />
  const sections = Object.entries(result.sections || {})
  return <section className="page-section"><PageIntro kicker="Resume structure" title="A readable structure makes experience easier to find." description="These are the sections detected in your uploaded resume." /><ResultPanel title="Detected sections" description={`${sections.length} section${sections.length === 1 ? '' : 's'} found.`}>{sections.length ? <div className="structure-list">{sections.map(([section, content]) => <div className="structure-item" key={section}><div><span className="panel-index">{formatName(section)}</span><h3>{formatName(section)}</h3></div><p>{typeof content === 'string' ? content : 'Section detected in your resume.'}</p></div>)}</div> : <p className="empty-copy">No resume sections detected.</p>}</ResultPanel></section>
}

export default ResumeStructure
