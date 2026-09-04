function AnalyzeButton({ disabled, isLoading, onClick }) {
  return (
    <button className="analyze-button" type="button" disabled={disabled || isLoading} onClick={onClick}>
      {isLoading ? (
        <><span className="spinner" aria-hidden="true" /> Analyzing resume...</>
      ) : (
        <>Analyze resume <span aria-hidden="true">&#8594;</span></>
      )}
    </button>
  )
}

export default AnalyzeButton
