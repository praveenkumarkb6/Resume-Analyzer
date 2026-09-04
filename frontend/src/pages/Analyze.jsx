import { useState } from 'react'
import AnalyzeButton from '../components/AnalyzeButton'
import JobDescription from '../components/JobDescription'
import ResumeUpload from '../components/ResumeUpload'
import { analyzeResume } from '../services/api'
import { PageIntro } from '../components/AnalysisPageParts'

function Analyze({ onComplete }) {
  const [resume, setResume] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notice, setNotice] = useState('')

  const handleAnalyze = async () => {
    if (!resume) return setNotice('Please upload a PDF resume.')
    if (!jobDescription.trim()) return setNotice('Please enter a job description.')
    setNotice('')
    setIsLoading(true)
    try {
      onComplete(await analyzeResume(resume, jobDescription.trim()))
    } catch (error) {
      setNotice(error.message || 'Analysis failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return <section className="page-section analyze-page"><PageIntro kicker="Analysis workspace" title="Bring your next opportunity into focus." description="Upload your resume and compare it with the role you want." /><div className="analysis-form"><ResumeUpload file={resume} onFileChange={(file) => { setResume(file); setNotice('') }} /><JobDescription value={jobDescription} onChange={(value) => { setJobDescription(value); setNotice('') }} /><div className="form-footer"><AnalyzeButton disabled={!resume || !jobDescription.trim()} isLoading={isLoading} onClick={handleAnalyze} />{notice && <p className="status-message" role="alert">{notice}</p>}</div></div></section>
}

export default Analyze
