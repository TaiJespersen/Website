// ============================================================================
// INTERACTIVE NANOGRAV & PULSAR ASTROPHYSICS LABS
// 1. Hellings-Downs Quadrupolar Spatial Correlation Simulator
// 2. Interstellar Plasma Dispersion Measure (DM) & Dedispersion Lab
// ============================================================================

window.AstroSimulations = {
  // --------------------------------------------------------------------------
  // 1. HELLINGS-DOWNS SPATIAL CORRELATION SIMULATOR
  // --------------------------------------------------------------------------
  hellingsDowns: {
    canvas: null,
    ctx: null,
    angleDeg: 45,
    curveType: 'quadrupole', // 'quadrupole' (GWB), 'monopole' (clock), 'dipole' (ephemeris)
    showPoints: true,
    slider: null,
    readout: null,

    // Synthetic NANOGrav 15-year binned points (angular separation, correlation, error)
    binnedData: [
      { angle: 12, corr: 0.38, err: 0.12 },
      { angle: 28, corr: 0.14, err: 0.09 },
      { angle: 45, corr: -0.06, err: 0.08 },
      { angle: 65, corr: -0.19, err: 0.07 },
      { angle: 90, corr: -0.16, err: 0.06 },
      { angle: 115, corr: -0.05, err: 0.07 },
      { angle: 140, corr: 0.09, err: 0.08 },
      { angle: 165, corr: 0.19, err: 0.11 }
    ],

    // Hellings-Downs correlation function formula
    hdFunction(thetaRad) {
      if (thetaRad < 1e-4) return 0.5;
      const x = (1 - Math.cos(thetaRad)) / 2;
      return (1 / 3) + x * (Math.log(x) - 1 / 6);
    },

    init(canvasId, sliderId, readoutId) {
      this.canvas = document.getElementById(canvasId);
      this.slider = document.getElementById(sliderId);
      this.readout = document.getElementById(readoutId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());

      if (this.slider) {
        this.slider.addEventListener('input', (e) => {
          this.angleDeg = parseFloat(e.target.value);
          this.draw();
          if (window.astroAudio) window.astroAudio.playBlip(600 + this.angleDeg * 2, 0.02);
        });
      }

      this.draw();
    },

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);
      this.width = rect.width;
      this.height = rect.height;
      this.draw();
    },

    setCurveType(type) {
      this.curveType = type;
      this.draw();
      if (window.astroAudio) window.astroAudio.playBlip(700, 0.05);
    },

    draw() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      ctx.clearRect(0, 0, w, h);

      // Deep space grid
      ctx.fillStyle = 'rgba(5, 7, 15, 0.95)';
      ctx.fillRect(0, 0, w, h);

      const margin = { left: 55, right: 30, top: 40, bottom: 45 };
      const plotW = w - margin.left - margin.right;
      const plotH = h - margin.top - margin.bottom;

      // Coordinate mapping (0 to 180 degrees X, -0.4 to +0.6 Y)
      const minX = 0, maxX = 180;
      const minY = -0.35, maxY = 0.55;

      const toX = (deg) => margin.left + ((deg - minX) / (maxX - minX)) * plotW;
      const toY = (val) => margin.top + ((maxY - val) / (maxY - minY)) * plotH;

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      [-0.2, 0.0, 0.2, 0.4].forEach(val => {
        const y = toY(val);
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + plotW, y);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(1), margin.left - 8, y + 3);
      });

      [0, 30, 60, 90, 120, 150, 180].forEach(deg => {
        const x = toX(deg);
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, margin.top + plotH);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${deg}°`, x, margin.top + plotH + 18);
      });

      // Zero axis line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(margin.left, toY(0));
      ctx.lineTo(margin.left + plotW, toY(0));
      ctx.stroke();

      // Axis Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PULSAR PAIR ANGULAR SEPARATION (θ)', margin.left + plotW / 2, h - 8);

      ctx.save();
      ctx.translate(14, margin.top + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('SPATIAL CORRELATION μ(θ)', 0, 0);
      ctx.restore();

      // Draw Theoretical Hellings-Downs Curve (Quadrupole)
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let d = 0.5; d <= 180; d += 1) {
        const rad = (d * Math.PI) / 180;
        let yVal;
        if (this.curveType === 'quadrupole') {
          yVal = this.hdFunction(rad);
        } else if (this.curveType === 'monopole') {
          yVal = 0.35; // Clock error
        } else {
          yVal = 0.35 * Math.cos(rad); // Solar system ephemeris dipole
        }
        const x = toX(d);
        const y = toY(yVal);
        if (d === 0.5) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw NANOGrav 15-Year Binned Data Points
      if (this.showPoints) {
        this.binnedData.forEach(pt => {
          const px = toX(pt.angle);
          const py = toY(pt.corr);
          const topY = toY(pt.corr + pt.err);
          const btmY = toY(pt.corr - pt.err);

          // Error bars
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(px, topY);
          ctx.lineTo(px, btmY);
          ctx.moveTo(px - 4, topY);
          ctx.lineTo(px + 4, topY);
          ctx.moveTo(px - 4, btmY);
          ctx.lineTo(px + 4, btmY);
          ctx.stroke();

          // Data point diamond
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Draw Current User Selected Angle Marker
      const userRad = (this.angleDeg * Math.PI) / 180;
      let userCorr;
      if (this.curveType === 'quadrupole') userCorr = this.hdFunction(userRad);
      else if (this.curveType === 'monopole') userCorr = 0.35;
      else userCorr = 0.35 * Math.cos(userRad);

      const userX = toX(this.angleDeg);
      const userY = toY(userCorr);

      ctx.strokeStyle = '#ec4899';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(userX, margin.top);
      ctx.lineTo(userX, margin.top + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Glowing marker circle
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(userX, userY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Update Readout DOM
      if (this.readout) {
        this.readout.innerHTML = `
          <div class="stat-box">
            <span class="stat-lbl">PAIR ANGLE θ</span>
            <span class="stat-val neon-pink">${this.angleDeg.toFixed(1)}°</span>
          </div>
          <div class="stat-box">
            <span class="stat-lbl">CORRELATION μ(θ)</span>
            <span class="stat-val neon-cyan">${userCorr.toFixed(3)}</span>
          </div>
          <div class="stat-box">
            <span class="stat-lbl">SIGNATURE TYPE</span>
            <span class="stat-val neon-amber">${this.curveType.toUpperCase()} (GR)</span>
          </div>
        `;
      }
    }
  },

  // --------------------------------------------------------------------------
  // 2. INTERSTELLAR DISPERSION MEASURE (DM) & DEDISPERSER LAB
  // --------------------------------------------------------------------------
  dedispersion: {
    canvas: null,
    ctx: null,
    trueDM: 42.6, // True interstellar dispersion measure in pc/cm^3
    currentDM: 15.0, // Current user slider setting
    numChannels: 24, // Frequency channels from 1200 MHz to 1800 MHz
    slider: null,
    readout: null,
    animId: null,
    pulsePhase: 0,

    init(canvasId, sliderId, readoutId) {
      this.canvas = document.getElementById(canvasId);
      this.slider = document.getElementById(sliderId);
      this.readout = document.getElementById(readoutId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());

      if (this.slider) {
        this.slider.addEventListener('input', (e) => {
          this.currentDM = parseFloat(e.target.value);
          this.draw();
          if (window.astroAudio) window.astroAudio.playBlip(400 + this.currentDM * 12, 0.02);
        });
      }

      this.startAnim();
    },

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);
      this.width = rect.width;
      this.height = rect.height;
      this.draw();
    },

    startAnim() {
      const loop = () => {
        this.pulsePhase = (this.pulsePhase + 0.02) % 1.0;
        this.draw();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    },

    autoDedisperse() {
      this.currentDM = this.trueDM;
      if (this.slider) this.slider.value = this.trueDM;
      if (window.astroAudio) window.astroAudio.playLockOn();
      this.draw();
    },

    draw() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(5, 7, 15, 0.95)';
      ctx.fillRect(0, 0, w, h);

      // Layout: Top 60% is Dynamic Waterfall Spectrogram, Bottom 35% is Integrated Time-Series Pulse Profile
      const topH = h * 0.58;
      const btmH = h * 0.32;
      const btmY = h * 0.65;
      const margin = { left: 60, right: 30 };
      const plotW = w - margin.left - margin.right;

      // Top Waterfall Title
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('RADIO FREQUENCY WATERFALL SPECTROGRAM (1.2 - 1.8 GHz)', margin.left, 16);

      const dmError = this.trueDM - this.currentDM; // residual dispersion slope

      // Draw Frequency Channels
      const chanH = (topH - 25) / this.numChannels;
      for (let ch = 0; ch < this.numChannels; ch++) {
        const y = 25 + ch * chanH;
        // Channel frequency in GHz (1.8 GHz at top down to 1.2 GHz at bottom)
        const freq = 1.8 - (ch / (this.numChannels - 1)) * 0.6;

        // Dispersion delay formula: Delta_t proportional to dmError * (nu^-2 - nu_ref^-2)
        const nuRef = 1.8;
        const delayFraction = (dmError * 0.018) * ((1 / (freq * freq)) - (1 / (nuRef * nuRef)));

        // Channel background
        ctx.fillStyle = ch % 2 === 0 ? 'rgba(15, 23, 42, 0.6)' : 'rgba(30, 41, 59, 0.4)';
        ctx.fillRect(margin.left, y, plotW, chanH - 1);

        // Pulse position for this channel
        const pulseCenter = ((this.pulsePhase + delayFraction) % 1.0 + 1.0) % 1.0;
        const pulseX = margin.left + pulseCenter * plotW;

        // Draw pulse blob in this frequency channel
        const grad = ctx.createRadialGradient(pulseX, y + chanH / 2, 0, pulseX, y + chanH / 2, chanH * 2.5);
        grad.addColorStop(0, '#00f0ff');
        grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.4)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(pulseX - 25, y, 50, chanH - 1);

        // Frequency tick on left
        if (ch % 6 === 0) {
          ctx.fillStyle = '#64748b';
          ctx.font = '9px monospace';
          ctx.textAlign = 'right';
          ctx.fillText(`${freq.toFixed(2)}G`, margin.left - 6, y + chanH - 2);
        }
      }

      // Bottom Integrated Pulse Profile
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('SUMMED COHERENT PULSE PROFILE (SNR GAIN)', margin.left, btmY - 6);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(margin.left, btmY, plotW, btmH);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.strokeRect(margin.left, btmY, plotW, btmH);

      // Calculate Summed Profile Shape
      // When dmError is 0, all channels add coherently -> razor sharp peak!
      // When dmError is large, pulse is smeared out across full phase.
      const smearWidth = Math.max(0.03, Math.abs(dmError) * 0.015);
      const snrPeak = Math.max(0.15, 1.0 - Math.min(0.85, Math.abs(dmError) * 0.03));

      ctx.strokeStyle = Math.abs(dmError) < 1.0 ? '#10b981' : (Math.abs(dmError) < 5.0 ? '#f59e0b' : '#ef4444');
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      for (let px = 0; px < plotW; px++) {
        const phase = px / plotW;
        // Distance to pulse phase with wraparound
        let dist = Math.abs(phase - this.pulsePhase);
        if (dist > 0.5) dist = 1.0 - dist;

        // Gaussian pulse shape
        const profile = snrPeak * Math.exp(-0.5 * Math.pow(dist / smearWidth, 2));
        const y = btmY + btmH - 8 - profile * (btmH - 16);

        if (px === 0) ctx.moveTo(margin.left + px, y);
        else ctx.lineTo(margin.left + px, y);
      }
      ctx.stroke();

      // Update stats readout
      if (this.readout) {
        const isAligned = Math.abs(dmError) < 0.8;
        this.readout.innerHTML = `
          <div class="stat-box">
            <span class="stat-lbl">CURRENT DM</span>
            <span class="stat-val ${isAligned ? 'neon-emerald' : 'neon-cyan'}">${this.currentDM.toFixed(1)} pc/cm³</span>
          </div>
          <div class="stat-box">
            <span class="stat-lbl">TRUE INTERSTELLAR DM</span>
            <span class="stat-val neon-amber">${this.trueDM.toFixed(1)} pc/cm³</span>
          </div>
          <div class="stat-box">
            <span class="stat-lbl">COHERENT S/N RATIO</span>
            <span class="stat-val ${isAligned ? 'neon-emerald' : 'neon-pink'}">${(snrPeak * 85).toFixed(1)}σ ${isAligned ? '✓ (ALIGNED)' : ''}</span>
          </div>
        `;
      }
    }
  }
};
