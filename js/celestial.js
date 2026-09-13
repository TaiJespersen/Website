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

    // Dynamic Point Light to illuminate surrounding space brightly
    const light = new THREE.PointLight(0x00f0ff, 3.5, 140);
    group.add(light);

    // Luminous Navigational Waypoint Beacon Halo (High visibility from distance)
    const haloGeo = new THREE.TorusGeometry(26, 0.35, 4, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const navHalo = new THREE.Mesh(haloGeo, haloMat);
    navHalo.rotation.x = Math.PI / 2;
    group.add(navHalo);

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
      name: "PSR J1713+0747",
      radius: 26,
      time: 0,
      update(delta) {
        this.time += delta;
        // High rotational velocity (millisecond spin rate)
        core.rotation.y += delta * 6.5;
        beamGroup.rotation.y += delta * 5.2;
        shell.rotation.x -= delta * 1.5;
        navHalo.rotation.z += delta * 0.2;
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

    // Dynamic Point Light to illuminate binary barycenter brightly
    const light = new THREE.PointLight(0xf59e0b, 3.5, 140);
    group.add(light);

    // Luminous Navigational Waypoint Beacon Halo (High visibility)
    const haloGeo = new THREE.TorusGeometry(32, 0.4, 4, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const navHalo = new THREE.Mesh(haloGeo, haloMat);
    navHalo.rotation.x = Math.PI / 2;
    group.add(navHalo);

    const pulsarMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 1.4,
      flatShading: true,
      roughness: 0.3
    });

    const compMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      emissive: 0x475569,
      emissiveIntensity: 0.8,
      flatShading: true,
      roughness: 0.4
    });

    // Primary Pulsar
    const star1 = new THREE.Mesh(new THREE.DodecahedronGeometry(5), pulsarMat);
    group.add(star1);

    // Primary Dual Sweeping Relativistic Beams (North and South)
    // Both beams emanate from a single point at the magnetic poles and flare outward
    const bBeamGeo = this.createExpandingBeamGeometry(7.0, 60, 8);
    const bBeamMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.75
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
      const rGeo = new THREE.RingGeometry(8 + i * 8, 9.8 + i * 8, 20);
      const rMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
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
        navHalo.rotation.z -= delta * 0.15;

        // Animate gravitational wave ripples expanding outward
        gwRipples.forEach((r, idx) => {
          const t = (this.time * 0.8 + idx * 0.5) % 2.0;
          r.scale.set(1 + t * 2.2, 1 + t * 2.2, 1);
          r.material.opacity = Math.max(0, 0.7 - t * 0.3);
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

    // Dynamic Point Light to illuminate surrounding space with crimson glow
    const light = new THREE.PointLight(0xef4444, 4.0, 140);
    group.add(light);

    // Luminous Navigational Waypoint Beacon Halo (High visibility)
    const haloGeo = new THREE.TorusGeometry(30, 0.4, 4, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const navHalo = new THREE.Mesh(haloGeo, haloMat);
    navHalo.rotation.x = Math.PI / 2;
    group.add(navHalo);

    // Highly Strained Faceted Crust
    const crustGeo = new THREE.IcosahedronGeometry(9, 1);
    const crustMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 1.5,
      flatShading: true,
      roughness: 0.4,
      metalness: 0.7
    });
    const crust = new THREE.Mesh(crustGeo, crustMat);
    group.add(crust);

    // Magnetic Flux Loop Arches (Tori spanning across magnetic poles)
    const magneticArchMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });

    const arches = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const archGeo = new THREE.TorusGeometry(14, 0.45, 4, 16, Math.PI);
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
        navHalo.rotation.z += delta * 0.25;

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
  // 4. PLANETARY RADIO OBSERVATORY: GREEN BANK TELESCOPE (GBT)
  // Low-poly terrestrial planet with the 100m Green Bank Telescope on a mountain plateau
  // --------------------------------------------------------------------------
  createRadioObservatory(scene, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    // Dynamic Point Light illuminating the planet and observatory
    const light = new THREE.PointLight(0xa855f7, 3.5, 140);
    group.add(light);

    // Luminous Navigational Waypoint Beacon Halo (High visibility from deep space)
    const haloGeo = new THREE.TorusGeometry(34, 0.45, 4, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const navHalo = new THREE.Mesh(haloGeo, haloMat);
    navHalo.rotation.x = Math.PI / 2;
    group.add(navHalo);

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
      roughness: 0.2
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
      legA.position.set(side * 2.8, 3.2, -1.4);
      legA.rotation.x = 0.22;
      alidadeTurret.add(legA);

      const legB = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 6.5, 5), steelTrussMat);
      legB.position.set(side * 2.8, 3.2, 1.4);
      legB.rotation.x = -0.22;
      alidadeTurret.add(legB);
    }

    // 3. Steerable Parabolic Dish & Off-Axis Cantilever Boom
    const dishMount = new THREE.Group();
    dishMount.position.set(0, 6.4, 0);

    // Elevation Bull Gear Sector underneath dish
    const bullGear = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.35, 4, 10, Math.PI), darkMetalMat);
    bullGear.rotation.z = Math.PI / 2;
    dishMount.add(bullGear);

    // Primary Off-Axis Parabolic Reflector (White segmented dish)
    const dishGeo = new THREE.CylinderGeometry(7.8, 1.8, 2.4, 16, 2, true);
    const dishMesh = new THREE.Mesh(dishGeo, dishPanelMat);
    dishMesh.rotation.x = Math.PI;
    dishMesh.position.y = 1.2;
    dishMount.add(dishMesh);

    // Outer rim truss
    const rim = new THREE.Mesh(new THREE.TorusGeometry(7.9, 0.25, 4, 16), steelTrussMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -1.2;
    dishMesh.add(rim);

    // 4. Iconic Green Bank Cantilevered Off-Axis Boom Arm
    const boomGroup = new THREE.Group();

    const boomLeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 9.5, 5), steelTrussMat);
    boomLeg1.position.set(-1.2, 4.8, -3.4);
    boomLeg1.rotation.x = 0.52;
    boomLeg1.rotation.z = -0.12;
    boomGroup.add(boomLeg1);

    const boomLeg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 9.5, 5), steelTrussMat);
    boomLeg2.position.set(1.2, 4.8, -3.4);
    boomLeg2.rotation.x = 0.52;
    boomLeg2.rotation.z = 0.12;
    boomGroup.add(boomLeg2);

    // Upper converging boom extending over dish center
    const boomUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 6.5, 5), steelTrussMat);
    boomUpper.position.set(0, 8.2, -0.6);
    boomUpper.rotation.x = -0.62;
    boomGroup.add(boomUpper);

    // Focal Cabin & Gregorian Subreflector
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), steelTrussMat);
    cabin.position.set(0, 7.6, 1.8);

    const subReflector = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8), dishPanelMat);
    subReflector.position.set(0, -0.8, 0);
    cabin.add(subReflector);

    // Active receiver laser strobe
    const strobeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const strobe = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), strobeMat);
    strobe.position.set(0, -1.6, 0);
    cabin.add(strobe);

    boomGroup.add(cabin);
    dishMount.add(boomGroup);

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
      name: "Green Bank Observatory",
      radius: 30,
      time: 0,
      update(delta) {
        this.time += delta;

        // Slow planet diurnal rotation
        planetGroup.rotation.y += delta * 0.04;
        navHalo.rotation.z -= delta * 0.12;

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
  // 5. EARTH DEEP SPACE UPLINK RELAY
  // Communication dish with pulse beacon
  // --------------------------------------------------------------------------
  createEarthRelay(scene, pos) {
    const group = new THREE.Group();
    group.position.set(pos.x, pos.y, pos.z);

    // Dynamic Point Light illuminating relay brightly
    const light = new THREE.PointLight(0x10b981, 3.2, 120);
    group.add(light);

    // Luminous Navigational Waypoint Beacon Halo (High visibility)
    const haloGeo = new THREE.TorusGeometry(26, 0.4, 4, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const navHalo = new THREE.Mesh(haloGeo, haloMat);
    navHalo.rotation.x = Math.PI / 2;
    group.add(navHalo);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
      flatShading: true,
      emissive: 0x78350f,
      emissiveIntensity: 0.4
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
        opacity: 0.85,
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
        navHalo.rotation.z += delta * 0.2;

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
  // 7. ASTEROID BELT & DUST (SEAMLESS - NO GAPS OR CRACKS)
  // --------------------------------------------------------------------------
  createAsteroidBelt(scene) {
    const group = new THREE.Group();
    const count = 80;
    const mat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      flatShading: true,
      roughness: 0.85,
      metalness: 0.15
    });
    const asteroids = [];

    for (let i = 0; i < count; i++) {
      const size = 1.2 + Math.random() * 3.4;
      const geo = new THREE.DodecahedronGeometry(size, 0);

      // Perturb unique 3D vertex positions coherently so adjacent faces never tear apart (NO GAPS!)
      const pos = geo.attributes.position;
      const vMap = new Map();

      for (let j = 0; j < pos.count; j++) {
        const x = pos.getX(j);
        const y = pos.getY(j);
        const z = pos.getZ(j);
        const key = `${x.toFixed(2)}_${y.toFixed(2)}_${z.toFixed(2)}`;

        if (!vMap.has(key)) {
          // Uniform radial displacement per unique vertex point
          const scale = 0.76 + Math.random() * 0.44;
          vMap.set(key, scale);
        }

        const scale = vMap.get(key);
        pos.setXYZ(j, x * scale, y * scale, z * scale);
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 85;

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
        opacity: 0.12
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
