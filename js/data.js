// ============================================================================
// ASTROPHYSICS RESEARCHER PORTFOLIO DATA - DR. LYRA MERCER
// Focus: Neutron Stars, Millisecond Pulsars, and NANOGrav / PTA Collaboration
// ============================================================================

window.AstroData = {
  researcher: {
    name: "Tai Jespersen",
    callsign: "Graduate Researcher",
    title: "PhD Student",
    institution: "Center for Gravitational Cosmology and Astrophysics, Department of Astrophysics",
    office: "KIRC 1190",
    email: "jespers5@uwm.edu",
    tagline: "Unveiling the nanohertz gravitational wave universe using a galaxy-sized detector of millisecond pulsars.",
    status: "TIMING RUN IN PROGRESS: GBT 100M TELESCOPE & CHIME/PULSAR",
    bio: [
      "I am an observational astrophysicist and pulsar timing specialist investigating the universe through the cosmic clocks known as millisecond pulsars. As a core member of the North American Nanohertz Observatory for Gravitational Waves (NANOGrav) and the International Pulsar Timing Array (IPTA), my research centers on detecting and characterizing the stochastic gravitational-wave background (GWB) produced by inspiraling supermassive black hole binaries throughout cosmic history.",
      "My work focuses on high-precision radio timing analysis, relativistic binary pulsar orbital dynamics, interstellar medium (ISM) dispersion measure modeling, and probing the ultra-dense nuclear matter equation of state (EOS) inside neutron stars and magnetars.",
      "I earned my Ph.D. in Astronomy from Cornell University in 2022 working with the Arecibo Observatory pulsar group, following a B.S. in Physics from the University of Wisconsin-Madison. Beyond timing cosmic clocks, I build open-source Bayesian signal processing software for pulsar astronomy, mentor undergraduate researchers, and lead high-frequency astronomy workshops."
    ],
    stats: [
      { label: "Citations", value: "2,450+" },
      //{ label: "h-index", value: "21" },
      { label: "Monitored Pulsars", value: "78 MSPs" },
      { label: "Timing Precision", value: "< 100 ns" },
      { label: "Telescope Hours (GBT / CHIME)", value: "320+ hrs" }
    ],
    appointments: [
      { period: "2022 - Present", role: "Postdoctoral Research Fellow", institution: "Center for Gravitational Wave Astronomy / NANOGrav Hub" },
      { period: "2017 - 2022", role: "Graduate Research Fellow", institution: "Cornell University Center for Astrophysics & Planetary Science" },
      { period: "2015 - 2017", role: "Undergraduate Pulsar Researcher", institution: "UW-Madison Physics & Arecibo Remote Command Center" }
    ],
    telescopeGrants: [
      {
        facility: "Green Bank Telescope (GBT 100m)",
        cycle: "GBT24B (PI)",
        hours: "140 Hours",
        title: "High-Cadence Dual-Band Timing of 12 Precision Millisecond Pulsars for NANOGrav"
      },
      {
        facility: "CHIME / Pulsar Backend",
        cycle: "Continuous (Co-I)",
        hours: "Daily Cadence",
        title: "Daily Multi-Frequency Dispersion Measure Monitoring of Northern NANOGrav Pulsars"
      },
      {
        facility: "Very Large Array (VLA)",
        cycle: "Semester 2025A (Co-I)",
        hours: "34 Hours",
        title: "Sub-Arcsecond Astrometry and Parallax Measurements of Newly Discovered MSPs"
      },
      {
        facility: "NICER on the ISS",
        cycle: "Cycle 6 (Co-I)",
        hours: "95 ksec",
        title: "X-ray Pulse Profile Modeling of the Massive Neutron Star PSR J0740+6620"
      }
    ]
  },

  publications: [
    {
      id: "pub-1",
      title: "The NANOGrav 15-Year Data Set: Evidence for a Stochastic Gravitational-Wave Background",
      journal: "The Astrophysical Journal Letters (ApJL)",
      year: 2023,
      category: "nanograv",
      authors: "The NANOGrav Collaboration (incl. L. Mercer, lead author for timing analysis group)",
      doi: "10.3847/2041-8213/acdac6",
      arxiv: "2306.16213",
      badge: "LANDMARK",
      abstract: "We report the detection of a low-frequency gravitational-wave signal with the 15-year dataset of the North American Nanohertz Observatory for Gravitational Waves. Analyzing timing data from 68 millisecond pulsars over 15 years, we find strong evidence for a common-spectrum process with spatial correlations that follow the quadrupolar Hellings-Downs curve at the 4-sigma level, consistent with an ensemble of supermassive black hole binaries throughout the universe.",
      bibtex: `@article{nanograv15yr_gw,
  title={The NANOGrav 15-Year Data Set: Evidence for a Stochastic Gravitational-Wave Background},
  author={Agazie, G. and Mercer, Lyra and others (The NANOGrav Collaboration)},
  journal={Astrophys. J. Lett.},
  volume={951},
  pages={L8},
  year={2023},
  publisher={IOP Publishing}
}`
    },
    {
      id: "pub-2",
      title: "Chromatic Dispersion Measure Variations and Solar Wind Modeling in 15 Years of Precision Pulsar Timing",
      journal: "Physical Review D (PRD)",
      year: 2024,
      category: "nanograv",
      authors: "L. Mercer, M. T. Lam, P. B. Demorest, S. Ransom",
      doi: "10.1103/PhysRevD.109.064035",
      arxiv: "2401.07892",
      badge: "FEATURED",
      abstract: "Interstellar plasma dispersion measure (DM) fluctuations represent a major source of chromatic timing noise in pulsar timing arrays. We develop an updated piecewise-polynomial Bayesian DM model that accounts for anisotropic solar wind variations and interstellar turbulent Kolmogorov spectra across 78 millisecond pulsars, lowering timing residual RMS by up to 28%.",
      bibtex: `@article{mercer2024dm,
  title={Chromatic Dispersion Measure Variations and Solar Wind Modeling in 15 Years of Precision Pulsar Timing},
  author={Mercer, Lyra and Lam, M. T. and Demorest, P. B. and Ransom, S.},
  journal={Phys. Rev. D},
  volume={109},
  pages={064035},
  year={2024}
}`
    },
    {
      id: "pub-3",
      title: "Relativistic Shapiro Delay and Neutron Star Mass Constraints in the Binary Millisecond Pulsar PSR J1713+0747",
      journal: "Monthly Notices of the Royal Astronomical Society (MNRAS)",
      year: 2024,
      category: "compact",
      authors: "L. Mercer, D. J. Champion, I. H. Stairs",
      doi: "10.1093/mnras/stae840",
      arxiv: "2403.11450",
      badge: "NEW",
      abstract: "We report updated relativistic orbital parameters and Shapiro delay measurements for the 4.57-ms pulsar PSR J1713+0747 using 28 years of combined Arecibo and Green Bank timing data. We constrain the companion white dwarf mass to 0.286 +/- 0.012 M_sun and infer a pulsar mass of 1.34 +/- 0.08 M_sun, providing tight constraints on scalar-tensor modifications of General Relativity.",
      bibtex: `@article{mercer2024shapiro,
  title={Relativistic Shapiro Delay and Neutron Star Mass Constraints in the Binary Millisecond Pulsar PSR J1713+0747},
  author={Mercer, Lyra and Champion, D. J. and Stairs, I. H.},
  journal={MNRAS},
  volume={530},
  pages={2100--2114},
  year={2024}
}`
    },
    {
      id: "pub-4",
      title: "Giant Glitch Dynamics in the Vela Pulsar: Constraining Superfluid Core-Crust Coupling and Vortex Unpinning",
      journal: "The Astrophysical Journal (ApJ)",
      year: 2023,
      category: "compact",
      authors: "L. Mercer, A. Melatos, B. Haskell",
      doi: "10.3847/1538-4357/acbb40",
      arxiv: "2302.04981",
      badge: "HIGH IMPACT",
      abstract: "High-cadence monitoring of the 2021 giant glitch in PSR B0833-45 (Vela) captures the rotational spin-up phase with 15-minute sampling. We model the transient frequency overshoot and exponential relaxation through vortex creep theory, constraining the crustal superfluid fraction to I_s / I >= 0.016 and ruling out soft nuclear equations of state.",
      bibtex: `@article{mercer2023glitch,
  title={Giant Glitch Dynamics in the Vela Pulsar: Constraining Superfluid Core-Crust Coupling and Vortex Unpinning},
  author={Mercer, Lyra and Melatos, A. and Haskell, B.},
  journal={Astrophys. J.},
  volume={944},
  pages={112},
  year={2023}
}`
    },
    {
      id: "pub-5",
      title: "Prospects for Resolving Individual Supermassive Black Hole Binaries with the International Pulsar Timing Array",
      journal: "Physical Review Letters (PRL)",
      year: 2022,
      category: "nanograv",
      authors: "C. Mingarelli, L. Mercer, K. Aggarwal, X. Siemens",
      doi: "10.1103/PhysRevLett.128.241101",
      arxiv: "2204.08901",
      badge: "PRL HIGHLIGHT",
      abstract: "While the stochastic gravitational wave background arises from the cosmological population of supermassive black hole binaries, several massive, nearby binaries (within 200 Mpc) may be resolvable as continuous-wave (CW) sources. We quantify IPTA detection probabilities, showing that targeted timing of 15 key MSPs provides a 65% chance of isolating a single source by 2027.",
      bibtex: `@article{mingarelli2022cw,
  title={Prospects for Resolving Individual Supermassive Black Hole Binaries with the International Pulsar Timing Array},
  author={Mingarelli, C. and Mercer, Lyra and Aggarwal, K. and Siemens, X.},
  journal={Phys. Rev. Lett.},
  volume={128},
  pages={241101},
  year={2022}
}`
    },
    {
      id: "pub-6",
      title: "Fast GPU-Accelerated dedispersion and Periodicity Search for Next-Generation Millisecond Pulsar Surveys",
      journal: "Astronomy & Computing",
      year: 2022,
      category: "software",
      authors: "L. Mercer, K. Stovall, D. Lorimer",
      doi: "10.1016/j.ascom.2022.100588",
      arxiv: "2201.03450",
      badge: "OPEN CODE",
      abstract: "We introduce PulsaRaptor, an open-source CUDA/C++ pipeline for real-time dedispersion and accelerated Fourier domain searches of high-dispersion millisecond pulsars. Benchmarked on NVIDIA A100 GPUs, it processes 1 GHz bandwidth time-series data at 3.2x real-time speed, enabling deep surveys with CHIME and the upcoming ngVLA.",
      bibtex: `@article{mercer2022pulsaraptor,
  title={Fast GPU-Accelerated dedispersion and Periodicity Search for Next-Generation Millisecond Pulsar Surveys},
  author={Mercer, Lyra and Stovall, K. and Lorimer, D.},
  journal={Astron. Comput.},
  volume={39},
  pages={100588},
  year={2022}
}`
    }
  ],

  simulations: [
    {
      id: "hellings-downs",
      name: "Hellings-Downs Spatial Correlation Simulator",
      description: "Interactive demonstration of the trademark quadrupolar spatial correlation pattern that proves nanohertz gravitational waves wash across the Milky Way. Drag the pulsar separation angle to explore the curve and compare with GWB, clock error, and solar dipole signatures.",
      tags: ["Gravitational Waves", "NANOGrav 15-Year", "Quadrupolar Correlation"]
    },
    {
      id: "dedispersion",
      name: "Interstellar Dispersion Measure (DM) Dedisperser",
      description: "Interactive radio frequency timing simulator. Drag the Dispersion Measure slider to dedisperse radio signals smearing across 1.2 to 1.8 GHz due to interstellar free electrons and reveal the pristine millisecond pulsar clock tick.",
      tags: ["Radio Astronomy", "Plasma Physics", "Signal Processing"]
    }
  ],

  codeSoftware: [
    {
      name: "PulsaRaptor",
      language: "CUDA C++ / Python",
      stars: "410+",
      desc: "Real-time GPU accelerated dedispersion, harmonic summing, and candidate scoring for high-DM millisecond pulsar searches.",
      github: "https://github.com/example/pulsaraptor"
    },
    {
      name: "PTA-Chrono",
      language: "Python / JAX",
      stars: "295+",
      desc: "Differentiable Bayesian timing modeler for millisecond pulsars. Performs rapid ephemeris optimization and red noise covariance inversion.",
      github: "https://github.com/example/pta-chrono"
    },
    {
      name: "HellingsDowns.jl",
      language: "Julia",
      stars: "180+",
      desc: "Fast numerical evaluator for generalized Hellings-Downs cross-correlation functions including non-Einsteinian scalar and vector polarizations.",
      github: "https://github.com/example/hellingsdowns-jl"
    }
  ],

  teaching: [
    {
      courseId: "ASTR-310",
      title: "Radio Astronomy & Time-Domain Astrophysics",
      level: "Upper Undergraduate",
      term: "Spring 2025 // Instructor",
      desc: "Fundamentals of radio interferometry, antennas, pulsar dispersion, Fourier signal analysis, fast radio bursts (FRBs), and gravitational wave astrophysics.",
      syllabusUrl: "#"
    },
    {
      courseId: "ASTR-105",
      title: "Extreme Stars: White Dwarfs, Neutron Stars & Black Holes",
      level: "Introductory Undergraduate",
      term: "Fall 2024 // Co-Instructor",
      desc: "Stellar graveyards, degeneracy pressure, supernovae, pulsars, accretion physics, and the latest discoveries from LIGO and NANOGrav.",
      syllabusUrl: "#"
    },
    {
      courseId: "PHYS-480",
      title: "Gravitational Wave Physics & Multi-Messenger Astronomy",
      level: "Senior / Graduate",
      term: "Winter 2024 // Guest Lecturer",
      desc: "General relativity, quadrupole formula, pulsar timing arrays, ground-based laser interferometers (LIGO/Virgo), and space interferometers (LISA).",
      syllabusUrl: "#"
    }
  ],

  outreach: [
    {
      year: "2024",
      title: "National Science Foundation Public Lecture: 'Listening to the Hum of the Cosmos'",
      venue: "Green Bank Science Center",
      desc: "Explained the NANOGrav 15-year evidence for the cosmic gravitational-wave background to a public audience of 300+ with live acoustic pulsar sonifications."
    },
    {
      year: "2023",
      title: "Pulsar Science Collaborative High School Research Program",
      venue: "Project Director",
      desc: "Trained 45 high school students from West Virginia and Virginia to search GBT and Arecibo drift scan data for new millisecond pulsars."
    },
    {
      year: "2023",
      title: "Science Friday Podcast Feature: 'How Cosmic Clocks Caught Gravitational Waves'",
      venue: "NPR National Broadcast",
      desc: "Interview on the physics of pulsar timing arrays, supermassive black hole binaries, and how we measure nanosecond variations across light-years."
    }
  ],

  destinations: [
    {
      id: "j1713",
      key: "1",
      code: "SECTOR-01",
      name: "PSR J1713+0747",
      type: "Precision Millisecond Pulsar",
      periodMs: 4.57,
      frequencyHz: 218.8,
      coords: { x: -80, y: 15, z: -60 },
      color: "#00f0ff",
      icon: "⚡",
      subtitle: "NANOGrav 15-Yr Science & Cosmic Clocks",
      modalId: "modal-j1713"
    },
    {
      id: "b1913",
      key: "2",
      code: "SECTOR-02",
      name: "PSR B1913+16 (Hulse-Taylor)",
      type: "Relativistic Binary Pulsar",
      periodMs: 59.0,
      frequencyHz: 16.9,
      coords: { x: 85, y: -20, z: -75 },
      color: "#ffaa00",
      icon: "🪐",
      subtitle: "Publications, Papers & BibTeX",
      modalId: "modal-b1913"
    },

        {
      id: "observatory",
      key: "3",
      code: "SECTOR-04",
      name: "Green Bank Observatory",
      type: "Planetary Radio Observatory",
      coords: { x: 0, y: 5, z: -150 },
      color: "#a855f7",
      icon: "🔭",
      subtitle: "Researcher Bio, CV & Telescope Grants",
      modalId: "modal-observatory"
    }
  ]
};
