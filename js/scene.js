// ============================================================================
// THREE.JS SCENE, STARFIELD, CAMERA CONTROLLER & GAME LOOP
// ============================================================================

window.AstroScene = {
  scene: null,
  camera: null,
  renderer: null,
  clock: null,
  celestialObjects: {},
  canvasContainer: null,

  // Camera settings
  cameraOffset: new THREE.Vector3(0, 5.5, 16),
  lookAtOffset: new THREE.Vector3(0, 1.2, -8),
  currentCameraPos: new THREE.Vector3(),
  currentLookAt: new THREE.Vector3(),

  init(containerId) {
    this.canvasContainer = document.getElementById(containerId);
    if (!this.canvasContainer) return;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05070f, 0.0004);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.currentCameraPos.copy(this.cameraOffset);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.canvasContainer.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    // Lighting
    this.setupLighting();

    // Starfield
    this.createStarfield();

    // Celestial Universe
    this.celestialObjects = window.AstroCelestial.createUniverse(this.scene);

    // Ship
    window.AstroShip.init(this.scene);

    // Event Listeners
    window.addEventListener('resize', () => this.onResize());
    this.setupInteractivity();

    // Start Game Loop
    this.animate();
  },

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    this.scene.add(ambientLight);

    // Main Directional Sun / Galactic core light
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    sunLight.position.set(100, 80, 50);
    this.scene.add(sunLight);

    // Cyan Fill light
    const fillLight = new THREE.DirectionalLight(0x0284c7, 1.2);
    fillLight.position.set(-80, -40, -100);
    this.scene.add(fillLight);
  },

  createStarfield() {
    const starCount = 1400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorChoices = [
      new THREE.Color(0x00f0ff), // Cyan
      new THREE.Color(0xffffff), // White
      new THREE.Color(0xf59e0b), // Amber
      new THREE.Color(0xc084fc)  // Violet
    ];

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 600 + Math.random() * 800;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  
  const starTexture = new THREE.CanvasTexture(canvas);
    
    const material = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      alphaTest: 0.1,
      opacity: 1.0
    });

    const starPoints = new THREE.Points(geometry, material);
    this.scene.add(starPoints);
  },

  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  },

  setupInteractivity() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let currentlyHoveredId = null;

    // Hover Raycasting for Destiny 2 Planet Selection Inspection Box
    window.addEventListener('pointermove', (e) => {
      // If cursor is over an open modal or interactive button, suppress celestial hover
      if (e.target.closest('.modal-container') || e.target.closest('.hud-controls-top') || e.target.closest('.docking-prompt-banner')) {
        if (currentlyHoveredId) {
          currentlyHoveredId = null;
          document.body.style.cursor = 'default';
          if (window.AstroAppDispatch) {
            window.AstroAppDispatch({ type: 'HOVER_DESTINATION', payload: null });
          }
        }
        return;
      }

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);

      // Check for hover over interactive celestial destinations (Green Bank, J1713, Binary Black Holes)
      const targets = Object.values(this.celestialObjects).filter(o => o.userData && o.userData.id);
      const intersects = raycaster.intersectObjects(targets, true);

      if (intersects.length > 0) {
        let hitObject = intersects[0].object;
        while (hitObject.parent && !hitObject.userData.id) {
          hitObject = hitObject.parent;
        }

        if (hitObject.userData && hitObject.userData.id) {
          const dest = window.AstroData.destinations.find(d => d.id === hitObject.userData.id);
          if (dest) {
            document.body.style.cursor = 'pointer';
            if (currentlyHoveredId !== dest.id) {
              currentlyHoveredId = dest.id;
              if (window.astroAudio) window.astroAudio.playBlip(720, 0.03);
            }
            if (window.AstroAppDispatch) {
              window.AstroAppDispatch({
                type: 'HOVER_DESTINATION',
                payload: {
                  dest: dest,
                  screenX: e.clientX,
                  screenY: e.clientY
                }
              });
            }
            return;
          }
        }
      }

      // If no interactive celestial object is hovered
      if (currentlyHoveredId) {
        currentlyHoveredId = null;
        document.body.style.cursor = 'default';
        if (window.AstroAppDispatch) {
          window.AstroAppDispatch({ type: 'HOVER_DESTINATION', payload: null });
        }
      }
    });

    // Click Raycasting: Clicking celestial object directly opens the associated modal popup (like pressing E)
    window.addEventListener('click', (e) => {
      // Don't raycast if clicking UI buttons or active modal
      if (e.target.closest('.modal-container') || e.target.closest('.hud-controls-top') || e.target.closest('.docking-prompt-banner') || e.target.closest('.waypoint-badge')) return;

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);

      const targets = Object.values(this.celestialObjects).filter(o => o.userData && o.userData.id);
      const intersects = raycaster.intersectObjects(targets, true);

      if (intersects.length > 0) {
        let hitObject = intersects[0].object;
        while (hitObject.parent && !hitObject.userData.id) {
          hitObject = hitObject.parent;
        }

        if (hitObject.userData && hitObject.userData.id) {
          const dest = window.AstroData.destinations.find(d => d.id === hitObject.userData.id);
          if (dest && window.AstroAppDispatch) {
            window.AstroAppDispatch({ type: 'OPEN_DESTINATION_MODAL', payload: dest });
          }
        }
      }
    });
  },

  // Project a 3D world coordinate to 2D screen pixels for HUD bracket markers
  projectToScreen(vector3) {
    const p = vector3.clone().project(this.camera);
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    return {
      x: (p.x * halfW) + halfW,
      y: -(p.y * halfH) + halfH,
      inFront: p.z < 1.0
    };
  },

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = Math.min(this.clock.getDelta(), 0.1);

    // Update player ship
    window.AstroShip.update(delta);

    // Update celestial objects
    Object.values(this.celestialObjects).forEach(obj => {
      if (obj.userData && typeof obj.userData.update === 'function') {
        obj.userData.update(delta);
      }
    });

    // Camera follow with spring-arm damping
    if (window.AstroShip.mesh) {
      const ship = window.AstroShip.mesh;
      const targetCamPos = this.cameraOffset.clone().applyEuler(ship.rotation).add(ship.position);
      const targetLook = this.lookAtOffset.clone().applyEuler(ship.rotation).add(ship.position);

      // Camera lerp
      this.currentCameraPos.lerp(targetCamPos, 0.08);
      this.currentLookAt.lerp(targetLook, 0.12);

      this.camera.position.copy(this.currentCameraPos);
      this.camera.lookAt(this.currentLookAt);

      // Dynamic FOV based on ship speed
      const speed = window.AstroShip.velocity.length();
      const baseFov = 60;
      const speedFov = baseFov + (speed / 45) * 15;
      this.camera.fov += (speedFov - this.camera.fov) * 0.1;
      this.camera.updateProjectionMatrix();

      // Check proximity & screen projection to destinations
      const screenMarkers = [];
      window.AstroData.destinations.forEach(dest => {
        const destPos = new THREE.Vector3(dest.coords.x, dest.coords.y, dest.coords.z);
        const dist = destPos.distanceTo(ship.position);
        dest.currentDistance = dist;

        const screen = this.projectToScreen(destPos);
        screenMarkers.push({
          id: dest.id,
          key: dest.key,
          name: dest.name,
          icon: dest.icon,
          color: dest.color,
          distance: Math.round(dist),
          x: Math.round(screen.x),
          y: Math.round(screen.y),
          inFront: screen.inFront
        });
      });

      // Notify React HUD
      if (window.AstroAppDispatch) {
        window.AstroAppDispatch({
          type: 'UPDATE_TELEMETRY',
          payload: {
            speed: Math.round(ship.speed * 32),
            coords: {
              x: Math.round(ship.position.x),
              y: Math.round(ship.position.y),
              z: Math.round(ship.position.z)
            },
            markers: screenMarkers
          }
        });
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
};
