import AnalysisDashboard from '../components/AnalysisDashboard'
import { AnalysisRequired } from '../components/AnalysisPageParts'

function Dashboard({ result, onNavigate }) {
  if (!result) return <AnalysisRequired onNavigate={onNavigate} />
  return <section className="page-section dashboard-page"><AnalysisDashboard result={result} onReset={() => onNavigate('/analyze')} /></section>
}

export default Dashboard
