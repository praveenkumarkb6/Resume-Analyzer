import { useRef, useState } from 'react'

const MAX_FILE_SIZE = 5 * 1024 * 1024

function ResumeUpload({ file, onFileChange }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')

  const validateFile = (selectedFile) => {
    if (!selectedFile) return
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setError('Please choose a PDF file.')
      onFileChange(null)
      return
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('Your PDF must be smaller than 5 MB.')
      onFileChange(null)
      return
    }
    setError('')
    onFileChange(selectedFile)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    validateFile(event.dataTransfer.files[0])
  }

  const handleInputChange = (event) => {
    validateFile(event.target.files[0])
    event.target.value = ''
  }

  const removeFile = () => {
    setError('')
    onFileChange(null)
  }

  return (
    <div className="field-group">
      <div className="field-heading">
        <label htmlFor="resume-file">Your resume</label>
        <span className="field-hint">PDF only</span>
      </div>
      <div
        className={`upload-zone ${isDragging ? 'is-dragging' : ''} ${error ? 'has-error' : ''}`}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true) }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false) }}
        onDrop={handleDrop}
      >
        <input ref={inputRef} id="resume-file" type="file" accept="application/pdf,.pdf" onChange={handleInputChange} />
        {file ? (
          <div className="file-selected">
            <span className="file-icon" aria-hidden="true">PDF</span>
            <div className="file-details">
              <strong>{file.name}</strong>
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <button className="remove-file" type="button" onClick={removeFile} aria-label={`Remove ${file.name}`}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ) : (
          <div className="upload-prompt">
            <span className="upload-icon" aria-hidden="true">&#8593;</span>
            <div>
              <p><button className="browse-button" type="button" onClick={() => inputRef.current?.click()}>Browse your files</button> or drag and drop</p>
              <span>Maximum file size 5 MB</span>
            </div>
          </div>
        )}
      </div>
      {error && <p className="error-message" role="alert">{error}</p>}
    </div>
  )
}

export default ResumeUpload
