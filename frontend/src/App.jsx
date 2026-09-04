import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Analyze from './pages/Analyze'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Recommendations from './pages/Recommendations'
import ResumeStructure from './pages/ResumeStructure'
import Skills from './pages/Skills'
import './App.css'

function App() {
  const [path, setPath] = useState(window.location.pathname || '/')
  const [analysisResult, setAnalysisResult] = useState(null)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (nextPath) => {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result)
    navigate('/dashboard')
  }

  const page = {
    '/': <Home onNavigate={navigate} />,
    '/analyze': <Analyze onComplete={handleAnalysisComplete} />,
    '/dashboard': <Dashboard result={analysisResult} onNavigate={navigate} />,
    '/skills': <Skills result={analysisResult} onNavigate={navigate} />,
    '/resume-structure': <ResumeStructure result={analysisResult} onNavigate={navigate} />,
    '/recommendations': <Recommendations result={analysisResult} onNavigate={navigate} />,
  }[path] || <Home onNavigate={navigate} />

  return <div className="app-shell"><Navbar path={path} onNavigate={navigate} /><main>{page}</main><footer><span>Resume Analyzer</span><span>Local workspace</span></footer></div>
}

export default App
