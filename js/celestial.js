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

  // Helper: Creates a conical beam whose apex (sharp point of radius 0) is at y = 0,
  // and which widens outward to radius R at y = +H.
  createExpandingBeamGeometry(radius, height, segments = 8) {
    const geo = new THREE.ConeGeometry(radius, height, segments, 1, true);
    // Three.js ConeGeometry has apex at +height/2 and base at -height/2.
    // Invert so apex is at -height/2 and base at +height/2:
    geo.rotateZ(Math.PI);
    // Translate so apex (single point, radius 0) sits exactly at origin (0,0,0):
    geo.translate(0, height / 2, 0);
    return geo;
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
      opacity: 0.35
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    group.add(shell);

    // Relativistic Polar Radiation Beams (Dual sweeping cones)
    // Both beams originate from a single point on the magnetic poles and flare outward!
    const beamGeo = this.createExpandingBeamGeometry(9, 80, 8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });

    const beamGroup = new THREE.Group();

    // North Beam: apex sits right at the north pole (y = 6.8), flaring outward into space (+Y)
    const northBeam = new THREE.Mesh(beamGeo, beamMat);
    northBeam.position.set(0, 6.8, 0);
    beamGroup.add(northBeam);

    // South Beam: apex sits right at the south pole (y = -6.8), rotated 180° flaring outward (-Y)
    const southBeam = new THREE.Mesh(beamGeo, beamMat);
    southBeam.position.set(0, -6.8, 0);
    southBeam.rotation.z = Math.PI;
    beamGroup.add(southBeam);

    // Magnetic axis inclination relative to rotational axis
    beamGroup.rotation.z = 0.45;
    group.add(beamGroup);

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

    // Primary Dual Sweeping Relativistic Beams (North and South)
    // Both beams emanate from a single point at the magnetic poles and flare outward
    const bBeamGeo = this.createExpandingBeamGeometry(6.5, 55, 8);
    const bBeamMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });

    const star1BeamGroup = new THREE.Group();

    const star1North = new THREE.Mesh(bBeamGeo, bBeamMat);
    star1North.position.set(0, 4.8, 0);
    star1BeamGroup.add(star1North);

    const star1South = new THREE.Mesh(bBeamGeo, bBeamMat);
    star1South.position.set(0, -4.8, 0);
    star1South.rotation.z = Math.PI;
    star1BeamGroup.add(star1South);

    star1BeamGroup.rotation.z = 0.35; // magnetic inclination tilt
    star1.add(star1BeamGroup);

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
  // Iconic combination of Green Bank (off-axis cantilevered feed arm & alidade)
  // and Arecibo (tri-tower cable-suspended instrument platform)
  // --------------------------------------------------------------------------
  createRadioObservatory(scene, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    const dishPanelMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      flatShading: true,
      metalness: 0.8,
      roughness: 0.25
    });

    const steelTrussMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      flatShading: true,
      metalness: 0.85,
      roughness: 0.35
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      flatShading: true,
      metalness: 0.9,
      roughness: 0.2
    });

    const receiverMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.6,
      flatShading: true,
      roughness: 0.3
    });

    // ------------------------------------------------------------------------
    // A. Steerable Dish & Green Bank Off-Axis Cantilever Structure
    // ------------------------------------------------------------------------
    const mountGroup = new THREE.Group();

    // 1. Primary Parabolic Reflector Dish (Faceted segmented bowl)
    const dishGeo = new THREE.CylinderGeometry(24, 4, 7, 20, 2, true);
    const dishMesh = new THREE.Mesh(dishGeo, dishPanelMat);
    dishMesh.rotation.x = Math.PI;
    mountGroup.add(dishMesh);

    // Outer structural rim girder
    const rimGeo = new THREE.TorusGeometry(24.2, 0.7, 5, 20);
    const rimMesh = new THREE.Mesh(rimGeo, steelTrussMat);
    rimMesh.rotation.x = Math.PI / 2;
    dishMesh.add(rimMesh);

    // Dish backup support truss framework (radial ribs under the dish)
    for (let r = 0; r < 8; r++) {
      const ribGeo = new THREE.BoxGeometry(0.5, 3.5, 22);
      const rib = new THREE.Mesh(ribGeo, steelTrussMat);
      rib.position.y = 2.0;
      rib.rotation.y = (r * Math.PI) / 8;
      dishMesh.add(rib);
    }

    // 2. Green Bank Iconic Cantilevered Off-Axis Feed Boom Arm
    // A massive triangular space-frame boom sweeping up from the southern rim over the dish
    const boomGroup = new THREE.Group();

    // Main lower arching struts
    const arm1Geo = new THREE.CylinderGeometry(0.7, 0.9, 28, 6);
    const arm1 = new THREE.Mesh(arm1Geo, steelTrussMat);
    arm1.position.set(-3.5, 14, -10);
    arm1.rotation.x = 0.55;
    arm1.rotation.z = -0.15;
    boomGroup.add(arm1);

    const arm2 = new THREE.Mesh(arm1Geo, steelTrussMat);
    arm2.position.set(3.5, 14, -10);
    arm2.rotation.x = 0.55;
    arm2.rotation.z = 0.15;
    boomGroup.add(arm2);

    // Upper converging boom reaching over the dish center
    const upperArmGeo = new THREE.CylinderGeometry(0.6, 0.7, 18, 5);
    const upperArm = new THREE.Mesh(upperArmGeo, steelTrussMat);
    upperArm.position.set(0, 24, -2);
    upperArm.rotation.x = -0.65;
    boomGroup.add(upperArm);

    // Cross brace trusses on the boom
    for (let b = 0; b < 3; b++) {
      const brace = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.4, 0.4), steelTrussMat);
      brace.position.set(0, 8 + b * 6, -16 + b * 4.5);
      boomGroup.add(brace);
    }

    // 3. Focal Cabin & Gregorian Subreflector (GBT / Arecibo Feed Dome)
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 22, 5);

    // Feed cabin housing
    const cabinGeo = new THREE.BoxGeometry(4.5, 3.5, 4.5);
    const cabin = new THREE.Mesh(cabinGeo, steelTrussMat);
    cabinGroup.add(cabin);

    // Gregorian subreflector dome
    const subReflectorGeo = new THREE.DodecahedronGeometry(2.4);
    const subReflector = new THREE.Mesh(subReflectorGeo, dishPanelMat);
    subReflector.position.set(0, -2.5, 0);
    cabinGroup.add(subReflector);

    // Multi-frequency receiver feed horns pointing at dish
    for (let h = 0; h < 3; h++) {
      const hornGeo = new THREE.ConeGeometry(0.6, 2.2, 6);
      const horn = new THREE.Mesh(hornGeo, receiverMat);
      const hAng = (h * Math.PI * 2) / 3;
      horn.position.set(Math.cos(hAng) * 1.2, -4.0, Math.sin(hAng) * 1.2);
      horn.rotation.x = Math.PI;
      cabinGroup.add(horn);
    }

    // Active pulsar receiver laser strobe
    const strobeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const strobe = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), strobeMat);
    strobe.position.set(0, -5.2, 0);
    cabinGroup.add(strobe);

    boomGroup.add(cabinGroup);
    mountGroup.add(boomGroup);

    // 4. Elevation Gear Sector (Bull gear arc underneath dish)
    const gearArcGeo = new THREE.TorusGeometry(8, 0.9, 4, 12, Math.PI);
    const gearArc = new THREE.Mesh(gearArcGeo, darkMetalMat);
    gearArc.position.set(0, -3, 0);
    gearArc.rotation.z = Math.PI / 2;
    mountGroup.add(gearArc);

    mountGroup.position.y = 4;
    mountGroup.rotation.x = 0.35;
    group.add(mountGroup);

    // ------------------------------------------------------------------------
    // B. Alidade Turret Base & Azimuth Ring Foundation
    // ------------------------------------------------------------------------
    const alidadeGroup = new THREE.Group();

    // Dual heavy A-frame upright pedestals
    for (let side = -1; side <= 1; side += 2) {
      const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.4, 16, 6), steelTrussMat);
      leg1.position.set(side * 8, -4, -4);
      leg1.rotation.x = 0.2;
      alidadeGroup.add(leg1);

      const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.4, 16, 6), steelTrussMat);
      leg2.position.set(side * 8, -4, 4);
      leg2.rotation.x = -0.2;
      alidadeGroup.add(leg2);
    }

    // Circular Azimuth Track Platform (Ring foundation)
    const azimuthRingGeo = new THREE.CylinderGeometry(14, 16, 3, 16);
    const azimuthRing = new THREE.Mesh(azimuthRingGeo, darkMetalMat);
    azimuthRing.position.y = -12;
    alidadeGroup.add(azimuthRing);

    group.add(alidadeGroup);

    // ------------------------------------------------------------------------
    // C. Arecibo-Style Tri-Tower Cable Suspension System
    // Three perimeter concrete towers with suspension cables to the feed cabin
    // ------------------------------------------------------------------------
    const towerRadius = 40;
    const towerHeight = 36;
    const towers = [];
    const cableLines = [];

    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      flatShading: true,
      roughness: 0.8
    });

    const cableMat = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.55
    });

    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    for (let t = 0; t < 3; t++) {
      const angle = (t * Math.PI * 2) / 3 + 0.5;
      const tx = Math.cos(angle) * towerRadius;
      const tz = Math.sin(angle) * towerRadius;

      const towerGroup = new THREE.Group();
      towerGroup.position.set(tx, -14, tz);

      // Main concrete column
      const colGeo = new THREE.CylinderGeometry(1.6, 2.8, towerHeight, 6);
      const col = new THREE.Mesh(colGeo, towerMat);
      col.position.y = towerHeight / 2;
      towerGroup.add(col);

      // Tower top crown platform
      const crown = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 4), darkMetalMat);
      crown.position.y = towerHeight;
      towerGroup.add(crown);

      // Blinking red aviation warning strobe beacon
      const beacon = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), beaconMat);
      beacon.position.y = towerHeight + 1.2;
      towerGroup.add(beacon);

      group.add(towerGroup);
      towers.push(towerGroup);

      // Suspension cable from tower top to feed cabin area
      const cablePoints = [
        new THREE.Vector3(tx, -14 + towerHeight, tz),
        new THREE.Vector3(0, 24, 4)
      ];
      const cableGeo = new THREE.BufferGeometry().setFromPoints(cablePoints);
      const cable = new THREE.Line(cableGeo, cableMat);
      group.add(cable);
      cableLines.push({ line: cable, towerPos: cablePoints[0] });
    }

    // ------------------------------------------------------------------------
    // D. Dynamic Update Hook
    // ------------------------------------------------------------------------
    group.userData = {
      id: "observatory",
      name: "Green Bank & Arecibo Array",
      radius: 34,
      time: 0,
      update(delta) {
        this.time += delta;

        // Smooth slow realistic dish azimuth tracking & elevation slew
        mountGroup.rotation.y = Math.sin(this.time * 0.12) * 0.35;
        mountGroup.rotation.x = 0.35 + Math.cos(this.time * 0.08) * 0.12;

        // Pulsing receiver strobe
        strobe.visible = Math.sin(this.time * 6) > 0;

        // Aviation beacons flash
        const beaconOn = Math.sin(this.time * 3) > 0.2;
        beaconMat.color.set(beaconOn ? 0xef4444 : 0x220505);

        // Update suspension cables connected to moving feed cabin
        const cabinWorldPos = new THREE.Vector3();
        cabinGroup.getWorldPosition(cabinWorldPos);
        const cabinLocalPos = group.worldToLocal(cabinWorldPos.clone());

        cableLines.forEach(c => {
          const posAttr = c.line.geometry.attributes.position;
          posAttr.setXYZ(0, c.towerPos.x, c.towerPos.y, c.towerPos.z);
          posAttr.setXYZ(1, cabinLocalPos.x, cabinLocalPos.y, cabinLocalPos.z);
          posAttr.needsUpdate = true;
        });
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
