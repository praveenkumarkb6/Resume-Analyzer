function JobDescription({ value, onChange }) {
  return (
    <div className="field-group">
      <div className="field-heading">
        <label htmlFor="job-description">Job description</label>
        <span className="field-hint">Required</span>
      </div>
      <textarea
        id="job-description"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste the job description you are applying for..."
        rows="8"
        maxLength="10000"
        aria-describedby="job-description-count"
      />
      <div className="character-count" id="job-description-count">{value.length.toLocaleString()} / 10,000</div>
    </div>
  )
}

export default JobDescription
