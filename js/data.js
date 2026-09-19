// ============================================================================
// ASTROPHYSICS RESEARCHER PORTFOLIO DATA - DR. LYRA MERCER
// Focus: Neutron Stars, Millisecond Pulsars, and NANOGrav / PTA Collaboration
// ============================================================================

window.AstroData = {
  researcher: {
    name: "Tai Jespersen",
    callsign: "PhD Student",
    title: "PhD Student",
    institution: "Center for Gravitational Cosmology and Astrophysics, Department of Astrophysics",
    office: "KIRC 1190",
    email: "jespers5@uwm.edu",
    tagline: "Unveiling the nanohertz gravitational wave universe using a galaxy-sized detector of millisecond pulsars.",
    status: "TIMING RUN IN PROGRESS: GBT 100M TELESCOPE & CHIME/PULSAR",
    bio: [
      "I am a first year PhD student at University of Wisconsin-Milwaukee in the department of Physics and Astronomy.",
      "I am interested in NANOGrav and observational pulsar astronomy. My past work consisted of utilizing modern folding technique to more efficiently search through archival data for radio pulsars. I have also worked on other research on planetary nebulae, space plasma physics, and cosmology. "
    ],
    stats: [
      { label: "N/A", value: "a" },
      //{ label: "N/A", value: "b" },
      { label: "N/A", value: "c" },
      { label: "N/A", value: "d" },
      { label: "N/A", value: "e" }
    ],
    appointments: [
      { period: "2026 - Present", role: "PhD Student", institution: "UW-Milwaukee" },
      { period: "2022 - 2026", role: "Undergraduate", institution: "F&M" }
    ],
    telescopeGrants: [
      {
        facility: "N/A",
        cycle: "a",
        hours: "a",
        title: "a"
      },
      {
        facility: "a",
        cycle: "a",
        hours: "a",
        title: "a"
      }
    ]
  },

  publications: [
    {
      id: "pub-1",
      title: "Twenty-four thousand hours of GREENBURST observations with the GBT",
      journal: "Monthly Notices of the Royal Astronomical Society (MNRAS)",
      year: 2026,
      category: "FRB/Pulsar Search",
      authors: "J. W. Kania et al. (incl. Tai Jespersen)",
      doi: "https://doi.org/10.1093/mnras/stag665",
      arxiv: "2601.20143",
      badge: "FEATURED",
      abstract: "In addition to fast radio burst (FRB) searches carried out using dedicated surveys, a number of radio observatories take advantage of commensal opportunities with large facilities in which observations for other projects can be searched for FRBs and other transient sources. We present the results from one such effort, the first 24,186 hours of the GREENBURST search for dispersed radio pulses with the Green Bank Telescope (GBT). To date, GREENBURST has detected a total of 50 pulsars and three FRBs. One of the pulsars, PSR J0039+5407, has a period of 2.2 s and was previously unknown. Using follow-up observations with the Canadian Hydrogen Intensity Mapping Experiment, we found a timing solution for this pulsar which shows it to have a characteristic age of 2 Myr. Additional GBT observations show the pulsar has a very high nulling fraction (∼70−80%). All three of the FRBs are repeating sources that were previously known and were being monitored by the GBT as part of other projects. A major challenge for GREENBURST in the discovery of new FRBs is its single beam. This makes it hard to distinguish some of the pulses from sources of radio frequency interference. We highlight this problem with a case study of an FRB-like pulse that initially passed our interference filters. Upon closer inspection, the event appears to be part of a longer-duration narrow-band source of unknown origin. Further observations and monitoring are required to determine whether it is terrestrial or celestial. ",
      bibtex: `@article{KANIA_2026,
  title={Twenty-four thousand hours of GREENBURST observations with the GBT},
  author={J. W. Kania et al. (incl. Tai Jespersen)},
  journal={MNRAS},
  volume={548},
  pages={stag665},
  year={2026},
  publisher={IOP Publishing}
}`
    },
    {
      id: "pub-2",
      title: "Reprocessing of the Parkes 70-cm Survey and Discovery of a New Radio Pulsar in the Large Magellanic Cloud",
      journal: "Astrophysical Journal",
      year: 2025,
      category: "pulsar search",
      authors: "W. Xia, F. Crawford, S. Hisano, T. Jespersen, M. Ficarra, M. Golden, M. Gironda;",
      doi: "10.3847/1538-4357/adf8e8",
      arxiv: "2507.21920",
      abstract: "We have reprocessed the data archived from the Parkes 70 cm (PKS70) pulsar survey with an expanded dispersion measure (DM) search range and an acceleration search. Our goal was to detect pulsars that might have been missed in the original survey processing. Of the original 43,842 pointings, 34,869 pointings were archived, along with 440 additional pointings for confirmation or timing. We processed all of these archived data and detected 359 known pulsars: 265 of these were detected in the original survey, while an additional 94 currently known pulsars were detected in our reprocessing. A few among those 94 pulsars are highly accelerated binary pulsars. Furthermore, we detected 5 more pulsars with DMs higher than the original survey thresholds, as well as 6 more pulsars below the nominal survey sensitivity threshold (from the original survey beams with longer integrations). We missed detection of 33 (of the 298) pulsars detected in the original survey, in part because of portions of the survey data missing in the archive and our early-stage candidate sifting method. We discovered one new pulsar in the reanalysis, PSR J0540−69, which has a spin period of 0.909 s and resides in the Large Magellanic Cloud (LMC). This new pulsar appeared in three PKS70 beams and one additional L-band observation that targeted the LMC pulsar PSR B0540−69. The numerous pulsar detections found in our reanalysis and the discovery of a new pulsar in the LMC highlight the value of conducting multiple searches through pulsar data sets.",
      bibtex: `@article{XIA_2025,
  title={Reprocessing of the Parkes 70-cm Survey and Discovery of a New Radio Pulsar in the Large Magellanic Cloud},
  author={W. Xia, F. Crawford, S. Hisano, T. Jespersen, M. Ficarra, M. Golden, M. Gironda},
  journal={The Astrophysical Journal},
  volume={991},
  pages={6},
  year={2025}
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
      courseId: "PHY-121",
      title: "General Physics Laboratory I",
      level: "Undergraduate",
      term: "Fall 2026 // Instructor",
      desc: "Experiments correlated with lecture material of PHYSICS 120. ",
      syllabusUrl: "#"
    },
    {
      courseId: "AST-101",
      title: "Exploring Ideas in Astronomy",
      level: "Introductory Undergraduate",
      term: "Fall 2023 // TA",
      desc: "An exploration of topics in astronomy with a view toward understanding the big ideas. After establishing a solid background in the quantitative scientific and physical principles that underlie these topics, the course discusses topics centered around big questions (for example, how do astronomers study the sky? how do we study things we can’t see? how will the universe end?).",
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
      name: "Pulsar Timing",
      type: "Precision Millisecond Pulsar",
      periodMs: 4.57,
      frequencyHz: 218.8,
      coords: { x: -80, y: 15, z: -60 },
      color: "#38bdf8",
      icon: "⚡",
      subtitle: "NANOGrav 15-Yr Science & Cosmic Clocks",
      description: "Precision timing of millisecond pulsars across decades provides the galactic backbone for detecting nanohertz gravitational waves with NANOGrav.",
      modalId: "modal-j1713"
    },
    {
      id: "b1913",
      key: "2",
      code: "SECTOR-02",
      name: "Gravitational Waves",
      type: "Binary Black Hole System",
      periodMs: 59.0,
      frequencyHz: 16.9,
      coords: { x: 85, y: -20, z: -75 },
      color: "#f59e0b",
      icon: "🪐",
      subtitle: "Binary Black Holes, Papers & BibTeX",
      description: "Two low-poly binary black holes locked in an extreme relativistic dance, warping spacetime and shedding gravitational waves. Explore research papers and publications.",
      modalId: "modal-b1913"
    },
    {
      id: "observatory",
      key: "3",
      code: "SECTOR-03",
      name: "Radio Pulsar Searching",
      type: "Planetary Radio Observatory",
      coords: { x: 0, y: 5, z: -150 },
      color: "#a855f7",
      icon: "🔭",
      subtitle: "Researcher Bio, CV & Telescope Grants",
      description: "A planetary radio observatory hosting the 100-meter Green Bank Telescope. Explore scientific appointments, telescope allocations, and academic curriculum vitae.",
      modalId: "modal-observatory"
    }
  ]
};
