const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

export async function analyzeResume(resume, jobDescription) {
  const formData = new FormData()
  formData.append('resume', resume)
  formData.append('job_description', jobDescription)

  let response
  try {
    response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new Error('Unable to connect to the analysis server. Make sure the Flask backend is running.')
  }

  let responseBody
  try {
    responseBody = await response.json()
  } catch {
    throw new Error('The analysis server returned an invalid response.')
  }

  if (!response.ok || responseBody.status !== 'success') {
    throw new Error(responseBody.message || 'Analysis failed. Please try again.')
  }

  return responseBody
}
