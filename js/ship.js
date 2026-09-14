// ============================================================================
// Camera Movement
// ============================================================================

window.AstroShip = {
  mesh: null,

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
    this.setupKeyListeners();
  },

  createShipMesh(scene) {
    // Create an empty group to act as the mathematical anchor for movement and rotation.
    // This keeps all the flight math working perfectly without rendering anything.
    const shipGroup = new THREE.Group();
    shipGroup.position.copy(this.position);
    scene.add(shipGroup);
    this.mesh = shipGroup;
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
    }

    this.mesh.position.copy(this.position);
  }
};
