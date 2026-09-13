// ============================================================================
// 3D LOW-POLY CELESTIAL OBJECTS & PTA UNIVERSE (THREE.JS)
// Focus: Neutron Stars, Millisecond Pulsars, Binary Pulsars, Magnetars, Radiotelescopes
// ============================================================================

window.AstroCelestial = {
  createUniverse(scene) {
    const celestialObjects = {};

    // 1. Millisecond Pulsar: PSR J1713+0747 (NANOGrav Benchmark Clock)
    celestialObjects.j1713 = this.createMillisecondPulsar(scene, { x: -80, y: 15, z: -60 });

    // 2. Relativistic Binary Pulsar: PSR B1913+16 (Hulse-Taylor Binary)
    celestialObjects.b1913 = this.createBinaryPulsar(scene, { x: 85, y: -20, z: -75 });

    // 3. Ultra-Magnetized Neutron Star: Magnetar SGR 1806-20
    celestialObjects.magnetar = this.createMagnetar(scene, { x: 0, y: 5, z: -150 });

    // 4. Orbital Radio Observatory: Green Bank & Arecibo Array
    celestialObjects.observatory = this.createRadioObservatory(scene, { x: -105, y: 35, z: 65 });

    // 5. Deep Space Relay: Earth Uplink Array
    celestialObjects.relay = this.createEarthRelay(scene, { x: 75, y: 25, z: 85 });

    // 6. Pulsar Timing Array (PTA) Cosmic Timing Grid & Baselines
    celestialObjects.ptaGrid = this.createPTATimingGrid(scene, celestialObjects);

    // 7. Ambient Asteroids & Low-Poly Cosmic Dust
    this.createAsteroidBelt(scene);
    this.createCosmicNebula(scene);

    return celestialObjects;
  },

  // --------------------------------------------------------------------------
  // 1. MILLISECOND PULSAR: PSR J1713+0747
  // Ultra-fast spinning faceted neutron star with relativistic light cones
  // --------------------------------------------------------------------------
  createMillisecondPulsar(scene, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    // Ultra-dense Faceted Neutron Core
    const coreGeo = new THREE.IcosahedronGeometry(7, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      flatShading: true,
      roughness: 0.2,
      metalness: 0.8
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Magnetic Corona Wireframe Shell
    const shellGeo = new THREE.DodecahedronGeometry(8.5);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    group.add(shell);

    // Relativistic Polar Radiation Beams (Dual sweeping cones)
    const beamGeo = new THREE.ConeGeometry(8, 75, 8, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });

    const beamGroup = new THREE.Group();
    const northBeam = new THREE.Mesh(beamGeo, beamMat);
    northBeam.position.y = 40;
    beamGroup.add(northBeam);

    const southBeam = new THREE.Mesh(beamGeo, beamMat);
    southBeam.position.y = -40;
    southBeam.rotation.x = Math.PI;
    beamGroup.add(southBeam);

    // Magnetic axis inclination
    beamGroup.rotation.z = 0.45;
    group.add(beamGroup);

    // Equatorial Relativistic Plasma Ring
    const ringGeo = new THREE.RingGeometry(11, 15, 18);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0369a1,
      flatShading: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const plasmaRing = new THREE.Mesh(ringGeo, ringMat);
    plasmaRing.rotation.x = Math.PI / 2;
    group.add(plasmaRing);

    group.userData = {
      id: "j1713",
      name: "PSR J1713+0747",
      radius: 26,
      time: 0,
      update(delta) {
        this.time += delta;
        // High rotational velocity (millisecond spin rate)
        core.rotation.y += delta * 6.5;
        beamGroup.rotation.y += delta * 5.2;
        shell.rotation.x -= delta * 1.5;
        plasmaRing.rotation.z += delta * 0.8;
      }
    };

    scene.add(group);
    return group;
  },

  // --------------------------------------------------------------------------
  // 2. BINARY PULSAR: PSR B1913+16 (HULSE-TAYLOR SYSTEM)
  // Twin orbiting neutron stars with expanding gravitational wave ripples
  // --------------------------------------------------------------------------
  createBinaryPulsar(scene, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    const pulsarMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      flatShading: true,
      roughness: 0.3
    });

    const compMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      emissive: 0x475569,
      emissiveIntensity: 0.5,
      flatShading: true,
      roughness: 0.4
    });

    // Primary Pulsar
    const star1 = new THREE.Mesh(new THREE.DodecahedronGeometry(5), pulsarMat);
    group.add(star1);

    // Primary Sweeping Beam
    const bGeo = new THREE.ConeGeometry(5, 45, 6, 1, true);
    const bMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true, transparent: true, opacity: 0.6 });
    const beam = new THREE.Mesh(bGeo, bMat);
    beam.position.y = 24;
    star1.add(beam);

    // Companion Neutron Star
    const star2 = new THREE.Mesh(new THREE.DodecahedronGeometry(4.6), compMat);
    group.add(star2);

    // Expanding Gravitational Wave Ripples (Concentric low-poly rings)
    const gwRipples = [];
    for (let i = 0; i < 4; i++) {
      const rGeo = new THREE.RingGeometry(8 + i * 8, 9.5 + i * 8, 20);
      const rMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.rotation.x = Math.PI / 2;
      group.add(rMesh);
      gwRipples.push(rMesh);
    }

    group.userData = {
      id: "b1913",
      name: "PSR B1913+16 (Binary)",
      radius: 32,
      time: 0,
      orbitRadius: 18,
      update(delta) {
        this.time += delta;
        const orbitSpeed = 1.4;
        const angle = this.time * orbitSpeed;

        star1.position.set(Math.cos(angle) * this.orbitRadius, 0, Math.sin(angle) * this.orbitRadius);
        star2.position.set(-Math.cos(angle) * this.orbitRadius, 0, -Math.sin(angle) * this.orbitRadius);

        star1.rotation.y += delta * 4.0;
        star2.rotation.y += delta * 2.0;

        // Animate gravitational wave ripples expanding outward
        gwRipples.forEach((r, idx) => {
          const t = (this.time * 0.8 + idx * 0.5) % 2.0;
          r.scale.set(1 + t * 2.2, 1 + t * 2.2, 1);
          r.material.opacity = Math.max(0, 0.6 - t * 0.28);
        });
      }
    };

    scene.add(group);
    return group;
  },

  // --------------------------------------------------------------------------
  // 3. MAGNETAR: SGR 1806-20 (ULTRA-MAGNETIZED NEUTRON STAR)
  // Faceted crust, magnetic field loop arches, and burst flare rings
  // --------------------------------------------------------------------------
  createMagnetar(scene, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    // Highly Strained Faceted Crust
    const crustGeo = new THREE.IcosahedronGeometry(9, 1);
    const crustMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.9,
      flatShading: true,
      roughness: 0.5,
      metalness: 0.7
    });
    const crust = new THREE.Mesh(crustGeo, crustMat);
    group.add(crust);

    // Magnetic Flux Loop Arches (Tori spanning across magnetic poles)
    const magneticArchMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });

    const arches = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const archGeo = new THREE.TorusGeometry(14, 0.4, 4, 16, Math.PI);
      const arch = new THREE.Mesh(archGeo, magneticArchMat);
      arch.rotation.y = (i * Math.PI) / 4;
      arch.position.y = 0;
      arches.add(arch);
    }
    group.add(arches);

    // Magnetar Giant Flare Flash Sphere
    const flareGeo = new THREE.IcosahedronGeometry(13, 1);
    const flareMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      wireframe: true,
      transparent: true,
      opacity: 0.0
    });
    const flare = new THREE.Mesh(flareGeo, flareMat);
    group.add(flare);

    group.userData = {
      id: "magnetar",
      name: "Magnetar SGR 1806-20",
      radius: 30,
      time: 0,
      update(delta) {
        this.time += delta;
        crust.rotation.y += delta * 0.4;
        arches.rotation.y += delta * 0.6;
        arches.rotation.z = Math.sin(this.time * 0.5) * 0.2;

        // Periodic seismic crust glitch / giant flare
        const flareCycle = Math.sin(this.time * 1.2);
        if (flareCycle > 0.85) {
          flare.material.opacity = (flareCycle - 0.85) * 5.0;
          flare.scale.setScalar(1.0 + (flareCycle - 0.85) * 1.8);
        } else {
          flare.material.opacity = 0;
        }
      }
    };

    scene.add(group);
    return group;
  },

  // --------------------------------------------------------------------------
  // 4. ORBITAL RADIO OBSERVATORY: GREEN BANK & ARECIBO ARRAY
  // Giant low-poly steerable radio dish, feed cabin, and support masts
  // --------------------------------------------------------------------------
  createRadioObservatory(scene, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      flatShading: true,
      metalness: 0.85,
      roughness: 0.25
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      flatShading: true,
      metalness: 0.9,
      roughness: 0.3
    });

    // Steerable Mount
    const mountGroup = new THREE.Group();

    // Parabolic Reflector Dish (Faceted cone/cylinder)
    const dishGeo = new THREE.CylinderGeometry(20, 3, 7, 16, 2, true);
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = Math.PI;
    mountGroup.add(dish);

    // Feed Support Tripod Legs
    for (let i = 0; i < 3; i++) {
      const legGeo = new THREE.CylinderGeometry(0.4, 0.4, 22, 5);
      const leg = new THREE.Mesh(legGeo, frameMat);
      const ang = (i * Math.PI * 2) / 3;
      leg.position.set(Math.cos(ang) * 9, 7, Math.sin(ang) * 9);
      leg.rotation.x = 0.35 * Math.sin(ang);
      leg.rotation.z = -0.35 * Math.cos(ang);
      mountGroup.add(leg);
    }

    // Focal Point Sub-reflector & Receiver Horn
    const hornGeo = new THREE.OctahedronGeometry(2.2);
    const hornMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0284c7,
      flatShading: true
    });
    const horn = new THREE.Mesh(hornGeo, hornMat);
    horn.position.y = 15;
    mountGroup.add(horn);

    mountGroup.rotation.x = 0.4;
    group.add(mountGroup);

    // Base Pedestal Tower
    const baseGeo = new THREE.CylinderGeometry(5, 7, 18, 8);
    const base = new THREE.Mesh(baseGeo, frameMat);
    base.position.y = -12;
    group.add(base);

    // Blinking Active Observation Strobe
    const strobeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const strobe = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), strobeMat);
    strobe.position.set(0, 17, 0);
    mountGroup.add(strobe);

    group.userData = {
      id: "observatory",
      name: "Green Bank & Arecibo Array",
      radius: 30,
      time: 0,
      update(delta) {
        this.time += delta;
        // Slow realistic dish tracking slew
        mountGroup.rotation.y = Math.sin(this.time * 0.15) * 0.4;
        mountGroup.rotation.x = 0.4 + Math.cos(this.time * 0.1) * 0.15;
        strobe.visible = Math.sin(this.time * 4) > 0;
      }
    };

    scene.add(group);
    return group;
  },

  // --------------------------------------------------------------------------
  // 5. EARTH DEEP SPACE UPLINK RELAY
  // Communication dish with pulse beacon
  // --------------------------------------------------------------------------
  createEarthRelay(scene, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
      flatShading: true
    });

    const dishGeo = new THREE.CylinderGeometry(14, 2, 5, 12, 1, true);
    const dish = new THREE.Mesh(dishGeo, goldMat);
    dish.rotation.x = Math.PI / 2 + 0.25;
    group.add(dish);

    const towerGeo = new THREE.CylinderGeometry(1.5, 3, 16, 6);
    const tower = new THREE.Mesh(towerGeo, new THREE.MeshStandardMaterial({ color: 0x64748b, flatShading: true }));
    tower.position.y = -10;
    group.add(tower);

    // Expanding Earth Uplink Beacons
    const beaconRings = [];
    for (let i = 0; i < 3; i++) {
      const rGeo = new THREE.RingGeometry(1, 1.5, 16);
      const rMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.position.set(0, 1.5, 8 + i * 4);
      group.add(rMesh);
      beaconRings.push(rMesh);
    }

    group.userData = {
      id: "relay",
      name: "Earth Deep Space Relay",
      radius: 24,
      time: 0,
      update(delta) {
        this.time += delta;
        group.rotation.y = Math.sin(this.time * 0.25) * 0.2;
        beaconRings.forEach((r, idx) => {
          const t = (this.time * 1.6 + idx * 0.6) % 2.0;
          r.scale.set(1 + t * 4, 1 + t * 4, 1);
          r.position.z = 7 + t * 15;
          r.material.opacity = Math.max(0, 1 - t * 0.5);
        });
      }
    };

    scene.add(group);
    return group;
  },

  // --------------------------------------------------------------------------
  // 6. PULSAR TIMING ARRAY (PTA) TIMING GRID & BASELINES
  // Glowing laser timing baselines showing nanohertz gravitational wave strain
  // --------------------------------------------------------------------------
  createPTATimingGrid(scene, celestialObjects) {
    const gridGroup = new THREE.Group();
    const ptaLines = [];

    // Connect the radio observatory to the pulsars
    const obsPos = celestialObjects.observatory.position;
    const targets = [
      celestialObjects.j1713.position,
      celestialObjects.b1913.position,
      celestialObjects.magnetar.position,
      celestialObjects.relay.position
    ];

    targets.forEach((targetPos) => {
      const points = [];
      const segments = 40;
      for (let i = 0; i <= segments; i++) {
        const alpha = i / segments;
        const x = obsPos.x + (targetPos.x - obsPos.x) * alpha;
        const y = obsPos.y + (targetPos.y - obsPos.y) * alpha;
        const z = obsPos.z + (targetPos.z - obsPos.z) * alpha;
        points.push(new THREE.Vector3(x, y, z));
      }

      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.4
      });

      const line = new THREE.Line(lineGeo, lineMat);
      line.userData = {
        origPoints: points.map(p => p.clone()),
        obsPos: obsPos,
        targetPos: targetPos,
        segments: segments
      };

      gridGroup.add(line);
      ptaLines.push(line);
    });

    gridGroup.userData = {
      time: 0,
      update(delta) {
        this.time += delta;
        // Gravitational wave ripple modulation on the laser timing baselines
        ptaLines.forEach(line => {
          const posAttr = line.geometry.attributes.position;
          const orig = line.userData.origPoints;
          for (let i = 0; i <= line.userData.segments; i++) {
            const p = orig[i];
            const wave = Math.sin(this.time * 2.5 - i * 0.25) * 0.8;
            posAttr.setXYZ(i, p.x, p.y + wave, p.z);
          }
          posAttr.needsUpdate = true;
        });
      }
    };

    scene.add(gridGroup);
    return gridGroup;
  },

  // --------------------------------------------------------------------------
  // 7. ASTEROID BELT & DUST
  // --------------------------------------------------------------------------
  createAsteroidBelt(scene) {
    const group = new THREE.Group();
    const count = 75;
    const mat = new THREE.MeshStandardMaterial({ color: 0x475569, flatShading: true, roughness: 0.9 });
    const asteroids = [];

    for (let i = 0; i < count; i++) {
      const size = 1.0 + Math.random() * 3.2;
      const geo = new THREE.DodecahedronGeometry(size, 0);

      // Perturb vertices
      const pos = geo.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        pos.setXYZ(j,
          pos.getX(j) * (0.8 + Math.random() * 0.4),
          pos.getY(j) * (0.8 + Math.random() * 0.4),
          pos.getZ(j) * (0.8 + Math.random() * 0.4)
        );
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 80;

      mesh.position.set(
        Math.cos(angle) * dist,
        (Math.random() - 0.5) * 30,
        Math.sin(angle) * dist
      );

      mesh.userData = {
        speed: 0.04 + Math.random() * 0.06,
        angle: angle,
        dist: dist,
        rotX: (Math.random() - 0.5) * 0.6,
        rotY: (Math.random() - 0.5) * 0.6
      };

      group.add(mesh);
      asteroids.push(mesh);
    }

    group.userData = {
      update(delta) {
        asteroids.forEach(a => {
          a.rotation.x += a.userData.rotX * delta;
          a.rotation.y += a.userData.rotY * delta;
          a.userData.angle += a.userData.speed * delta * 0.1;
          a.position.x = Math.cos(a.userData.angle) * a.userData.dist;
          a.position.z = Math.sin(a.userData.angle) * a.userData.dist;
        });
      }
    };

    scene.add(group);
  },

  // --------------------------------------------------------------------------
  // 8. LOW-POLY FACETED NEBULA
  // --------------------------------------------------------------------------
  createCosmicNebula(scene) {
    const group = new THREE.Group();
    const colors = [0x0369a1, 0x4f46e5, 0x7c3aed, 0x9333ea];

    for (let i = 0; i < 16; i++) {
      const geo = new THREE.IcosahedronGeometry(50 + Math.random() * 35, 1);
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        wireframe: true,
        transparent: true,
        opacity: 0.1
      });
      const mesh = new THREE.Mesh(geo, mat);
      const th = Math.random() * Math.PI * 2;
      const ph = (Math.random() - 0.5) * Math.PI;
      const d = 260 + Math.random() * 120;

      mesh.position.set(
        d * Math.cos(ph) * Math.cos(th),
        d * Math.sin(ph),
        d * Math.cos(ph) * Math.sin(th)
      );
      group.add(mesh);
    }

    scene.add(group);
  }
};
