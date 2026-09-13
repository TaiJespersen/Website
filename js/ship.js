// ============================================================================
// 3D LOW-POLY EXPLORATION SHIP & FLIGHT CONTROLLER: PULSAR-RUNNER MK-II
// ============================================================================

window.AstroShip = {
  mesh: null,
  thrusterParticles: [],
  particleGroup: null,

  // Physics state
  position: new THREE.Vector3(0, 0, 40),
  velocity: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Euler(0, 0, 0, 'YXZ'),
  angularVelocity: new THREE.Vector3(0, 0, 0),

  // Flight parameters
  maxSpeed: 45,
  boostMultiplier: 2.2,
  thrustForce: 28,
  drag: 0.96,
  angularDrag: 0.86,
  turnSpeed: 0.95, // Slower, smooth and graceful ship turning

  // Input states
  keys: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    boost: false,
    brake: false
  },

  isAutopilot: false,
  targetPos: null,
  lookTarget: null,
  targetRadius: 25,

  init(scene) {
    this.createShipMesh(scene);
    this.createThrusterParticles(scene);
    this.setupKeyListeners();
  },

  createShipMesh(scene) {
    const shipGroup = new THREE.Group();

    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      flatShading: true,
      metalness: 0.7,
      roughness: 0.3
    });

    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      flatShading: true,
      metalness: 0.8,
      roughness: 0.2
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      flatShading: true,
      roughness: 0.1,
      metalness: 0.9
    });

    // Main Central Fuselage (Faceted wedge)
    const bodyGeo = new THREE.ConeGeometry(2.2, 7.5, 5);
    const body = new THREE.Mesh(bodyGeo, hullMat);
    body.rotation.x = Math.PI / 2;
    shipGroup.add(body);

    // Forward Radiotelescope Timing Antenna Probe
    const probeGeo = new THREE.CylinderGeometry(0.15, 0.3, 4, 4);
    const probe = new THREE.Mesh(probeGeo, armorMat);
    probe.position.set(0, 0, -5.2);
    probe.rotation.x = Math.PI / 2;
    shipGroup.add(probe);

    // Cockpit Canopy
    const canopyGeo = new THREE.OctahedronGeometry(1.2);
    const canopy = new THREE.Mesh(canopyGeo, glassMat);
    canopy.position.set(0, 0.8, -1.2);
    canopy.scale.set(0.9, 0.7, 1.8);
    shipGroup.add(canopy);

    // Swept Low-Poly Winglets
    const wingGeo = new THREE.BoxGeometry(7.0, 0.2, 2.5);
    const wings = new THREE.Mesh(wingGeo, hullMat);
    wings.position.set(0, -0.2, 0.8);
    shipGroup.add(wings);

    // Wingtip Sensor Pods
    const podGeo = new THREE.BoxGeometry(0.5, 0.8, 2.0);
    const leftPod = new THREE.Mesh(podGeo, armorMat);
    leftPod.position.set(-3.5, 0.2, 0.8);
    shipGroup.add(leftPod);

    const rightPod = new THREE.Mesh(podGeo, armorMat);
    rightPod.position.set(3.5, 0.2, 0.8);
    shipGroup.add(rightPod);

    // Twin Ion Engine Nozzles
    const engineGeo = new THREE.CylinderGeometry(0.6, 0.8, 1.5, 6);
    const engMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, flatShading: true, metalness: 0.9 });

    const leftEng = new THREE.Mesh(engineGeo, engMat);
    leftEng.position.set(-1.2, -0.2, 3.2);
    leftEng.rotation.x = Math.PI / 2;
    shipGroup.add(leftEng);

    const rightEng = new THREE.Mesh(engineGeo, engMat);
    rightEng.position.set(1.2, -0.2, 3.2);
    rightEng.rotation.x = Math.PI / 2;
    shipGroup.add(rightEng);

    // Engine Exhaust Glow Cones
    const glowGeo = new THREE.ConeGeometry(0.5, 2.2, 6, 1, true);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });

    this.leftGlow = new THREE.Mesh(glowGeo, glowMat);
    this.leftGlow.position.set(-1.2, -0.2, 4.4);
    this.leftGlow.rotation.x = -Math.PI / 2;
    shipGroup.add(this.leftGlow);

    this.rightGlow = new THREE.Mesh(glowGeo, glowMat);
    this.rightGlow.position.set(1.2, -0.2, 4.4);
    this.rightGlow.rotation.x = -Math.PI / 2;
    shipGroup.add(this.rightGlow);

    shipGroup.position.copy(this.position);
    scene.add(shipGroup);
    this.mesh = shipGroup;
  },

  createThrusterParticles(scene) {
    this.particleGroup = new THREE.Group();
    const count = 35;
    const pGeo = new THREE.DodecahedronGeometry(0.3, 0);
    const pMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });

    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(pGeo, pMat.clone());
      p.visible = false;
      p.userData = { life: 0, maxLife: 0.6, vel: new THREE.Vector3() };
      this.particleGroup.add(p);
      this.thrusterParticles.push(p);
    }
    scene.add(this.particleGroup);
  },

  spawnParticle(origin) {
    const p = this.thrusterParticles.find(part => !part.visible);
    if (!p) return;
    p.visible = true;
    p.position.copy(origin);
    p.userData.life = 0;
    p.userData.maxLife = 0.35 + Math.random() * 0.25;

    // Backward velocity relative to ship orientation
    const backward = new THREE.Vector3(
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4,
      1.0
    ).applyEuler(this.mesh.rotation);

    p.userData.vel.copy(backward).multiplyScalar(8 + Math.random() * 12);
  },

  setupKeyListeners() {
    window.addEventListener('keydown', (e) => {
      // Ignore key input when typing in inputs/textareas
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.keys.forward = true; break;
        case 'KeyS': case 'ArrowDown': this.keys.backward = true; break;
        case 'KeyA': case 'ArrowLeft': this.keys.left = true; break;
        case 'KeyD': case 'ArrowRight': this.keys.right = true; break;
        case 'KeyR': this.keys.up = true; break;
        case 'KeyF': this.keys.down = true; break;
        case 'ShiftLeft': case 'ShiftRight': this.keys.boost = true; break;
        case 'Space': this.keys.brake = true; break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.keys.forward = false; break;
        case 'KeyS': case 'ArrowDown': this.keys.backward = false; break;
        case 'KeyA': case 'ArrowLeft': this.keys.left = false; break;
        case 'KeyD': case 'ArrowRight': this.keys.right = false; break;
        case 'KeyR': this.keys.up = false; break;
        case 'KeyF': this.keys.down = false; break;
        case 'ShiftLeft': case 'ShiftRight': this.keys.boost = false; break;
        case 'Space': this.keys.brake = false; break;
      }
    });
  },

  // Autopilot Warp Travel to a Destination
  warpTo(coords, onArrival) {
    this.isAutopilot = true;
    // Position ship at a clean viewing waypoint in front of the celestial object
    this.targetPos = new THREE.Vector3(coords.x, coords.y + 4, coords.z + 36);
    this.lookTarget = new THREE.Vector3(coords.x, coords.y, coords.z);
    this.onArrivalCallback = onArrival;
    this.velocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0, 0);
    if (window.astroAudio) window.astroAudio.playWarp();
  },

  update(delta) {
    if (!this.mesh) return;

    if (this.isAutopilot && this.targetPos) {
      // Smooth hyperbolic warp deceleration toward target waypoint
      const toTarget = new THREE.Vector3().subVectors(this.targetPos, this.position);
      const dist = toTarget.length();

      if (dist < 3.5) {
        // Arrived at destination!
        this.isAutopilot = false;
        this.velocity.set(0, 0, 0);
        this.angularVelocity.set(0, 0, 0);
        this.position.copy(this.targetPos);

        // Turn ship to face the celestial body directly, strictly upright (no upside-down roll)
        if (this.lookTarget) {
          const toObj = new THREE.Vector3().subVectors(this.lookTarget, this.position);
          const finalYaw = Math.atan2(-toObj.x, -toObj.z);
          const distXZ = Math.hypot(toObj.x, toObj.z);
          const finalPitch = Math.atan2(toObj.y, Math.max(0.1, distXZ));
          this.mesh.rotation.set(finalPitch, finalYaw, 0, 'YXZ');
        }

        if (this.onArrivalCallback) this.onArrivalCallback();
      } else {
        const moveDir = toTarget.clone().normalize();
        const warpSpeed = Math.min(180, Math.max(28, dist * 2.6));
        this.velocity.copy(moveDir).multiplyScalar(warpSpeed);
        this.position.addScaledVector(this.velocity, delta);

        // Steer ship along flight vector with UP strictly pointing upright (roll = 0)!
        const targetYaw = Math.atan2(-moveDir.x, -moveDir.z);
        const distXZ = Math.hypot(moveDir.x, moveDir.z);
        const targetPitch = Math.atan2(moveDir.y, Math.max(0.1, distXZ));

        // Smooth angular interpolation
        let dyaw = targetYaw - this.mesh.rotation.y;
        while (dyaw < -Math.PI) dyaw += Math.PI * 2;
        while (dyaw > Math.PI) dyaw -= Math.PI * 2;
        this.mesh.rotation.y += dyaw * 0.14;

        let dpitch = targetPitch - this.mesh.rotation.x;
        this.mesh.rotation.x += dpitch * 0.14;

        // Force roll to 0 during warp to prevent any inverted flipping
        this.mesh.rotation.z = 0;
      }
    } else {
      // Manual Piloting Physics
      // Angular rotation (pitch and yaw)
      if (this.keys.left) this.angularVelocity.y += this.turnSpeed * delta;
      if (this.keys.right) this.angularVelocity.y -= this.turnSpeed * delta;
      if (this.keys.up) this.angularVelocity.x -= this.turnSpeed * delta;
      if (this.keys.down) this.angularVelocity.x += this.turnSpeed * delta;

      // Apply angular damping
      this.angularVelocity.multiplyScalar(this.angularDrag);
      this.mesh.rotation.y += this.angularVelocity.y;
      this.mesh.rotation.x += this.angularVelocity.x;

      // Clamp pitch to prevent accidental inverted upside-down camera flips
      this.mesh.rotation.x = Math.max(-1.15, Math.min(1.15, this.mesh.rotation.x));

      // Roll bank smoothly into turns
      const targetRoll = -this.angularVelocity.y * 2.8;
      this.mesh.rotation.z += (targetRoll - this.mesh.rotation.z) * 0.1;

      // Forward/Backward thrust vector
      let throttle = 0;
      if (this.keys.forward) throttle += 1;
      if (this.keys.backward) throttle -= 0.6;

      const currentMaxSpeed = this.keys.boost ? this.maxSpeed * this.boostMultiplier : this.maxSpeed;

      if (throttle !== 0) {
        const forwardVector = new THREE.Vector3(0, 0, -1).applyEuler(this.mesh.rotation);
        this.velocity.addScaledVector(forwardVector, throttle * this.thrustForce * delta);

        // Spawn thruster particles from dual engines
        if (Math.random() < 0.8) {
          const leftOffset = new THREE.Vector3(-1.2, -0.2, 3.5).applyEuler(this.mesh.rotation).add(this.mesh.position);
          const rightOffset = new THREE.Vector3(1.2, -0.2, 3.5).applyEuler(this.mesh.rotation).add(this.mesh.position);
          this.spawnParticle(leftOffset);
          this.spawnParticle(rightOffset);
        }
      }

      // Space Brake
      if (this.keys.brake) {
        this.velocity.multiplyScalar(0.88);
      } else {
        this.velocity.multiplyScalar(this.drag);
      }

      // Clamp max velocity
      if (this.velocity.length() > currentMaxSpeed) {
        this.velocity.setLength(currentMaxSpeed);
      }

      this.position.addScaledVector(this.velocity, delta);

      // Engine audio feedback
      if (window.astroAudio) {
        window.astroAudio.updateEngine(throttle, this.keys.boost);
      }

      // Visual Engine Glow Scaling
      const glowScale = throttle > 0 ? (this.keys.boost ? 2.5 : 1.4) : 0.4;
      if (this.leftGlow && this.rightGlow) {
        this.leftGlow.scale.set(glowScale, glowScale, glowScale);
        this.rightGlow.scale.set(glowScale, glowScale, glowScale);
      }
    }

    this.mesh.position.copy(this.position);

    // Update thruster particles
    this.thrusterParticles.forEach(p => {
      if (!p.visible) return;
      p.userData.life += delta;
      if (p.userData.life >= p.userData.maxLife) {
        p.visible = false;
      } else {
        p.position.addScaledVector(p.userData.vel, delta);
        p.material.opacity = 1 - (p.userData.life / p.userData.maxLife);
      }
    });
  }
};
