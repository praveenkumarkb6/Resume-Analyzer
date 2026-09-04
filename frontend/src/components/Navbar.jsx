const links = [
  ['/', 'Home'],
  ['/analyze', 'Analyze'],
  ['/dashboard', 'Dashboard'],
  ['/skills', 'Skills'],
  ['/resume-structure', 'Resume Structure'],
  ['/recommendations', 'Recommendations'],
]

function Navbar({ path, onNavigate }) {
  const handleNavigation = (event, nextPath) => {
    event.preventDefault()
    onNavigate(nextPath)
  }

  return (
    <header className="navbar">
      <a className="brand" href="/" onClick={(event) => handleNavigation(event, '/')} aria-label="Resume Analyzer home">
        <span className="brand-mark" aria-hidden="true">R</span>
        <span>Resume Analyzer</span>
      </a>
      <nav aria-label="Main navigation">
        {links.map(([href, label]) => <a className={`nav-link ${path === href ? 'active' : ''}`} href={href} onClick={(event) => handleNavigation(event, href)} key={href}>{label}</a>)}
      </nav>
    </header>
  )
}

export default Navbar
