
    
  

                    <p className="pub-authors">{publication.authors}</p>
                    <p className="pub-abstract">{publication.abstract}</p>

                    <div className="pub-actions">
                      <a
                        href={`https://arxiv.org/abs/${publication.arxiv}`}
                        target="_blank"
                        rel="noreferrer"
                        className="reader-action-btn"
                      >
                        arXiv:{publication.arxiv}
                      </a>

                      <a
                        href={`https://doi.org/${publication.doi}`}
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
                {researcher.appointments.map((appointment, index) => (
                  <div key={index} className="appointment-row">
                    <span className="app-period">{appointment.period}</span>

                    <div className="app-details">
                      <span className="app-role">{appointment.role}</span>
                      <span className="app-inst">
                        {appointment.institution}
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
                {window.AstroData.teaching.map((teachingItem, index) => (
                  <div key={index} className="teaching-item">
                    <div className="teach-hdr">
                      <span className="teach-id">
                        {teachingItem.courseId}
                      </span>
                      <span className="teach-term">{teachingItem.term}</span>
                    </div>

                    <h4>{teachingItem.title}</h4>
                    <p>{teachingItem.desc}</p>
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
                      "_blank",
                      "noopener,noreferrer"
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
    </div>
  );
}

// ============================================================================
// BOOTSTRAP REACT INTO DOM
// ============================================================================

const rootElement = document.getElementById("react-root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<AstroApp />);
}

