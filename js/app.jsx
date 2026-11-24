// ============================================================================
// REACT APPLICATION: ASTRO-OS ACADEMIC PORTFOLIO
// React 18 / Three.js / Static GitHub Pages
//
// Required script order:
// 1. React and ReactDOM
// 2. Three.js
// 3. AstroCelestial.js
// 4. AstroData.js
// 5. This app.jsx
// ============================================================================

const { useState, useEffect } = React;

function AstroApp() {
  const [viewMode, setViewMode] = useState("landing");

  // ==========================================================================
  // LAUNCH SCREEN THREE.JS BACKGROUND
  // ==========================================================================
  // The existing celestial-model factory supplies the actual animated models.
  // The canvas exists only on the landing screen and is cleaned up when the
  // visitor opens the academic dossier.
  // ==========================================================================

  useEffect(() => {
    if (viewMode !== "landing") return undefined;

    const container = document.getElementById("launch-cosmos");

    if (!container || !window.THREE || !window.AstroCelestial) {
      return undefined;
    }

    const THREE = window.THREE;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      48,
      Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
      0.1,
      1200
    );

    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power"
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(
      Math.max(container.clientWidth, 1),
      Math.max(container.clientHeight, 1)
    );
    renderer.setClearColor(0x000000, 0);

    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    if ("toneMapping" in renderer && THREE.ACESFilmicToneMapping !== undefined) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    }

    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    // Soft lighting keeps the low-poly models visible without overpowering
    // the landing-screen text.
    scene.add(new THREE.AmbientLight(0xffffff, 1.25));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    keyLight.position.set(-35, 55, 45);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8b9cff, 0.65);
    rimLight.position.set(45, -25, -80);
    scene.add(rimLight);

    // Use the launch-specific selection from the model factory.
    const modelRoots = window.AstroCelestial.createLaunchScene(scene);

    // Fade every material and reduce local lights. The original materials and
    // model geometry remain intact; only this launch-scene instance is dimmed.
    modelRoots.forEach((root) => {
      if (!root) return;
    
      root.traverse((object) => {
        if (object.isLight) object.intensity *= 0.32;
        if (!object.material) return;
    
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
    
        // Check whether this object belongs to the Green Bank Telescope
        let isTelescope = false;
        let parent = object;
    
        while (parent) {
          if (parent.userData?.isTelescope) {
            isTelescope = true;
            break;
          }
          parent = parent.parent;
        }
    
        materials.forEach((material) => {
          material.transparent = true;
    
          const opacity = isTelescope ? 0.75 : 0.34;
          material.opacity = (material.opacity ?? 1) * opacity;
    
          material.depthWrite = false;
          material.needsUpdate = true;
        });
      });
    });

    const clock = new THREE.Clock();
    let animationFrameId = null;
    let isDisposed = false;

    const resizeRenderer = () => {
      if (isDisposed) return;

      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    };

    const animate = () => {
      if (isDisposed) return;

      animationFrameId = window.requestAnimationFrame(animate);

      // Clamp large frame gaps (e.g. when a tab becomes active again).
      const delta = Math.min(clock.getDelta(), 0.05);

      modelRoots.forEach((root) => {
        if (root && root.userData && typeof root.userData.update === "function") {
          root.userData.update(delta);
        }
      });

      renderer.render(scene, camera);
    };

    window.addEventListener("resize", resizeRenderer);
    resizeRenderer();
    animate();

    // Clean up the animation and GPU resources when leaving the landing page.
    return () => {
      isDisposed = true;

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener("resize", resizeRenderer);

      modelRoots.forEach((root) => {
        if (!root) return;

        scene.remove(root);

        root.traverse((object) => {
          if (object.geometry && typeof object.geometry.dispose === "function") {
            object.geometry.dispose();
          }

          if (!object.material) return;

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => {
            if (material && typeof material.dispose === "function") {
              material.dispose();
            }
          });
        });
      });

      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [viewMode]);

  // ==========================================================================
  // MAIN APPLICATION
  // ==========================================================================

  const researcher = window.AstroData.researcher;

  return (
    <div
      className={`astro-app ${
        viewMode === "reader" ? "reader-mode-active" : ""
      }`}
    >
      {/* ================================================================== */}
      {/* LANDING SCREEN                                                     */}
      {/* ================================================================== */}

      {viewMode === "landing" && (
        <div className="landing-screen">
          {/* Three.js canvas sits behind the landing card. */}
          <div id="launch-cosmos" aria-hidden="true" />

          <div className="landing-card">
            <h1 className="landing-name">Tai Jespersen</h1>

            <p className="landing-role">
              PhD Student · Gravitational Wave &amp; Pulsar Astronomy
            </p>

            <p className="landing-inst">
              Center for Gravitation, Cosmology, and Astrophysics · UW-Milwaukee
            </p>

            <p className="landing-bio-snippet" />

            <div className="landing-actions">
              <button
                className="landing-btn primary"
                onClick={() => setViewMode("reader")}
              >
                <span className="btn-icon">✦</span>
                <span>About Me &amp; Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* ABOUT ME / ACADEMIC DOSSIER                                        */}
      {/* ================================================================== */}

      {viewMode === "reader" && (
        <div className="reader-container">
          <header className="reader-header">
            <div className="reader-brand">
              <div className="reader-pretitle">
                ACADEMIC DOSSIER &amp; CURRICULUM VITAE
              </div>

              <h1>{researcher.name}</h1>

              <p className="reader-tagline">{researcher.title}</p>

              <p className="reader-inst">{researcher.institution}</p>

              <div className="reader-contacts">
                <a
                  href={`mailto:${researcher.email}`}
                  className="reader-contact-pill"
                >
                  ✉️ {researcher.email}
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
              onClick={() => setViewMode("landing")}
            >
              ← Back to Home
            </button>
          </header>

          <main className="reader-body">
            {/* OVERVIEW */}

            <section className="reader-section">
              <div className="section-header-row">
                <span className="section-spark">✦</span>
                <h2>OVERVIEW</h2>
              </div>

              <div className="reader-bio-card">
                {researcher.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* PUBLICATIONS */}

            <section className="reader-section">
              <div className="section-header-row">
                <span className="section-spark">✦</span>
                <h2>PUBLICATIONS &amp; PREPRINTS</h2>
              </div>

              <div className="reader-pubs-list">
                {window.AstroData.publications.map((publication) => (
                  <div key={publication.id} className="pub-card">
                    <div className="pub-badge-row">
                      <span className="pub-badge">{publication.badge}</span>
                      <span className="pub-year">{publication.year}</span>
                      <span className="pub-journal">{publication.journal}</span>
                    </div>

                    <h3 className="pub-title">{publication.title}</h3>

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
