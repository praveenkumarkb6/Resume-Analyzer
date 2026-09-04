function Home({ onNavigate }) {
  return (
    <div className="home-page">
      <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Career clarity, one page at a time</p>
            <h1 id="hero-title">Make your resume<br /><em>work harder.</em></h1>
            <p className="hero-description">Analyze your resume and compare it with a job description.</p>
          </div>
          <div className="hero-note" aria-hidden="true">
            <span>01</span>
            <div className="note-line" />
            <span>RESUME REVIEW</span>
          </div>
        <button className="analyze-button hero-button" type="button" onClick={() => onNavigate('/analyze')}>Analyze resume <span aria-hidden="true">&#8594;</span></button>
      </section>
      <section className="intro-section" aria-labelledby="intro-title">
        <div><p className="section-kicker">A sharper starting point</p><h2 id="intro-title">Understand your fit before you apply.</h2></div>
        <p>Resume Analyzer brings your experience and the role you want into one focused workspace. Upload a PDF, add the role details, and get a clear view of your strengths and next steps.</p>
      </section>
      <section className="feature-section" aria-labelledby="feature-title">
        <div className="section-heading"><p className="section-kicker">What you get</p><h2 id="feature-title">Useful signals, without the noise.</h2></div>
        <div className="feature-grid"><article className="feature-card"><span>01</span><h3>Skill match</h3><p>See which technical skills connect your resume to the role.</p></article><article className="feature-card"><span>02</span><h3>Structure check</h3><p>Understand which resume sections were detected and ready to read.</p></article><article className="feature-card"><span>03</span><h3>Clear next steps</h3><p>Get practical recommendations based on the comparison.</p></article></div>
      </section>
      <section className="how-section" aria-labelledby="how-title">
        <span className="about-number">02</span>
        <div><p className="section-kicker">How it works</p><h2 id="how-title">Upload. Compare. Improve.</h2></div>
        <p>Your resume is processed locally, then matched against the job description so you can spend less time guessing and more time refining.</p>
      </section>
    </div>
  )
}

export default Home
