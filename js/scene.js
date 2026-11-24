
 // ============================================================================
 // THREE.JS SCENE, STARFIELD & CELESTIAL ANIMATION
 // Simplified replacement for the old ship-navigation scene.js
 // ============================================================================

window.AstroScene = {
  scene: null,
  camera: null,
  renderer: null,
  clock: null,
  celestialObjects: [],
  starfield: null,
  canvasContainer: null,
  animationFrameId: null,
  resizeHandler: null,
  isRunning: false,

  // --------------------------------------------------------------------------
  // INITIALIZATION
  // --------------------------------------------------------------------------

  init(containerId) {
    if (this.isRunning) this.destroy();

    this.canvasContainer = document.getElementById(containerId);

    if (!this.canvasContainer) {
      console.error(`AstroScene: container "${containerId}" not found.`);
      return;
    }

    if (!window.THREE) {
      console.error("AstroScene: Three.js has not loaded.");
      return;
    }

    if (!window.AstroCelestial) {
      console.error("AstroScene: celestial.js has not loaded.");
      return;
    }

    const THREE = window.THREE;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05070f);
    this.scene.fog = new THREE.FogExp2(0x05070f, 0.0004);

    // Camera: fixed viewpoint, no ship following
    this.camera = new THREE.PerspectiveCamera(
      60,
      Math.max(this.canvasContainer.clientWidth, 1) /
        Math.max(this.canvasContainer.clientHeight, 1),
      0.1,
      2000
    );

    this.camera.position.set(0, 5.5, 16);
    this.camera.lookAt(0, 1.2, -8);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    this.renderer.setSize(
      Math.max(this.canvasContainer.clientWidth, 1),
      Math.max(this.canvasContainer.clientHeight, 1)
    );

    this.renderer.setClearColor(0x000000, 0);

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.canvasContainer.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    // Build scene
    this.setupLighting();
    this.createStarfield();

    // Create celestial models
    const objects = window.AstroCelestial.createLaunchScene(this.scene);

    this.celestialObjects = Array.isArray(objects)
      ? objects
      : Object.values(objects || {});

    // Resize handling
    this.resizeHandler = () => this.onResize();
    window.addEventListener("resize", this.resizeHandler);

    // Start animation
    this.isRunning = true;
    this.animate();
  },

  // --------------------------------------------------------------------------
  // LIGHTING
  // --------------------------------------------------------------------------

  setupLighting() {
    const THREE = window.THREE;

    const ambientLight = new THREE.AmbientLight(
      0x1e293b,
      1.8
    );

    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      0xfffbeb,
      2.2
    );

    sunLight.position.set(100, 80, 50);
    this.scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(
      0x0284c7,
      1.2
    );

    fillLight.position.set(-80, -40, -100);
    this.scene.add(fillLight);
  },

  // --------------------------------------------------------------------------
  // STARFIELD
  // --------------------------------------------------------------------------

  createStarfield() {
    const THREE = window.THREE;

    const starCount = 1400;
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorChoices = [
      new THREE.Color(0x00f0ff),
      new THREE.Color(0xffffff),
      new THREE.Color(0xf59e0b),
      new THREE.Color(0xc084fc)
    ];

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 600 + Math.random() * 800;

      positions[i * 3] =
        radius * Math.sin(phi) * Math.cos(theta);

      positions[i * 3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta);

      positions[i * 3 + 2] =
        radius * Math.cos(phi);

      const color =
        colorChoices[
          Math.floor(Math.random() * colorChoices.length)
        ];

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    // Soft circular star texture
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;

    const context = canvas.getContext("2d");

    const gradient = context.createRadialGradient(
      32, 32, 0,
      32, 32, 30
    );

    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.8)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);

    const starTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      alphaTest: 0.05,
      opacity: 0.85,
      depthWrite: false
    });

    this.starfield = new THREE.Points(geometry, material);
    this.scene.add(this.starfield);
  },

  // --------------------------------------------------------------------------
  // RESIZE
  // --------------------------------------------------------------------------

  onResize() {
    if (!this.camera || !this.renderer || !this.canvasContainer) {
      return;
    }

    const width = Math.max(this.canvasContainer.clientWidth, 1);
    const height = Math.max(this.canvasContainer.clientHeight, 1);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  },

  // --------------------------------------------------------------------------
  // ANIMATION LOOP
  // --------------------------------------------------------------------------

  animate() {
    if (!this.isRunning) return;

    this.animationFrameId = window.requestAnimationFrame(
      () => this.animate()
    );

    const delta = Math.min(this.clock.getDelta(), 0.05);

    // Update celestial models
    this.celestialObjects.forEach((object) => {
      if (
        object &&
        object.userData &&
        typeof object.userData.update === "function"
      ) {
        object.userData.update(delta);
      }
    });

    // Slowly rotate the starfield
    if (this.starfield) {
      this.starfield.rotation.y += delta * 0.002;
    }

    this.renderer.render(this.scene, this.camera);
  },

  // --------------------------------------------------------------------------
  // CLEANUP
  // --------------------------------------------------------------------------

  destroy() {
    this.isRunning = false;

    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }

    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => {
            if (material && material.dispose) {
              material.dispose();
            }
          });
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();

      if (
        this.canvasContainer &&
        this.renderer.domElement.parentNode === this.canvasContainer
      ) {
        this.canvasContainer.removeChild(this.renderer.domElement);
      }
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;
    this.celestialObjects = [];
    this.starfield = null;
    this.canvasContainer = null;
  }
};
