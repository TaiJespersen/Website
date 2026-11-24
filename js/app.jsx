
// ============================================================================
// REACT APPLICATION: ASTRO-OS 3D RESEARCH ENVIRONMENT & ACADEMIC PORTFOLIO
// Framework: React 18 (Loaded via CDN / Static GitHub Pages Ready)
// ============================================================================

const { useState, useEffect } = React;

function AstroApp() {

  // =========================================
  // 1. STATE DECLARATIONS
  // =========================================

  const [viewMode, setViewMode] = useState('landing');
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    coords: { x: 0, y: 0, z: 40 }
  });

  // =========================================
  // 2. THREE.JS TELEMETRY DISPATCHER
  // =========================================

  useEffect(() => {

    // Expose telemetry dispatcher to Three.js game loop
    window.AstroAppDispatch = (action) => {

      if (action.type === 'UPDATE_TELEMETRY') {
        setTelemetry(action.payload);
      }

    };

    return () => {
      delete window.AstroAppDispatch;
    };

  }, []);

  // =========================================
  // 3. MAIN RENDER / UI
  // =========================================

  return (

    <div className={`astro-app ${viewMode === 'reader' ? 'reader-mode-active' : ''}`}>

      {/* =========================================
          VIEW 1: LANDING SCREEN
      ========================================= */}

      {viewMode === 'landing' && (

        <div className="landing-screen">

          <div className="landing-card">

            <h1 className="landing-name">
              Tai Jespersen
            </h1>

            <p className="landing-role">
              PhD Student · Gravitational Wave & Pulsar Astronomy
            </p>

            <p className="landing-inst">
              Center for Gravitation, Cosmology, and Astrophysics · UW-Milwaukee
            </p>

            <p className="landing-bio-snippet">
            </p>

            <div className="landing-actions">

              <button
                className="landing-btn primary"
                onClick={() => setViewMode('reader')}
              >
                <span className="btn-icon">✦</span>
                <span>About Me & Portfolio</span>
              </button>

              <button
                className="landing-btn secondary"
                onClick={() => setViewMode('3d')}
              >
                <span>Research Projects</span>
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =========================================
          VIEW 2: ABOUT ME / ACADEMIC DOSSIER
      ========================================= */}

      {viewMode === 'reader' && (

        <div className="reader-container">

          <header className="reader-header">

            <div className="reader-brand">

              <div className="reader-pretitle">
                ACADEMIC DOSSIER & CURRICULUM VITAE
              </div>

              <h1>
                {window.AstroData.researcher.name}
              </h1>

              <p className="reader-tagline">
                {window.AstroData.researcher.title}
              </p>

              <p className="reader-inst">
                {window.AstroData.researcher.institution}
              </p>

              <div className="reader-contacts">

                <a
                  href={`mailto:${window.AstroData.researcher.email}`}
                  className="reader-contact-pill"
                >
                  ✉️ {window.AstroData.researcher.email}
                </a>

                <a
                  href="https://orcid.org/0009-0007-4226-0037"
                  target="_blank"
                  rel="noreferrer"
                  className="reader-contact-pill"
                >
                  🆔 ORCID: 0009-0007-4226-0037
                </a>

              </div>

            </div>

            <button
              className="reader-exit-btn"
              onClick={() => setViewMode('3d')}
            >
              ✦ Research Projects
            </button>

          </header>

          <main className="reader-body">

            {/* BIO */}

            <section className="reader-section">

              <div className="section-header-row">
                <span className="section-spark">✦</span>
                <h2>OVERVIEW</h2>
              </div>

              <div className="reader-bio-card">

                {window.AstroData.researcher.bio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}

              </div>

            </section>

            {/* PUBLICATIONS */}

            <section className="reader-section">

              <div className="section-header-row">
                <span className="section-spark">✦</span>
                <h2>PUBLICATIONS & PREPRINTS</h2>
              </div>

              <div className="reader-pubs-list">

                {window.AstroData.publications.map(pub => (

                  <div key={pub.id} className="pub-card">

                    <div className="pub-badge-row">

                      <span className="pub-badge">
                        {pub.badge}
                      </span>

                      <span className="pub-year">
                        {pub.year}
                      </span>

                      <span className="pub-journal">
                        {pub.journal}
                      </span>

                    </div>

                    <h3 className="pub-title">
                      {pub.title}
                    </h3>

                    <p className="pub-authors">
                      {pub.authors}
                    </p>

                    <p className="pub-abstract">
                      {pub.abstract}
                    </p>

                    <div className="pub-actions">

                      <a
                        href={`https://arxiv.org/abs/${pub.arxiv}`}
                        target="_blank"
                        rel="noreferrer"
                        className="reader-action-btn"
                      >
                        arXiv:{pub.arxiv}
                      </a>

                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="reader-action-btn"
                      >
                        DOI Link
                      </a>

                    </div>

                  </div>

                ))}

              </div>

            </section>

            {/* EDUCATION */}

            <section className="reader-section">

              <div className="section-header-row">
                <span className="section-spark">✦</span>
                <h2>EDUCATION</h2>
              </div>

              <div className="appointments-card">

                {window.AstroData.researcher.appointments.map((app, i) => (

                  <div key={i} className="appointment-row">

                    <span className="app-period">
                      {app.period}
                    </span>

                    <div className="app-details">

                      <span className="app-role">
                        {app.role}
                      </span>

                      <span className="app-inst">
                        {app.institution}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </section>

            {/* TEACHING */}

            <section className="reader-section">

              <div className="section-header-row">
                <span className="section-spark">✦</span>
                <h2>TEACHING</h2>
              </div>

              <div className="teaching-list">

                {window.AstroData.teaching.map((t, i) => (

                  <div key={i} className="teaching-item">

                    <div className="teach-hdr">

                      <span className="teach-id">
                        {t.courseId}
                      </span>

                      <span className="teach-term">
                        {t.term}
                      </span>

                    </div>

                    <h4>{t.title}</h4>

                    <p>{t.desc}</p>

                  </div>

                ))}

              </div>

            </section>

            {/* CV DOWNLOAD */}

            <section className="reader-section cv-section">

              <div className="cv-card">

                <div className="cv-info">

                  <h3>Curriculum Vitae</h3>

                  <p>
                    Download or view the complete updated CV with comprehensive
                    research history, publications, and presentations.
                  </p>

                </div>

                <button
                  className="cv-button"
                  onClick={() =>
                    window.open(
                      "/Website/CV___Tai_Jespersen__Updated_Sep__2026_.pdf",
                      "_blank"
                    )
                  }
                >
                  📄 View Complete CV (PDF)
                </button>

              </div>

            </section>

          </main>

        </div>

      )}

      {/* =========================================
          VIEW 3: RESEARCH COSMOS (3D MODE)
      ========================================= */}

      {viewMode === '3d' && (

        <div id="hud-overlay">

          {/* TOP BAR */}

          <header className="hud-top-bar">

            <div className="hud-brand">
            </div>

            <div className="hud-controls-top">

              <button
                className="hud-btn reader-toggle"
                onClick={() => setViewMode('reader')}
                title="Switch to About Me"
              >
                About Me
              </button>

            </div>

          </header>

        </div>

      )}

    </div>

  );

}


// ============================================================================
// BOOTSTRAP REACT INTO DOM
// ============================================================================

const rootElement = document.getElementById('react-root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<AstroApp />);
}
