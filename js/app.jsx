// ============================================================================
// REACT APPLICATION: ASTRO-OS VIDEOGAME HUD, RADAR & TERMINAL MODALS
// Framework: React 18 (Loaded via CDN / Static GitHub Pages Ready)
// ============================================================================

const { useState, useEffect, useRef } = React;

function AstroApp() {
  // =========================================
  // 1. STATE DECLARATIONS
  // =========================================
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(window.AstroData.destinations[0]);
  const [telemetry, setTelemetry] = useState({ speed: 0, coords: { x: 0, y: 0, z: 40 } });
  const [nearest, setNearest] = useState(null);
  const [canDock, setCanDock] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [viewMode, setViewMode] = useState('landing'); 
  const [pubCategory, setPubCategory] = useState('all');
  const [copiedBibId, setCopiedBibId] = useState(null);
  const [simTab, setSimTab] = useState('hellings-downs'); 
  const [contactState, setContactState] = useState({ name: '', email: '', message: '', status: 'idle' });
  const [audioPulsarActive, setAudioPulsarActive] = useState(false);
  const [markers, setMarkers] = useState([]);
  const initialCoordsRef = useRef({ x: 0, y: 0, z: 40 });

  // =========================================
  // 2. EFFECTS & DISPATCHERS
  // =========================================
  useEffect(() => {
    // Expose state dispatcher to Three.js game loop
    window.AstroAppDispatch = (action) => {
      if (action.type === 'UPDATE_TELEMETRY') {
        setTelemetry(action.payload);
        if (action.payload.markers) {
          setMarkers(action.payload.markers);
        }
        
        // Find nearest destination
        let closest = null;
        let minDist = Infinity;
        window.AstroData.destinations.forEach(d => {
          if (typeof d.currentDistance === 'number' && d.currentDistance < minDist) {
            minDist = d.currentDistance;
            closest = d;
          }
        });

        setNearest(closest);
        setCanDock(minDist < 42);
      } else if (action.type === 'TARGET_DESTINATION') {
        setSelectedTarget(action.payload);
        if (window.astroAudio) window.astroAudio.playLockOn();
      }
    };

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'e' || e.key === 'E') {
        if (canDock && nearest) {
          openModal(nearest.modalId);
        }
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const dest = window.AstroData.destinations.find(d => d.key === e.key);
        if (dest) {
          warpTo(dest);
        }
      } else if (e.key === 'm' || e.key === 'M') {
        toggleSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canDock, nearest]);

  // =========================================
  // 3. HELPER FUNCTIONS
  // =========================================
  const toggleSound = () => {
    const muted = window.astroAudio.toggleMute();
    setIsMuted(muted);
  };

  const warpTo = (dest) => {
      setSelectedTarget(dest);
      if (window.AstroShip) {
        // Initiate warp and pass the callback
        window.AstroShip.warpTo(dest.coords, () => {
          setCanDock(true);
          // Automatically open the terminal menu for this destination!
          openModal(dest.modalId); 
        });
      }
    };

  const openModal = (modalId) => {
    setActiveModal(modalId);
    if (window.astroAudio) window.astroAudio.playDock();

    if (modalId === 'modal-magnetar') {
      setTimeout(() => {
        window.AstroSimulations.hellingsDowns.init('hd-canvas', 'hd-slider', 'hd-readout');
        window.AstroSimulations.dedispersion.init('dm-canvas', 'dm-slider', 'dm-readout');
      }, 100);
    }
  };

const closeModal = () => {
  setActiveModal(null);
  if (window.astroAudio) window.astroAudio.playBlip(440, 0.04);

  // Return ship back to original spawn coordinates
  if (window.AstroShip && initialCoordsRef.current) {
    window.AstroShip.warpTo(initialCoordsRef.current, () => {
      setCanDock(false);
    });
  }
};

  const copyBibtex = (pub) => {
    navigator.clipboard.writeText(pub.bibtex);
    setCopiedBibId(pub.id);
    if (window.astroAudio) window.astroAudio.playBlip(1040, 0.05);
    setTimeout(() => setCopiedBibId(null), 2500);
  };

  const playPulsarSound = (freqHz) => {
    setAudioPulsarActive(true);
    window.astroAudio.playPulsarTone(freqHz, 2.8);
    setTimeout(() => setAudioPulsarActive(false), 2800);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactState(prev => ({ ...prev, status: 'transmitting' }));
    if (window.astroAudio) window.astroAudio.playLockOn();

    setTimeout(() => {
      setContactState(prev => ({ ...prev, status: 'sent', name: '', email: '', message: '' }));
      if (window.astroAudio) window.astroAudio.playDock();
      setTimeout(() => setContactState(prev => ({ ...prev, status: 'idle' })), 4000);
    }, 1200);
  };

  const filteredPublications = pubCategory === 'all'
    ? window.AstroData.publications
    : window.AstroData.publications.filter(p => p.category === pubCategory);

  // =========================================
  // 4. MAIN RENDER / UI
  // =========================================
  return (
    <div className={`astro-app ${viewMode === 'reader' ? 'reader-mode-active' : ''}`}>
      
      {/* --- VIEW 1: LANDING SCREEN --- */}
      {viewMode === 'landing' && (
        <div className="landing-screen">
          <div className="landing-content">
            <h1>Hello!</h1>
            <p>Welcome to my website:</p>
            <div className="button-group">
              <button className="start-btn" onClick={() => setViewMode('reader')}>
                About Me
              </button>
              <button 
                className="start-btn" 
                onClick={() => {
                  setViewMode('3d');
                  if (window.AstroAudio) window.AstroAudio.initContext();
                }}
              >
                Research
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- About Me --- */}
      {viewMode === 'reader' && (
        <div className="reader-container">
          <header className="reader-header">
            <div className="reader-brand">
              <h1>{window.AstroData.researcher.name}</h1>
              <p className="reader-tagline">{window.AstroData.researcher.title}</p>
              <p className="reader-inst">{window.AstroData.researcher.institution}</p>
            </div>
            <button className="hud-btn neon-btn" onClick={() => setViewMode('3d')}>
              Research
            </button>
          </header>

          <main className="reader-body">
            {/* Bio & Stats */}
            <section className="reader-section">
              <h2>RESEARCH OVERVIEW</h2>
              {window.AstroData.researcher.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>

            {/* Publications */}
            <section className="reader-section">
              <h2>KEY PUBLICATIONS & PREPRINTS</h2>
              <div className="reader-pubs-list">
                {window.AstroData.publications.map(pub => (
                  <div key={pub.id} className="pub-card">
                    <div className="pub-badge-row">
                      <span className="pub-badge">{pub.badge}</span>
                      <span className="pub-year">{pub.year}</span>
                      <span className="pub-journal neon-cyan">{pub.journal}</span>
                    </div>
                    <h3 className="pub-title">{pub.title}</h3>
                    <p className="pub-authors">{pub.authors}</p>
                    <p className="pub-abstract">{pub.abstract}</p>
                    <div className="pub-actions">
                      <a href={`https://arxiv.org/abs/${pub.arxiv}`} target="_blank" rel="noreferrer" className="hud-btn mini-btn">
                        arXiv:{pub.arxiv}
                      </a>
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="hud-btn mini-btn">
                        DOI Link
                      </a>
                      <button className="hud-btn mini-btn" onClick={() => copyBibtex(pub)}>
                        {copiedBibId === pub.id ? '✓ COPIED BIBTEX' : 'COPY BIBTEX'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Teaching */}
            <section className="reader-section">
              <h2>TEACHING & MENTORSHIP</h2>
              <div className="teaching-list">
                {window.AstroData.teaching.map((t, i) => (
                  <div key={i} className="teaching-item">
                    <div className="teach-hdr">
                      <span className="teach-id neon-amber">{t.courseId}</span>
                      <span className="teach-term">{t.term}</span>
                    </div>
                    <h4>{t.title}</h4>
                    <p>{t.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      )}

      {/* --- Research Interests --- */}
      {viewMode === '3d' && (
        <div id="hud-overlay">
          {/* Top Bar */}
          <header className="hud-top-bar">

            <div className="hud-controls-top">
              <button
                className={`hud-btn sound-toggle ${isMuted ? 'muted' : 'active'}`}
                onClick={toggleSound}
                title="Toggle Web Audio SFX & Ambient Music (Key: M)"
              >
                {isMuted ? '🔇 Sound Off' : '🔊 Sound On'}
              </button>
              <button
                className="hud-btn reader-toggle"
                onClick={() => setViewMode('reader')}
                title="Switch to 2D Document Reader"
              >
                About Me
              </button>
            </div>
          </header>

          {/* Floating Waypoints */}
          <div className="floating-waypoints-layer">
            {markers.map(m => {
              if (!m.inFront || m.x < -80 || m.x > window.innerWidth + 80 || m.y < -80 || m.y > window.innerHeight + 80) return null;
              const isSelected = selectedTarget && selectedTarget.id === m.id;
              return (
                <div
                  key={m.id}
                  className={`waypoint-badge ${isSelected ? 'selected' : ''}`}
                  style={{
                    left: `${m.x}px`,
                    top: `${m.y}px`,
                    borderColor: m.color
                  }}
                  onClick={() => {
                    const dest = window.AstroData.destinations.find(d => d.id === m.id);
                    if (dest) warpTo(dest);
                  }}
                  title={`Click to warp to ${m.name}`}
                >
                  <span className="waypoint-pin" style={{ backgroundColor: m.color, boxShadow: `0 0 8px ${m.color}` }}></span>
                  <span className="waypoint-key">[{m.key}]</span>
                  <span className="waypoint-title">{m.name}</span>
                  <span className="waypoint-dist">{m.distance} AU</span>
                </div>
              );
            })}
          </div>

          {/* Docking Proximity Banner */}
          {canDock && nearest && (
            <div className="docking-prompt-banner" onClick={() => openModal(nearest.modalId)}>
              <div className="dock-flash"></div>
              <div className="dock-text">
                <span className="dock-key">[PRESS E OR CLICK TO ACCESS]</span>
                <span className="dock-dest">{nearest.name.toUpperCase()} // {nearest.subtitle}</span>
              </div>
            </div>
          )}

          </div>
      )}

      
      {/* --- Research Projects --- */}
      {activeModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-scanline-fx"></div>

            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title-box">
                <h2>{selectedTarget?.name} // ARCHIVAL CONSOLE</h2>
              </div>
              <button className="modal-close-btn" onClick={closeModal}>✕ [ESC]</button>
            </div>

            <div className="modal-body">
              {/* MODAL 1: PSR J1713+0747 */}
              {activeModal === 'modal-j1713' && (
                <div className="terminal-panel">
                  <div className="terminal-alert-box">
                    <span className="alert-badge">STOCHASTIC GWB DETECTED</span>
                    <p>Precision timing of PSR J1713+0747 over 28 years with Arecibo and the Green Bank Telescope provides the backbone of the NANOGrav 15-year evidence for low-frequency gravitational waves.</p>
                  </div>

                  <div className="terminal-stats-grid">
                    <div className="t-stat">
                      <div className="t-stat-val neon-cyan">4.57 ms</div>
                      <div className="t-stat-lbl">Rotational Spin Period</div>
                    </div>
                    <div className="t-stat">
                      <div className="t-stat-val neon-amber">218.8 Hz</div>
                      <div className="t-stat-lbl">Pulse Frequency</div>
                    </div>
                    <div className="t-stat">
                      <div className="t-stat-val neon-pink">&lt; 85 ns</div>
                      <div className="t-stat-lbl">Timing Residual RMS</div>
                    </div>
                    <div className="t-stat">
                      <div className="t-stat-val neon-emerald">1.34 M☉</div>
                      <div className="t-stat-lbl">Inferred Neutron Star Mass</div>
                    </div>
                  </div>

                  <div className="sonification-card">
                    <div className="son-info">
                      <h4>ACOUSTIC PULSAR SONIFICATION</h4>
                      <p>Millisecond pulsars spin hundreds of times per second. Listen to the actual acoustic tone of PSR J1713+0747 generated via procedural synthesis:</p>
                    </div>
                    <button
                      className={`hud-btn son-btn ${audioPulsarActive ? 'pulsing' : ''}`}
                      onClick={() => playPulsarSound(218.8)}
                    >
                      {audioPulsarActive ? '🔊 PULSING AT 218.8 HZ...' : '▶ AUDIFY PULSAR (218.8 HZ)'}
                    </button>
                  </div>

                  <div className="research-summary-text">
                    <h3>NANOGrav 15-Year Research Breakthrough</h3>
                    <p>In June 2023, the NANOGrav Collaboration published compelling evidence for a cosmic background of gravitational waves at nanohertz frequencies (wavelengths spanning light-years).</p>
                    <p>Unlike ground-based detectors like LIGO, which observe stellar-mass black holes merging in fractions of a second, Pulsar Timing Arrays detect the cosmic roar of supermassive black hole binaries—pairs with millions to billions of solar masses slowly orbiting in the centers of merging galaxies.</p>
                  </div>
                </div>
              )}
              {/* ----------------------------------------------------------- */}
              {/* MODAL 2: PSR B1913+16 (Publications, Papers & BibTeX) */}
              {/* ----------------------------------------------------------- */}
              {activeModal === 'modal-b1913' && (
                <div className="terminal-panel">
                  <div className="filter-pills-row">
                    <button
                      className={`filter-pill ${pubCategory === 'all' ? 'active' : ''}`}
                      onClick={() => setPubCategory('all')}
                    >ALL PAPERS ({window.AstroData.publications.length})</button>
                    <button
                      className={`filter-pill ${pubCategory === 'nanograv' ? 'active' : ''}`}
                      onClick={() => setPubCategory('nanograv')}
                    >NANOGRAV / PTA</button>
                    <button
                      className={`filter-pill ${pubCategory === 'compact' ? 'active' : ''}`}
                      onClick={() => setPubCategory('compact')}
                    >NEUTRON STARS & GLITCHES</button>
                    <button
                      className={`filter-pill ${pubCategory === 'software' ? 'active' : ''}`}
                      onClick={() => setPubCategory('software')}
                    >GPU & ALGORITHMS</button>
                  </div>

                  <div className="publications-stream">
                    {filteredPublications.map(pub => (
                      <div key={pub.id} className="pub-card-terminal">
                        <div className="pub-meta-line">
                          <span className="pub-tag">{pub.badge}</span>
                          <span className="pub-year-badge">{pub.year}</span>
                          <span className="pub-journal-name neon-cyan">{pub.journal}</span>
                        </div>
                        <h3 className="pub-heading">{pub.title}</h3>
                        <p className="pub-author-line">{pub.authors}</p>
                        <p className="pub-abstract-text">{pub.abstract}</p>

                        <div className="pub-button-bar">
                          <a href={`https://arxiv.org/abs/${pub.arxiv}`} target="_blank" rel="noreferrer" className="hud-btn mini-btn">
                            arXiv:{pub.arxiv}
                          </a>
                          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="hud-btn mini-btn">
                            DOI: {pub.doi}
                          </a>
                          <button className="hud-btn mini-btn" onClick={() => copyBibtex(pub)}>
                            {copiedBibId === pub.id ? '✓ COPIED TO CLIPBOARD' : '📋 COPY BIBTEX'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* MODAL 3: MAGNETAR SGR 1806-20 (Interactive Physics Toys) */}
              {/* ----------------------------------------------------------- */}
              {activeModal === 'modal-magnetar' && (
                <div className="terminal-panel">
                  <div className="sim-tab-header">
                    <button
                      className={`sim-tab-btn ${simTab === 'hellings-downs' ? 'active' : ''}`}
                      onClick={() => {
                        setSimTab('hellings-downs');
                        setTimeout(() => window.AstroSimulations.hellingsDowns.init('hd-canvas', 'hd-slider', 'hd-readout'), 50);
                      }}
                    >
                      🌌 HELLINGS-DOWNS CORRELATION LAB
                    </button>
                    <button
                      className={`sim-tab-btn ${simTab === 'dedispersion' ? 'active' : ''}`}
                      onClick={() => {
                        setSimTab('dedispersion');
                        setTimeout(() => window.AstroSimulations.dedispersion.init('dm-canvas', 'dm-slider', 'dm-readout'), 50);
                      }}
                    >
                      📡 INTERSTELLAR DM DEDISPERSER LAB
                    </button>
                  </div>

                  {simTab === 'hellings-downs' ? (
                    <div className="simulation-wrapper">
                      <div className="sim-instruction-text">
                        The Hellings-Downs curve proves that correlation between pulsar pairs matches Einstein's general relativity quadrupole signature:
                      </div>

                      <div className="sim-canvas-box">
                        <canvas id="hd-canvas" style={{ width: '100%', height: '280px' }}></canvas>
                      </div>

                      <div className="sim-controls-panel">
                        <div className="slider-row">
                          <label>PULSAR PAIR ANGLE (θ):</label>
                          <input type="range" id="hd-slider" min="0" max="180" defaultValue="45" step="1" />
                        </div>
                        <div className="curve-type-buttons">
                          <button className="hud-btn mini-btn" onClick={() => window.AstroSimulations.hellingsDowns.setCurveType('quadrupole')}>
                            QUADRUPOLE (GRAV WAVES)
                          </button>
                          <button className="hud-btn mini-btn" onClick={() => window.AstroSimulations.hellingsDowns.setCurveType('monopole')}>
                            MONOPOLE (CLOCK ERROR)
                          </button>
                          <button className="hud-btn mini-btn" onClick={() => window.AstroSimulations.hellingsDowns.setCurveType('dipole')}>
                            DIPOLE (SOLAR EPHEMERIS)
                          </button>
                        </div>
                        <div id="hd-readout" className="sim-readout-grid"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="simulation-wrapper">
                      <div className="sim-instruction-text">
                        Tune the Dispersion Measure (DM) slider to dedisperse smeared radio pulses across 1.2 to 1.8 GHz:
                      </div>

                      <div className="sim-canvas-box">
                        <canvas id="dm-canvas" style={{ width: '100%', height: '280px' }}></canvas>
                      </div>

                      <div className="sim-controls-panel">
                        <div className="slider-row">
                          <label>DISPERSION MEASURE (DM):</label>
                          <input type="range" id="dm-slider" min="0" max="80" defaultValue="15" step="0.5" />
                          <button className="hud-btn mini-btn neon-btn" onClick={() => window.AstroSimulations.dedispersion.autoDedisperse()}>
                            ⚡ AUTO-DEDISPERSE
                          </button>
                        </div>
                        <div id="dm-readout" className="sim-readout-grid"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* MODAL 4: GREEN BANK & ARECIBO (Bio, Grants & CV) */}
              {/* ----------------------------------------------------------- */}
              {activeModal === 'modal-observatory' && (
                <div className="terminal-panel">
                  <div className="dossier-bio-section">
                    <h3>CURRICULUM VITAE & SCIENTIFIC APPOINTMENTS</h3>
                    {window.AstroData.researcher.bio.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  <div className="appointments-timeline">
                    <h4>ACADEMIC POSITIONS & EDUCATION</h4>
                    {window.AstroData.researcher.appointments.map((app, i) => (
                      <div key={i} className="timeline-item">
                        <span className="time-period neon-amber">{app.period}</span>
                        <span className="time-role">{app.role}</span>
                        <span className="time-inst">{app.institution}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grants-section">
                    <h4>PRIMARY TELESCOPE ALLOCATIONS</h4>
                    <div className="grants-grid">
                      {window.AstroData.researcher.telescopeGrants.map((grant, i) => (
                        <div key={i} className="grant-card">
                          <div className="grant-facility neon-cyan">{grant.facility}</div>
                          <div className="grant-hrs neon-pink">{grant.hours} ({grant.cycle})</div>
                          <div className="grant-project">{grant.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="cv-download-box">
                    <button
                      className="hud-btn neon-btn"
                      onClick={() =>
                        window.open(
                          "/Website/CV___Tai_Jespersen__Updated_Sep__2026_.pdf",
                          "_blank"
                        )
                      }
                    >
                      📄 VIEW DOSSIER CV
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* MODAL 5: EARTH RELAY (Contact & Subspace Transmission) */}
              {/* ----------------------------------------------------------- */}
              {activeModal === 'modal-relay' && (
                <div className="terminal-panel">
                  <div className="subspace-form-wrapper">
                    <h3>SUB-SPACE TRANSMISSION CONSOLE</h3>
                    <p>Transmit an inquiry to Tai:</p>

                    <form onSubmit={handleContactSubmit} className="subspace-form">
                      <div className="form-group">
                        <label>CALLSIGN / SENDER NAME:</label>
                        <input
                          type="text"
                          required
                          value={contactState.name}
                          onChange={e => setContactState({ ...contactState, name: e.target.value })}
                          placeholder="e.g. Prof. Thorne / Collaborator"
                        />
                      </div>

                      <div className="form-group">
                        <label>TRANSMISSION RETURN FREQ (EMAIL):</label>
                        <input
                          type="email"
                          required
                          value={contactState.email}
                          onChange={e => setContactState({ ...contactState, email: e.target.value })}
                          placeholder="caller@observatory.edu"
                        />
                      </div>

                      <div className="form-group">
                        <label>TRANSMISSION PAYLOAD (MESSAGE):</label>
                        <textarea
                          rows="4"
                          required
                          value={contactState.message}
                          onChange={e => setContactState({ ...contactState, message: e.target.value })}
                          placeholder="Enter transmission data..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="hud-btn neon-btn transmit-btn"
                        disabled={contactState.status === 'transmitting'}
                      >
                        {contactState.status === 'transmitting'
                          ? '🛰️ BEAMING TO EARTH UPLINK...'
                          : contactState.status === 'sent'
                            ? '✓ TRANSMISSION RECEIVED & LOGGED!'
                            : '📡 TRANSMIT MESSAGE'}
                      </button>
                    </form>

                    <div className="direct-links-card">
                      <h4>DIRECT SCIENTIFIC CHANNELS:</h4>
                      <div className="links-row">
                        <a href="mailto:jespers5@uwm.edu" className="link-badge">
                          ✉️ Email
                        </a>
                        <a href="https://orcid.org/0009-0007-4226-0037" target="_blank" rel="noreferrer" className="link-badge">
                          🆔 ORCID
                        </a>
                        <a href="https://scholar.google.com" target="_blank" rel="noreferrer" className="link-badge">
                          🎓 Google Scholar
                        </a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="link-badge">
                          💻 GitHub
                        </a>
                        <a href="https://arxiv.org" target="_blank" rel="noreferrer" className="link-badge">
                          📑 arXiv Profile
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Bootstrap React into DOM
const rootElement = document.getElementById('react-root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<AstroApp />);
}
