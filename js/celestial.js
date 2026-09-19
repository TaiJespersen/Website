// ============================================================================
// 3D LOW-POLY CELESTIAL OBJECTS & PTA UNIVERSE (THREE.JS)
// Focus: Neutron Stars, Millisecond Pulsars, Binary Pulsars, Magnetars, Radiotelescopes
// ============================================================================

window.AstroCelestial = {
  createUniverse(scene) {
    const celestialObjects = {};

    // 1. Millisecond Pulsar: PSR J1713+0747 (NANOGrav Benchmark Clock)
    celestialObjects.j1713 = this.createMillisecondPulsar(scene, { x: -80, y: 15, z: -60 });

    // 2. Relativistic Binary Black Holes: Two orbiting low-poly black holes
    celestialObjects.b1913 = this.createBinaryBlackHoles(scene, { x: 85, y: -20, z: -75 });

    // 3. Orbital Radio Observatory: Green Bank 100m
    celestialObjects.observatory = this.createRadioObservatory(scene, { x: 0, y: 5, z: -150 });

    // 4. Pulsar Timing Array (PTA) Cosmic Timing Grid & Baselines
    celestialObjects.ptaGrid = this.createPTATimingGrid(scene, celestialObjects);

    // 5. Background Telescopes (Non-interactable, rotating in deep background)
    celestialObjects.parkes = this.createParkesPlanet(scene, { x: -400, y: -200, z: 300 });
    celestialObjects.arecibo = this.createAreciboPlanet(scene, { x: 305, y: -10, z: 150 });
    celestialObjects.dsa2000 = this.createDSA2000Cluster(scene, { x: 145, y: 55, z: 330 });

    // 6. Ambient Asteroids & Low-Poly Cosmic Dust (Cleared from starting sightlines)
    this.createAsteroidBelt(scene);

    // 7. Glowing Destiny 2-Aesthetic Cosmic Nebulae
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

    // Dynamic Point Light to illuminate surrounding space brightly
    const light = new THREE.PointLight(0x00f0ff, 3.5, 140);
    group.add(light);

    // Ultra-dense Faceted Neutron Core
    const coreGeo = new THREE.IcosahedronGeometry(7, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.4,
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
      opacity: 0.45
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    group.add(shell);

    // Relativistic Polar Radiation Beams (Dual sweeping cones)
    // Both beams originate from a single point on the magnetic poles and flare outward!
    const beamGeo = this.createExpandingBeamGeometry(9.5, 85, 8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      wireframe: true,
      transparent: true,
      opacity: 0.85
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
      name: "Pulsar Timing",
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
  // 2. RELATIVISTIC BINARY BLACK HOLES (GW150914 / SUPERMASSIVE BINARY ANALOG)
  // Two detailed low-poly black holes with event horizons, glowing accretion disks,
  // gravitational lensing arcs, tidal plasma bridge, and propagating GW ripples
  // --------------------------------------------------------------------------
  createBinaryBlackHoles(scene, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    // Warm, intense point light radiating from the mutual accretion zone
    const light = new THREE.PointLight(0xf59e0b, 3.8, 160);
    group.add(light);

    // Helper: Build a single detailed low-poly black hole with horizon, disk & lensing arc
    const createSingleBlackHole = (radius, diskColorInner, diskColorOuter, tiltX, tiltZ) => {
      const bhGroup = new THREE.Group();

      // A. Event Horizon: True pitch-black faceted void absorbing light
      const horizonGeo = new THREE.IcosahedronGeometry(radius, 2);
      const horizonMat = new THREE.MeshBasicMaterial({
        color: 0x010204
      });
      const horizon = new THREE.Mesh(horizonGeo, horizonMat);
      bhGroup.add(horizon);

      // B. Relativistic Ergosphere / Gravitational Wireframe Shell
      const ergoGeo = new THREE.IcosahedronGeometry(radius * 1.22, 1);
      const ergoMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        wireframe: true,
        transparent: true,
        opacity: 0.28
      });
      const ergo = new THREE.Mesh(ergoGeo, ergoMat);
      bhGroup.add(ergo);

      // C. Inner Photon Ring (Luminous border where photons orbit unstable paths)
      const photonGeo = new THREE.TorusGeometry(radius * 1.05, 0.12, 6, 28);
      const photonMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95
      });
      const photonRing = new THREE.Mesh(photonGeo, photonMat);
      photonRing.rotation.x = Math.PI / 2;
      bhGroup.add(photonRing);

      // D. Accretion Disk Assembly (Tilted low-poly swirling plasma)
      const diskGroup = new THREE.Group();
      diskGroup.rotation.x = tiltX;
      diskGroup.rotation.z = tiltZ;

      // Inner White-Hot Ring
      const innerDiskGeo = new THREE.RingGeometry(radius * 1.15, radius * 2.2, 24, 1);
      const innerDiskMat = new THREE.MeshStandardMaterial({
        color: diskColorInner,
        emissive: diskColorInner,
        emissiveIntensity: 1.6,
        flatShading: true,
        roughness: 0.3,
        side: THREE.DoubleSide
      });
      const innerDisk = new THREE.Mesh(innerDiskGeo, innerDiskMat);
      innerDisk.rotation.x = Math.PI / 2;
      diskGroup.add(innerDisk);

      // Outer Fiery Plasma Rim
      const outerDiskGeo = new THREE.RingGeometry(radius * 2.15, radius * 3.4, 24, 2);
      const outerDiskMat = new THREE.MeshStandardMaterial({
        color: diskColorOuter,
        emissive: diskColorOuter,
        emissiveIntensity: 0.9,
        flatShading: true,
        roughness: 0.4,
        side: THREE.DoubleSide
      });
      const outerDisk = new THREE.Mesh(outerDiskGeo, outerDiskMat);
      outerDisk.rotation.x = Math.PI / 2;
      diskGroup.add(outerDisk);

      // Outer dust ring wireframe accents
      const dustRingGeo = new THREE.TorusGeometry(radius * 3.35, 0.2, 4, 24);
      const dustRingMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.5
      });
      const dustRing = new THREE.Mesh(dustRingGeo, dustRingMat);
      dustRing.rotation.x = Math.PI / 2;
      diskGroup.add(dustRing);

      bhGroup.add(diskGroup);

      // E. Gravitational Lensing Halo (Curved optical illusion arc over the poles)
      const lensGroup = new THREE.Group();
      lensGroup.rotation.x = tiltX;
      lensGroup.rotation.z = tiltZ;

      const upperArcGeo = new THREE.TorusGeometry(radius * 1.9, 0.28, 6, 20, Math.PI);
      const lensMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.65
      });
      const upperArc = new THREE.Mesh(upperArcGeo, lensMat);
      upperArc.position.y = 0.2;
      lensGroup.add(upperArc);

      const lowerArcGeo = new THREE.TorusGeometry(radius * 1.9, 0.28, 6, 20, Math.PI);
      const lowerArc = new THREE.Mesh(lowerArcGeo, lensMat);
      lowerArc.rotation.x = Math.PI;
      lowerArc.position.y = -0.2;
      lensGroup.add(lowerArc);

      bhGroup.add(lensGroup);

      return {
        group: bhGroup,
        ergo,
        diskGroup,
        lensGroup
      };
    };

    // Primary Black Hole (Larger mass M1)
    const bh1 = createSingleBlackHole(4.4, 0xfef08a, 0xe11d48, 0.35, 0.15);
    group.add(bh1.group);

    // Secondary Black Hole (Companion mass M2)
    const bh2 = createSingleBlackHole(3.3, 0xfde047, 0xd97706, -0.3, -0.25);
    group.add(bh2.group);

    // Tidal Relativistic Plasma Bridge connecting the two black holes
    const bridgePoints = [];
    for (let i = 0; i <= 16; i++) {
      bridgePoints.push(new THREE.Vector3(0, 0, 0));
    }
    const bridgeGeo = new THREE.BufferGeometry().setFromPoints(bridgePoints);
    const bridgeMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85
    });
    const bridgeLine = new THREE.Line(bridgeGeo, bridgeMat);
    group.add(bridgeLine);

    // Expanding Gravitational Wave Quadrupole Ripples (Spacetime distortions)
    const gwRipples = [];
    for (let i = 0; i < 5; i++) {
      const rGeo = new THREE.RingGeometry(8 + i * 7, 9.6 + i * 7, 24);
      const rMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.rotation.x = Math.PI / 2;
      group.add(rMesh);
      gwRipples.push(rMesh);
    }

    group.userData = {
      id: "b1913",
      name: "Gravitational Waves",
      radius: 34,
      time: 0,
      orbitRadius1: 13.5,
      orbitRadius2: 17.0,
      update(delta) {
        this.time += delta;
        const orbitSpeed = 1.25;
        const angle = this.time * orbitSpeed;

        // Dynamic Keplerian orbital positions around barycenter
        const x1 = Math.cos(angle) * this.orbitRadius1;
        const z1 = Math.sin(angle) * this.orbitRadius1;
        const y1 = Math.sin(angle * 2) * 2.2;
        bh1.group.position.set(x1, y1, z1);

        const x2 = -Math.cos(angle) * this.orbitRadius2;
        const z2 = -Math.sin(angle) * this.orbitRadius2;
        const y2 = -Math.sin(angle * 2) * 2.2;
        bh2.group.position.set(x2, y2, z2);

        // Intrinsic rotations (Accretion disk spin & ergosphere dragging)
        bh1.diskGroup.rotation.y += delta * 3.8;
        bh1.ergo.rotation.y += delta * 2.2;
        bh1.ergo.rotation.z += delta * 1.1;

        bh2.diskGroup.rotation.y += delta * 4.6;
        bh2.ergo.rotation.y += delta * 2.6;
        bh2.ergo.rotation.x -= delta * 1.4;

        // Dynamic Tidal Plasma Bridge between the two horizons
        const posAttr = bridgeLine.geometry.attributes.position;
        for (let i = 0; i <= 16; i++) {
          const t = i / 16;
          // Cubic Bezier-like curve curving through barycenter
          const cx = (1 - t) * x1 + t * x2;
          const cy = (1 - t) * y1 + t * y2 + Math.sin(t * Math.PI + this.time * 4) * 2.5;
          const cz = (1 - t) * z1 + t * z2;
          posAttr.setXYZ(i, cx, cy, cz);
        }
        posAttr.needsUpdate = true;

        // Animate gravitational wave ripples expanding outward from barycenter
        gwRipples.forEach((r, idx) => {
          const t = (this.time * 0.75 + idx * 0.4) % 2.0;
          r.scale.set(1 + t * 2.4, 1 + t * 2.4, 1);
          r.material.opacity = Math.max(0, 0.7 - t * 0.32);
        });
      }
    };

    scene.add(group);
    return group;
  },

  // Backward compatibility alias
  createBinaryPulsar(scene, pos) {
    return this.createBinaryBlackHoles(scene, pos);
  },

  // --------------------------------------------------------------------------
  // 3. PLANETARY RADIO OBSERVATORY: GREEN BANK TELESCOPE (GBT)
  // Low-poly terrestrial planet with the 100m Green Bank Telescope on a mountain plateau
  // --------------------------------------------------------------------------
  createRadioObservatory(scene, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    // Dynamic Point Light illuminating the planet and observatory
    const light = new THREE.PointLight(0xa855f7, 3.5, 140);
    group.add(light);

    // ------------------------------------------------------------------------
    // A. The Host Planet (Terrestrial mountain world)
    // ------------------------------------------------------------------------
    const planetGroup = new THREE.Group();

    const planetGeo = new THREE.IcosahedronGeometry(20, 2);
    // Vertex colors for Appalachian mountain ridges and valleys
    const count = planetGeo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    const posAttr = planetGeo.attributes.position;

    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i);
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const elevation = Math.sin(x * 0.3) + Math.cos(z * 0.3) + (y / 20.0);

      if (y > 14) {
        // High mountain plateau (where the observatory is situated) - granite slate
        colors[i * 3] = 0.55; colors[i * 3 + 1] = 0.60; colors[i * 3 + 2] = 0.68;
      } else if (elevation > 0.4) {
        // Mountain forest ridge - deep pine green
        colors[i * 3] = 0.12; colors[i * 3 + 1] = 0.42; colors[i * 3 + 2] = 0.28;
      } else if (elevation > -0.3) {
        // Valley terrain - warm moss/earth
        colors[i * 3] = 0.22; colors[i * 3 + 1] = 0.38; colors[i * 3 + 2] = 0.22;
      } else {
        // Deep mountain lake / basin - deep alpine blue
        colors[i * 3] = 0.08; colors[i * 3 + 1] = 0.24; colors[i * 3 + 2] = 0.45;
      }
    }
    planetGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const planetMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.85,
      metalness: 0.15
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planetMesh);

    // Subtle atmospheric glow shell around planet
    const atmosGeo = new THREE.IcosahedronGeometry(21.4, 1);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const atmos = new THREE.Mesh(atmosGeo, atmosMat);
    planetGroup.add(atmos);

    // ------------------------------------------------------------------------
    // B. The Green Bank Telescope (GBT 100m) - Scaled to sit on mountain summit
    // ------------------------------------------------------------------------
    const gbtGroup = new THREE.Group();
    gbtGroup.position.set(0, 19.4, 0); // Positioned atop the northern summit plateau

    const dishPanelMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      flatShading: true,
      metalness: 0.8,
      roughness: 0.2,
      side: THREE.DoubleSide
    });

    const steelTrussMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      flatShading: true,
      metalness: 0.85,
      roughness: 0.3
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      flatShading: true,
      metalness: 0.9,
      roughness: 0.25
    });

    // 1. Concrete Foundation Ring & Azimuth Track on the mountain
    const foundationGeo = new THREE.CylinderGeometry(5.5, 6.2, 1.2, 12);
    const foundation = new THREE.Mesh(foundationGeo, darkMetalMat);
    foundation.position.y = 0.6;
    gbtGroup.add(foundation);

    // Azimuth rotating track ring
    const trackRing = new THREE.Mesh(new THREE.TorusGeometry(5.0, 0.3, 4, 16), steelTrussMat);
    trackRing.rotation.x = Math.PI / 2;
    trackRing.position.y = 1.3;
    gbtGroup.add(trackRing);

    // 2. Alidade A-Frame Turret (Rotating mount)
    const alidadeTurret = new THREE.Group();
    alidadeTurret.position.y = 1.4;

    for (let side = -1; side <= 1; side += 2) {
      const legA = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 6.5, 5), steelTrussMat);
      legA.position.set(side * 4.5, 3.2, -1.4); // Pushed outward
      legA.rotation.x = 0.22;
      legA.rotation.z = side * -0.2; // Added an outward lean to brace the wide dish
      alidadeTurret.add(legA);
    
      const legB = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 6.5, 5), steelTrussMat);
      legB.position.set(side * 4.5, 3.2, 1.4); // Pushed outward
      legB.rotation.x = -0.22;
      legB.rotation.z = side * -0.2; // Added an outward lean
      alidadeTurret.add(legB);
    }

    // 3. Steerable Parabolic Dish & Off-Axis Cantilever Boom
    const dishMount = new THREE.Group();
    dishMount.position.set(0, 6.4, 0);

    // Elevation Bull Gear Sector underneath dish
    const bullGear = new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.35, 4, 10, Math.PI), darkMetalMat);
    bullGear.rotation.z = Math.PI; // Hanging downward
    dishMount.add(bullGear);

    // Primary Off-Axis Parabolic Reflector (White segmented dish)
    const dishGeo = new THREE.CylinderGeometry(7.8, 1.8, 2.4, 16, 2, true);
    const dishMesh = new THREE.Mesh(dishGeo, dishPanelMat);
    //dishMesh.rotation.x = Math.PI;
    dishMesh.position.y = 0.5;
    dishMount.add(dishMesh);

    // Flat bottom cap to fill in the hole
    const capGeo = new THREE.CircleGeometry(1.8, 16);
    const capMesh = new THREE.Mesh(capGeo, dishPanelMat);
    capMesh.rotation.x = Math.PI / 2; // Rotate it to lay flat
    capMesh.position.y = -1.2; // Position it at the bottom edge of the cylinder
    dishMesh.add(capMesh);

    // Outer rim truss
    const rim = new THREE.Mesh(new THREE.TorusGeometry(7.9, 0.25, 4, 16), steelTrussMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.2;
    dishMesh.add(rim);

    // 4. Iconic Green Bank Cantilevered Off-Axis Boom Arm
    const boomGroup = new THREE.Group();

    // Lengthened legs to span from the outer rim to the dish center
    const boomLeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 11.5, 5), steelTrussMat);
    boomLeg1.position.set(-0.8, 5.6, -3.6); 
    boomLeg1.rotation.x = 0.75; // Leaning heavily forward
    boomLeg1.rotation.z = -0.15; // Leaning inward
    boomGroup.add(boomLeg1);

    const boomLeg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 11.5, 5), steelTrussMat);
    boomLeg2.position.set(0.8, 5.6, -3.6);
    boomLeg2.rotation.x = 0.75;
    boomLeg2.rotation.z = 0.15;
    boomGroup.add(boomLeg2);
  
    // Focal Cabin & Gregorian Subreflector (Mounted directly to the main boom legs)
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), steelTrussMat);
    
    // Positioned perfectly over the very center of the dish bowl
    cabin.position.set(0, 10.0, 0.2);  
    cabin.rotation.x = -0.25; // Tilted downward so the receiver stares into the center of the dish
    
    const subReflector = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8), dishPanelMat);
    subReflector.position.set(0, -0.8, 0);
    cabin.add(subReflector);
    
    // Active receiver laser strobe
    const strobeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const strobe = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), strobeMat);
    strobe.position.set(0, -1.6, 0);
    cabin.add(strobe);
    
    boomGroup.add(cabin);

    dishMount.add(boomGroup); // Attaching it back to the dish!

    dishMount.rotation.x = 0.35;
    alidadeTurret.add(dishMount);
    gbtGroup.add(alidadeTurret);

    // 5. Small Observatory Campus Building & Antenna Mast on Plateau
    const campusBuilding = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 3.2), steelTrussMat);
    campusBuilding.position.set(5.2, 0.6, -1.5);
    gbtGroup.add(campusBuilding);

    const antennaMast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 4.5, 4), darkMetalMat);
    antennaMast.position.set(5.2, 3.2, -1.5);
    gbtGroup.add(antennaMast);

    const redBeacon = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    redBeacon.position.set(5.2, 5.5, -1.5);
    gbtGroup.add(redBeacon);

    planetGroup.add(gbtGroup);
    group.add(planetGroup);

    // ------------------------------------------------------------------------
    // C. Dynamic Update Hook
    // ------------------------------------------------------------------------
    group.userData = {
      id: "observatory",
      name: "Radio Pulsar Searching",
      radius: 30,
      time: 0,
      update(delta) {
        this.time += delta;

        // Slow planet diurnal rotation
        planetGroup.rotation.y += delta * 0.04;

        // GBT dish slow realistic tracking slew in azimuth and elevation
        alidadeTurret.rotation.y = Math.sin(this.time * 0.15) * 0.45;
        dishMount.rotation.x = 0.35 + Math.cos(this.time * 0.1) * 0.15;

        // Receiver strobe flash
        strobe.visible = Math.sin(this.time * 6) > 0;
        redBeacon.visible = Math.sin(this.time * 3) > 0;
      }
    };

    scene.add(group);
    return group;
  },


  // --------------------------------------------------------------------------
  // 4. PULSAR TIMING ARRAY (PTA) TIMING GRID & BASELINES
  // Glowing laser timing baselines showing nanohertz gravitational wave strain
  // --------------------------------------------------------------------------
  createPTATimingGrid(scene, celestialObjects) {
    const gridGroup = new THREE.Group();
    const ptaLines = [];

    // Connect the radio observatory to the pulsars
    const obsPos = celestialObjects.observatory.position.clone();
    obsPos.y += 29.4;
    
    const targets = [
      celestialObjects.j1713.position,
      celestialObjects.b1913.position,
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
        opacity: 0.55
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
  // 5. DISTANT BACKGROUND TELESCOPE PLANET: PARKES OBSERVATORY ("THE DISH")
  // Australian outback terracotta world with the iconic 64m steerable parabolic dish
  // (Non-interactable, slow planetary diurnal rotation)
  // --------------------------------------------------------------------------
  createParkesPlanet(scene, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    const planetGroup = new THREE.Group();

    // A. Outback Terrestrial Planet (Terracotta / Ochre low-poly landscape)
    const planetGeo = new THREE.IcosahedronGeometry(17, 2);
    const count = planetGeo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    const posAttr = planetGeo.attributes.position;

    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i);
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const elevation = Math.sin(x * 0.35) + Math.cos(z * 0.35) + (y / 17.0);

      if (y > 11) {
        // High observatory mesa plateau (Slate terracotta)
        colors[i * 3] = 0.76; colors[i * 3 + 1] = 0.42; colors[i * 3 + 2] = 0.25;
      } else if (elevation > 0.3) {
        // Red dirt mountain ridge (Deep iron outback red)
        colors[i * 3] = 0.72; colors[i * 3 + 1] = 0.26; colors[i * 3 + 2] = 0.12;
      } else if (elevation > -0.3) {
        // Desert plains (Warm sand/ochre)
        colors[i * 3] = 0.85; colors[i * 3 + 1] = 0.52; colors[i * 3 + 2] = 0.18;
      } else {
        // Salt flats / dry lake beds (Pale chalk ochre)
        colors[i * 3] = 0.92; colors[i * 3 + 1] = 0.78; colors[i * 3 + 2] = 0.58;
      }
    }
    planetGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const planetMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.9,
      metalness: 0.1
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planetMesh);

    // Warm peach/gold atmospheric shell
    const atmosGeo = new THREE.IcosahedronGeometry(18.2, 1);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0xfdba74,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    planetGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

    // B. The Parkes 64-Meter Radio Telescope ("The Dish")
    const dishGroup = new THREE.Group();
    dishGroup.position.set(0, 16.5, 0); // Positioned atop the northern mesa

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      flatShading: true,
      metalness: 0.75,
      roughness: 0.25,
      side: THREE.DoubleSide
    });
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      flatShading: true,
      roughness: 0.8
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      flatShading: true,
      metalness: 0.85,
      roughness: 0.3
    });

    // Concrete Tower Base
    const baseTower = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.2, 3.2, 8), concreteMat);
    baseTower.position.y = 1.6;
    dishGroup.add(baseTower);

    // Steerable Turret & Alidade
    const turret = new THREE.Group();
    turret.position.y = 3.2;

    const turretBox = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.4, 2.4), steelMat);
    turretBox.position.y = 0.7;
    turret.add(turretBox);

    // Parabolic Dish Bowl
    const dishAssembly = new THREE.Group();
    dishAssembly.position.y = 1.6;

    const dishMesh = new THREE.Mesh(new THREE.CylinderGeometry(6.6, 1.4, 2.2, 16, 2, true), whiteMat);
    dishMesh.position.y = 1.1;
    dishAssembly.add(dishMesh);

    const dishCap = new THREE.Mesh(new THREE.CircleGeometry(1.4, 16), whiteMat);
    dishCap.rotation.x = Math.PI / 2;
    dishMesh.add(dishCap);

    // Outer rim truss
    const rim = new THREE.Mesh(new THREE.TorusGeometry(6.7, 0.22, 4, 16), steelMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.1;
    dishMesh.add(rim);

    // Quadripod Focus Support Struts (Converging to prime focus cabin)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 6.4, 4), steelMat);
      strut.position.set(Math.cos(angle) * 3.4, 4.2, Math.sin(angle) * 3.4);
      strut.rotation.x = Math.sin(angle) * -0.45;
      strut.rotation.z = Math.cos(angle) * 0.45;
      dishAssembly.add(strut);
    }

    // Prime Focus Cabin
    const focusCabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.2), whiteMat);
    focusCabin.position.set(0, 6.8, 0);
    dishAssembly.add(focusCabin);

    // Red beacon
    const beacon = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    beacon.position.set(0, 7.5, 0);
    dishAssembly.add(beacon);

    dishAssembly.rotation.x = 0.3; // Pointed towards galactic plane
    turret.add(dishAssembly);
    dishGroup.add(turret);
    planetGroup.add(dishGroup);
    group.add(planetGroup);

    group.userData = {
      nonInteractive: true,
      time: 0,
      update(delta) {
        this.time += delta;
        planetGroup.rotation.y += delta * 0.22; // Diurnal rotation
        turret.rotation.y = Math.sin(this.time * 0.12) * 0.35; // Azimuth tracking
        dishAssembly.rotation.x = 0.3 + Math.cos(this.time * 0.08) * 0.12;
        beacon.visible = Math.sin(this.time * 4) > 0;
      }
    };

    scene.add(group);
    return group;
  },

  // --------------------------------------------------------------------------
  // 6. DISTANT BACKGROUND TELESCOPE PLANET: ARECIBO (OVERGROWN & RUINED)
  // Lush jungle karst world featuring the giant collapsed 305m sinkhole dish
  // overgrown with moss, broken towers, and fallen triangular platform
  // (Non-interactable, slow planetary diurnal rotation)
  // --------------------------------------------------------------------------
  createAreciboPlanet(scene, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    const planetGroup = new THREE.Group();

    // A. Tropical Jungle Karst Planet
    const planetGeo = new THREE.IcosahedronGeometry(18, 2);
    const count = planetGeo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    const posAttr = planetGeo.attributes.position;

    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i);
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const elevation = Math.sin(x * 0.4) + Math.cos(z * 0.4) + (y / 18.0);

      if (y > 12) {
        // Karst limestone cliffs surrounding the sinkhole
        colors[i * 3] = 0.32; colors[i * 3 + 1] = 0.38; colors[i * 3 + 2] = 0.42;
      } else if (elevation > 0.3) {
        // Lush tropical rainforest canopy (Emerald / jade)
        colors[i * 3] = 0.04; colors[i * 3 + 1] = 0.45; colors[i * 3 + 2] = 0.22;
      } else if (elevation > -0.3) {
        // Deep mossy jungle valley
        colors[i * 3] = 0.09; colors[i * 3 + 1] = 0.32; colors[i * 3 + 2] = 0.15;
      } else {
        // Tropical lagoon / river basin
        colors[i * 3] = 0.05; colors[i * 3 + 1] = 0.22; colors[i * 3 + 2] = 0.35;
      }
    }
    planetGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const planetMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.85,
      metalness: 0.15
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planetMesh);

    // Misty turquoise jungle atmosphere
    const atmosGeo = new THREE.IcosahedronGeometry(19.2, 1);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    planetGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

    // B. The Overgrown & Ruined Arecibo Telescope
    const areciboGroup = new THREE.Group();
    areciboGroup.position.set(0, 16.8, 0); // Northern karst plateau

    const mossMat = new THREE.MeshStandardMaterial({
      color: 0x166534,
      flatShading: true,
      roughness: 0.95
    });
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      flatShading: true,
      roughness: 0.9
    });
    const ruinedMetalMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      flatShading: true,
      roughness: 0.6,
      metalness: 0.5
    });
    const dishWeatheredMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      flatShading: true,
      roughness: 0.7,
      metalness: 0.4,
      side: THREE.DoubleSide
    });

    // 1. Natural Sinkhole Depression & Giant Spherical Reflector Dish
    const dishGeo = new THREE.CylinderGeometry(7.6, 2.0, 2.2, 16, 2, true);
    const dishMesh = new THREE.Mesh(dishGeo, dishWeatheredMat);
    dishMesh.position.y = 0.8;
    areciboGroup.add(dishMesh);

    const dishFloor = new THREE.Mesh(new THREE.CircleGeometry(2.0, 16), dishWeatheredMat);
    dishFloor.rotation.x = Math.PI / 2;
    dishFloor.position.y = -0.3;
    dishMesh.add(dishFloor);

    // Overgrown Moss Patches inside the dish bowl
    for (let i = 0; i < 7; i++) {
      const mossPatch = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7 + Math.random() * 0.6, 0), foliageMat);
      const angle = (i / 7) * Math.PI * 2;
      const r = 2.2 + Math.random() * 4.2;
      mossPatch.position.set(Math.cos(angle) * r, 0.4 + (r / 7.6) * 1.5, Math.sin(angle) * r);
      dishMesh.add(mossPatch);
    }

    // 2. Concrete Cable Suspension Towers (2 standing with snapped cables, 1 collapsed)
    const towerRadius = 9.2;
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const towerGroup = new THREE.Group();
      towerGroup.position.set(Math.cos(angle) * towerRadius, 0.6, Math.sin(angle) * towerRadius);

      if (i === 2) {
        // Collapsed / Toppled Tower
        const collapsedTower = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.65, 7.5, 5), ruinedMetalMat);
        collapsedTower.rotation.z = 0.85; // Toppled inward toward dish
        collapsedTower.position.y = 2.0;
        towerGroup.add(collapsedTower);

        // Greenery covering the fallen tower
        const creepers = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 0), mossMat);
        creepers.position.set(1.5, 2.0, 0);
        towerGroup.add(creepers);
      } else {
        // Standing Towers with snapped dangling cable remnants
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.65, 8.2, 5), ruinedMetalMat);
        tower.position.y = 4.1;
        towerGroup.add(tower);

        // Broken cable remnant dangling into the bowl
        const cableGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 7.8, 0),
          new THREE.Vector3(-Math.cos(angle) * 3.5, 3.5, -Math.sin(angle) * 3.5),
          new THREE.Vector3(-Math.cos(angle) * 5.0, 1.2, -Math.sin(angle) * 5.0)
        ]);
        const cable = new THREE.Line(cableGeo, new THREE.LineBasicMaterial({ color: 0x334155 }));
        towerGroup.add(cable);
      }
      areciboGroup.add(towerGroup);
    }

    // 3. Iconic Collapsed Triangular Feed Platform (Crumpled inside dish bowl)
    const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.7, 3), ruinedMetalMat);
    platform.position.set(0.6, 1.2, -0.4);
    platform.rotation.set(0.35, 0.4, -0.25); // Tilted and crumpled in the bottom of the dish
    areciboGroup.add(platform);

    // Gregorian Dome ruined sphere partially buried
    const dome = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 1), dishWeatheredMat);
    dome.position.set(1.4, 0.8, -0.2);
    areciboGroup.add(dome);

    // Overgrown vines enveloping the crashed platform
    const platformMoss = new THREE.Mesh(new THREE.DodecahedronGeometry(1.3, 0), mossMat);
    platformMoss.position.set(0.2, 1.4, -0.3);
    areciboGroup.add(platformMoss);

    planetGroup.add(areciboGroup);
    group.add(planetGroup);

    group.userData = {
      nonInteractive: true,
      update(delta) {
        planetGroup.rotation.y += delta * 0.019; // Slow peaceful diurnal rotation
      }
    };

    scene.add(group);
    return group;
  },

  // --------------------------------------------------------------------------
  // 7. DISTANT BACKGROUND TELESCOPE CLUSTER: DSA-2000 ARRAY PLANET CLUSTER
  // A triad of rocky planetoids/moons carrying synchronized receivers of the
  // Deep Synoptic Array 2000 radio interferometer
  // (Non-interactable, orbiting mutual barycenter)
  // --------------------------------------------------------------------------
  createDSA2000Cluster(scene, pos) {
    const clusterGroup = new THREE.Group();
    clusterGroup.position.set(pos.x, pos.y, pos.z);

    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      flatShading: true,
      metalness: 0.85,
      roughness: 0.2,
      side: THREE.DoubleSide
    });
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      flatShading: true,
      roughness: 0.5
    });

    // Helper: Mount miniature DSA-2000 radio dishes across a celestial body
    const populateArrayDishes = (bodyGroup, bodyRadius, count) => {
      for (let i = 0; i < count; i++) {
        const dishUnit = new THREE.Group();

        // Spherical distribution on upper hemisphere
        const phi = Math.acos(0.25 + Math.random() * 0.7);
        const theta = Math.random() * Math.PI * 2;

        const x = bodyRadius * Math.sin(phi) * Math.cos(theta);
        const y = bodyRadius * Math.cos(phi);
        const z = bodyRadius * Math.sin(phi) * Math.sin(theta);

        dishUnit.position.set(x, y, z);

        // Orient perpendicular to surface
        const normal = new THREE.Vector3(x, y, z).normalize();
        dishUnit.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

        // Mount Pedestal
        const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.5, 6), pedestalMat);
        ped.position.y = 0.25;
        dishUnit.add(ped);

        // Miniature Parabolic Dish (5m-scale DSA-2000 antenna)
        const dish = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.22, 0.38, 8, 1, true), dishMat);
        dish.position.y = 0.55;
        // Synchronized pointing towards deep space (+Z / core)
        dish.rotation.x = 0.25;
        dishUnit.add(dish);

        const subreflector = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 4), pedestalMat);
        subreflector.position.y = 0.75;
        dishUnit.add(subreflector);

        bodyGroup.add(dishUnit);
      }
    };

    // Body 1: Primary Cratered Chondrite Moon (Slate grey)
    const body1Group = new THREE.Group();
    const body1 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(9.5, 2),
      new THREE.MeshStandardMaterial({ color: 0x64748b, flatShading: true, roughness: 0.9 })
    );
    body1Group.add(body1);
    populateArrayDishes(body1Group, 9.5, 12);
    clusterGroup.add(body1Group);

    // Body 2: Basalt Planetoid (Dark charcoal / volcanic)
    const body2Group = new THREE.Group();
    const body2 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(7.2, 1),
      new THREE.MeshStandardMaterial({ color: 0x334155, flatShading: true, roughness: 0.85 })
    );
    body2Group.add(body2);
    populateArrayDishes(body2Group, 7.2, 8);
    clusterGroup.add(body2Group);

    // Body 3: Iron Chondrite Moonlet (Warm rust)
    const body3Group = new THREE.Group();
    const body3 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(5.4, 1),
      new THREE.MeshStandardMaterial({ color: 0x78350f, flatShading: true, roughness: 0.9 })
    );
    body3Group.add(body3);
    populateArrayDishes(body3Group, 5.4, 6);
    clusterGroup.add(body3Group);

    clusterGroup.userData = {
      nonInteractive: true,
      time: 0,
      update(delta) {
        this.time += delta;
        const orbitSpeed = 0.2;

        // Triad orbital choreography around mutual barycenter
        body1Group.position.set(Math.cos(this.time * orbitSpeed) * 22, Math.sin(this.time * orbitSpeed * 0.5) * 4, Math.sin(this.time * orbitSpeed) * 22);
        body1Group.rotation.y += delta * 0.04;

        body2Group.position.set(Math.cos(this.time * orbitSpeed + 2.1) * 28, Math.cos(this.time * orbitSpeed * 0.7) * 5, Math.sin(this.time * orbitSpeed + 2.1) * 28);
        body2Group.rotation.y += delta * 0.06;

        body3Group.position.set(Math.cos(this.time * orbitSpeed + 4.2) * 24, Math.sin(this.time * orbitSpeed * 0.8) * 6, Math.sin(this.time * orbitSpeed + 4.2) * 24);
        body3Group.rotation.y += delta * 0.05;
      }
    };

    scene.add(clusterGroup);
    return clusterGroup;
  },

  // --------------------------------------------------------------------------
  // 8. ASTEROID BELT & DUST (GUARANTEED NO OBSCURING OF CELESTIAL OBJECTS)
  // Distance and corridor clearance checks ensure asteroids NEVER block
  // Green Bank, J1713, or Binary Black Holes from the starting camera position
  // --------------------------------------------------------------------------
  createAsteroidBelt(scene) {
    const group = new THREE.Group();
    const count = 75;
    const mat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      flatShading: true,
      roughness: 0.85,
      metalness: 0.15
    });
    const asteroids = [];

    // Starting camera position and main destination targets
    const camStart = new THREE.Vector3(0, 30.5, -226);
    const keyTargets = [
      new THREE.Vector3(0, 5, -150),    // Green Bank Observatory
      new THREE.Vector3(-80, 15, -60),   // J1713 Pulsar
      new THREE.Vector3(85, -20, -75)    // Binary Black Holes
    ];

    // Helper: Distance from 3D point P to line segment [A, B]
    const distToSegment = (p, a, b) => {
      const ab = new THREE.Vector3().subVectors(b, a);
      const ap = new THREE.Vector3().subVectors(p, a);
      const lenSq = ab.lengthSq();
      if (lenSq === 0) return ap.length();
      const t = Math.max(0, Math.min(1, ap.dot(ab) / lenSq));
      const proj = a.clone().add(ab.multiplyScalar(t));
      return p.distanceTo(proj);
    };

    // Helper: Check if a position or its orbital ring violates any sightline clearance
    const isSightlineObscured = (pos) => {
      const clearanceDist = 36.0; // 36 unit radius clear cylinder around each sightline
      for (const target of keyTargets) {
        if (distToSegment(pos, camStart, target) < clearanceDist) return true;
        if (pos.distanceTo(target) < 42.0) return true; // Destination halo clearance
      }
      return false;
    };

    let generated = 0;
    let attempts = 0;

    while (generated < count && attempts < 800) {
      attempts++;
      const size = 1.2 + Math.random() * 3.2;
      const angle = Math.random() * Math.PI * 2;
      // Asteroid belt placed in outer framing zone with distinct vertical inclination
      const dist = 135 + Math.random() * 110;
      const inclination = 0.42; // Tilted belt so it passes above and below central sightlines
      const yBase = Math.sin(angle) * dist * inclination * 0.45;
      const yOffset = (Math.random() - 0.5) * 35;
      const y = yBase + yOffset;

      const testPos = new THREE.Vector3(
        Math.cos(angle) * dist,
        y,
        Math.sin(angle) * dist
      );

      // Verify clearance from camera starting point and key sightlines
      if (isSightlineObscured(testPos)) continue;

      const geo = new THREE.DodecahedronGeometry(size, 0);

      // Perturb unique vertices coherently
      const pos = geo.attributes.position;
      const vMap = new Map();
      for (let j = 0; j < pos.count; j++) {
        const x = pos.getX(j);
        const vy = pos.getY(j);
        const z = pos.getZ(j);
        const key = `${x.toFixed(2)}_${vy.toFixed(2)}_${z.toFixed(2)}`;
        if (!vMap.has(key)) {
          const scale = 0.76 + Math.random() * 0.44;
          vMap.set(key, scale);
        }
        const scale = vMap.get(key);
        pos.setXYZ(j, x * scale, vy * scale, z * scale);
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(testPos);

      mesh.userData = {
        speed: 0.02 + Math.random() * 0.04,
        angle: angle,
        dist: dist,
        yBase: yBase,
        yOffset: yOffset,
        rotX: (Math.random() - 0.5) * 0.5,
        rotY: (Math.random() - 0.5) * 0.5
      };

      group.add(mesh);
      asteroids.push(mesh);
      generated++;
    }

    group.userData = {
      update(delta) {
        asteroids.forEach(a => {
          a.rotation.x += a.userData.rotX * delta;
          a.rotation.y += a.userData.rotY * delta;
          a.userData.angle += a.userData.speed * delta * 0.1;
          a.position.x = Math.cos(a.userData.angle) * a.userData.dist;
          a.position.z = Math.sin(a.userData.angle) * a.userData.dist;
          // Keep inclination consistent to preserve sightline clearance
          a.position.y = Math.sin(a.userData.angle) * a.userData.dist * 0.42 * 0.45 + a.userData.yOffset;
        });
      }
    };

    scene.add(group);
  },

  // --------------------------------------------------------------------------
  // 9. DESTINY 2-AESTHETIC GLOWING COSMIC NEBULAE
  // Ethereal luminous volumetric clouds, radiant starlight filaments, and soft
  // cosmic gradients in rich magentas, violets, cyans, and warm solar ambers
  // --------------------------------------------------------------------------
  createCosmicNebula(scene) {
    const group = new THREE.Group();

    // 1. Generate soft radial glow texture via canvas for silky smooth additive blending
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.22, 'rgba(255, 255, 255, 0.75)');
    grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.22)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const glowTexture = new THREE.CanvasTexture(canvas);

    // Destiny 2 Skybox Color Palette: Deep royal violet, vibrant nebula magenta, ion cyan, stellar gold
    const nebulaColors = [
      new THREE.Color(0x7c3aed), // Royal Violet
      new THREE.Color(0xc026d3), // Luminous Fuchsia
      new THREE.Color(0xdb2777), // Deep Rose
      new THREE.Color(0x06b6d4), // Ion Gas Cyan
      new THREE.Color(0x0284c7), // Cosmic Blue
      new THREE.Color(0xf59e0b)  // Stellar Nursery Amber
    ];

    // 2. Large Volumetric Glowing Sprite Cloud Clusters
    const clouds = [];
    const clusterCount = 18;

    for (let c = 0; c < clusterCount; c++) {
      const centerAngle = (c / clusterCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const centerElevation = (Math.random() - 0.5) * Math.PI * 0.7;
      const centerDist = 650 + Math.random() * 350;

      const clusterPos = new THREE.Vector3(
        centerDist * Math.cos(centerElevation) * Math.cos(centerAngle),
        centerDist * Math.sin(centerElevation),
        centerDist * Math.cos(centerElevation) * Math.sin(centerAngle)
      );

      const colorBase = nebulaColors[c % nebulaColors.length];

      // Each cluster contains 4-6 overlapping soft glowing sprites
      const subClouds = 4 + Math.floor(Math.random() * 3);
      for (let s = 0; s < subClouds; s++) {
        const mat = new THREE.SpriteMaterial({
          map: glowTexture,
          color: colorBase,
          transparent: true,
          opacity: 0.18 + Math.random() * 0.14,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const sprite = new THREE.Sprite(mat);
        const spread = 70 + Math.random() * 90;
        sprite.position.set(
          clusterPos.x + (Math.random() - 0.5) * spread,
          clusterPos.y + (Math.random() - 0.5) * spread,
          clusterPos.z + (Math.random() - 0.5) * spread
        );

        const scale = 440 + Math.random() * 560;
        sprite.scale.set(scale, scale, 1);
        group.add(sprite);

        clouds.push({
          sprite,
          baseOpacity: mat.opacity,
          pulseSpeed: 0.2 + Math.random() * 0.3,
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    }


      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeo = new THREE.TubeGeometry(curve, 24, 8 + Math.random() * 12, 6, false);
      const ribbonMat = new THREE.MeshBasicMaterial({
        color: nebulaColors[f % nebulaColors.length],
        wireframe: true,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, ribbonMat);
      group.add(tubeMesh);
    }

    group.userData = {
      time: 0,
      update(delta) {
        this.time += delta;
        // Subtle, majestic breathing glow of nebulae
        clouds.forEach(c => {
          c.sprite.material.opacity = c.baseOpacity + Math.sin(this.time * c.pulseSpeed + c.pulseOffset) * 0.04;
        });
        group.rotation.y += delta * 0.012; // Slow cosmic drift
      }
    };

    scene.add(group);
  }
};
