
// ============================================================================
// ASTRO-OS ACADEMIC PORTFOLIO
// Complete React application
//
// Required scripts in index.html, in this order:
// 1. Three.js
// 2. React
// 3. ReactDOM
// 4. Babel
// 5. data.js
// 6. celestial.js
// 7. app.jsx
//
// This version does NOT use AstroScene, AstroShip, or the old navigation system.
// ============================================================================

const { useState, useEffect } = React;

function AstroApp() {
  const [viewMode, setViewMode] = useState("landing");

  // --------------------------------------------------------------------------
  // LOAD WEBSITE DATA
  // --------------------------------------------------------------------------

  const astroData = window.AstroData || {};
  const researcher = astroData.researcher || {};

  const publications = Array.isArray(astroData.publications)
    ? astroData.publications
    : [];

  const teaching = Array.isArray(astroData.teaching)
    ? astroData.teaching
    : [];

  const biography = Array.isArray(researcher.bio)
    ? researcher.bio
    : researcher.bio
      ? [researcher.bio]
      : [];

  const appointments = Array.isArray(researcher.appointments)
    ? researcher.appointments
    : [];

  // --------------------------------------------------------------------------
  // THREE.JS LAUNCH SCREEN
  // --------------------------------------------------------------------------

  useEffect(() => {
    if (viewMode !== "landing") return undefined;

    const container = document.getElementById("launch-cosmos");

    if (!container) {
      console.error("Launch screen error: #launch-cosmos was not found.");
      return undefined;
    }

    if (!window.THREE) {
      console.error("Launch screen error: Three.js did not load.");
      return undefined;
    }

    if (!window.AstroCelestial) {
      console.error("Launch screen error: celestial.js did not load.");
      return undefined;
    }

    if (
      typeof window.AstroCelestial.createLaunchScene !== "function"
    ) {
      console.error(
        "Launch screen error: createLaunchScene() is missing from celestial.js."
      );
      return undefined;
    }

    const THREE = window.THREE;

    let renderer;
    let modelRoots = [];
    let animationFrameId = null;
    let disposed = false;

    try {
      // Scene
      const scene = new THREE.Scene();

      // Camera
      const camera = new THREE.PerspectiveCamera(
        48,
        Math.max(container.clientWidth, 1) /
          Math.max(container.clientHeight, 1),
        0.1,
        1200
      );

      camera.position.set(0, 0, 0);
      camera.lookAt(0, 0, -1);

      // Renderer
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power"
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.75)
      );

      renderer.setSize(
        Math.max(container.clientWidth, 1),
        Math.max(container.clientHeight, 1)
      );

      renderer.setClearColor(0x000000, 0);

      if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
      }

      if (
        "toneMapping" in renderer &&
        THREE.ACESFilmicToneMapping !== undefined
      ) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
      }

      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";

      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
      keyLight.position.set(-35, 55, 45);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x8b9cff, 0.65);
      rimLight.position.set(45, -25, -80);
      scene.add(rimLight);

      // Create the launch-screen models.
      modelRoots = window.AstroCelestial.createLaunchScene(scene) || [];

      if (!Array.isArray(modelRoots)) {
        throw new Error(
          "createLaunchScene() did not return an array of model objects."
        );
      }

      // Fade the models so they remain subtle behind the landing card.
      modelRoots.forEach((root) => {
        if (!root || typeof root.traverse !== "function") return;

        root.traverse((object) => {
          if (object.isLight) {
            object.intensity *= 0.32;
          }

          if (!object.material) return;

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => {
            material.transparent = true;
            material.opacity = (material.opacity ?? 1) * 0.34;
            material.depthWrite = false;
            material.needsUpdate = true;
          });
        });
      });

      // Animation
      const clock = new THREE.Clock();

      const resizeRenderer = () => {
        if (disposed) return;

        const width = Math.max(container.clientWidth, 1);
        const height = Math.max(container.clientHeight, 1);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio || 1, 1.75)
        );
      };

      const animate = () => {
        if (disposed) return;

        animationFrameId = window.requestAnimationFrame(animate);

        const delta = Math.min(clock.getDelta(), 0.05);

        modelRoots.forEach((root) => {
          if (
            root &&
            root.userData &&
            typeof root.userData.update === "function"
          ) {
            root.userData.update(delta);
          }
        });

        renderer.render(scene, camera);
      };

      window.addEventListener("resize", resizeRenderer);

      resizeRenderer();
      animate();

      // Cleanup when the visitor leaves the landing screen.
      return () => {
        disposed = true;

        if (animationFrameId !== null) {
          window.cancelAnimationFrame(animationFrameId);
        }

        window.removeEventListener("resize", resizeRenderer);

        modelRoots.forEach((root) => {
          if (!root) return;

          scene.remove(root);

          if (typeof root.traverse !== "function") return;

          root.traverse((object) => {
            if (
              object.geometry &&
              typeof object.geometry.dispose === "function"
            ) {
              object.geometry.dispose();
            }

            if (!object.material) return;

            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];

            materials.forEach((material) => {
              if (
                material &&
                typeof material.dispose === "function"
              ) {
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
    } catch (error) {
      console.error("Launch screen initialization failed:", error);

      if (renderer) {
        renderer.dispose();

        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }

      return undefined;
    }
  }, [viewMode]);

  // --------------------------------------------------------------------------
  // APPLICATION
  // --------------------------------------------------------------------------

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

          {/* Three.js background */}
          <div id="launch-cosmos" aria-hidden="true" />

          {/* Main landing content */}
          <div className="landing-card">

            <h1 className="landing-name">
              Tai Jespersen
            </h1>

            <p className="landing-role">
              PhD Student · Gravitational Wave &amp; Pulsar Astronomy
            </p>

            <p className="landing-inst">
              Center for Gravitation, Cosmology, and Astrophysics
              · UW-Milwaukee
            </p>

            <p className="landing-bio-snippet">
              Computational astrophysics · Pulsar astronomy ·
              Compact objects
            </p>

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
      {/* ABOUT ME / ACADEMIC PORTFOLIO                                      */}
      {/* ================================================================== */}

      {viewMode === "reader" && (
        <div className="reader-container">

          {/* ---------------------------------------------------------------- */}
          {/* HEADER                                                           */}
          {/* ---------------------------------------------------------------- */}

          <header className="reader-header">

            <div className="reader-brand">

              <div className="reader-pretitle">
                ACADEMIC DOSSIER &amp; CURRICULUM VITAE
              </div>

              <h1>
                {researcher.name || "Tai Jespersen"}
              </h1>

              <p className="reader-tagline">
                {researcher.title || "PhD Student"}
              </p>

              <p className="reader-inst">
                {researcher.institution || "University of Wisconsin-Milwaukee"}
              </p>

              <div className="reader-contacts">

                {researcher.email && (
                  <a
                    href={`mailto:${researcher.email}`}
                    className="reader-contact-pill"
                  >
                    ✉️ {researcher.email}
                  </a>
                )}

                <a
                  href="https://orcid.org/0009-0007-4226-0037"
                  target="_blank"
                  rel="noreferrer"
                  className="reader-contact-pill"
                >
                  🆔 ORCID: 0009-0007-4226-0037
                </a>

                <a
                  href="https://linkedin.com/in/tai-jespersen"
                  target="_blank"
                  rel="noreferrer"
                  className="reader-contact-pill"
                >
                  LinkedIn
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

          {/* ---------------------------------------------------------------- */}
          {/* MAIN CONTENT                                                     */}
          {/* ---------------------------------------------------------------- */}

          <main className="reader-body">

            {/* OVERVIEW */}

            <section className="reader-section">

              <div className="section-header-row">
                <span className="section-spark">✦</span>
                <h2>OVERVIEW</h2>
              </div>

              <div className="reader-bio-card">
                {biography.map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
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

                {publications.map((publication, index) => (
                  <div
                    key={publication.id || index}
                    className="pub-card"
                  >

                    <div className="pub-badge-row">

                      {publication.badge && (
                        <span className="pub-badge">
                          {publication.badge}
                        </span>
                      )}

                      {publication.year && (
                        <span className="pub-year">
                          {publication.year}
                        </span>
                      )}

                      {publication.journal && (
                        <span className="pub-journal">
                          {publication.journal}
                        </span>
                      )}

                    </div>

                    <h3 className="pub-title">
                      {publication.title}
                    </h3>

                    <p className="pub-authors">
                      {publication.authors}
                    </p>

                    <p className="pub-abstract">
                      {publication.abstract}
                    </p>

                    <div className="pub-actions">

                      {publication.arxiv && (
                        <a
                          href={`https://arxiv.org/abs/${publication.arxiv}`}
                          target="_blank"
                          rel="noreferrer"
                          className="reader-action-btn"
                        >
                          arXiv:{publication.arxiv}
                        </a>
                      )}

                      {publication.doi && (
                        <a
                          href={`https://doi.org/${publication.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="reader-action-btn"
                        >
                          DOI Link
                        </a>
                      )}

                    </div>

                  </div>
                ))}

                {publications.length === 0 && (
                  <p>No publications are currently listed.</p>
                )}

              </div>
            </section>

            {/* EDUCATION */}

            <section className="reader-section">

              <div className="section-header-row">
                <span className="section-spark">✦</span>
                <h2>EDUCATION</h2>
              </div>

              <div className="appointments-card">

                {appointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="appointment-row"
                  >

                    <span className="app-period">
                      {appointment.period}
                    </span>

                    <div className="app-details">

                      <span className="app-role">
                        {appointment.role}
                      </span>

                      <span className="app-inst">
                        {appointment.institution}
                      </span>

                    </div>
                  </div>
                ))}

                {appointments.length === 0 && (
                  <p>No education entries are currently listed.</p>
                )}

              </div>
            </section>

            {/* TEACHING */}

            <section className="reader-section">

              <div className="section-header-row">
                <span className="section-spark">✦</span>
                <h2>TEACHING</h2>
              </div>

              <div className="teaching-list">

                {teaching.map((teachingItem, index) => (
                  <div
                    key={index}
                    className="teaching-item"
                  >

                    <div className="teach-hdr">

                      <span className="teach-id">
                        {teachingItem.courseId}
                      </span>

                      <span className="teach-term">
                        {teachingItem.term}
                      </span>

                    </div>

                    <h4>
                      {teachingItem.title}
                    </h4>

                    <p>
                      {teachingItem.desc}
                    </p>

                  </div>
                ))}

                {teaching.length === 0 && (
                  <p>No teaching entries are currently listed.</p>
                )}

              </div>
            </section>

            {/* CV */}

            <section className="reader-section cv-section">

              <div className="cv-card">

                <div className="cv-info">

                  <h3>
                    Curriculum Vitae
                  </h3>

                  <p>
                    View the complete updated CV, including research
                    experience, publications, presentations, and education.
                  </p>

                </div>

                <a
                  className="cv-button"
                  href="/Website/CV___Tai_Jespersen__Updated_Sep__2026_.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 View Complete CV (PDF)
                </a>

              </div>
            </section>

          </main>
        </div>
      )}

    </div>
  );
}

// ============================================================================
// START REACT
// ============================================================================

const rootElement = document.getElementById("react-root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<AstroApp />);
} else {
  console.error(
    "React initialization failed: #react-root was not found in index.html."
  );
}
