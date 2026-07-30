import React, { useEffect, useRef } from 'react';
import CompanyLogo from '../Registrationpage/CompanyLogo';
import './SuccessPage.css';

/* ── Confetti particle config ── */
const CONFETTI_COUNT = 120;
const COLORS = ['#2563EB','#06B6D4','#10B981','#F59E0B','#8B5CF6','#EF4444','#EC4899','#FFFFFF'];
const SHAPES = ['square', 'rect', 'circle', 'ribbon'];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function Confetti() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // Spawn particles
    particles.current = Array.from({ length: CONFETTI_COUNT }, () => ({
      x:      randomBetween(0, canvas.width),
      y:      randomBetween(-canvas.height * 0.5, -10),
      vx:     randomBetween(-2.5, 2.5),
      vy:     randomBetween(2, 7),
      rot:    randomBetween(0, 360),
      rotV:   randomBetween(-6, 6),
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      shape:  SHAPES[Math.floor(Math.random() * SHAPES.length)],
      w:      randomBetween(7, 14),
      h:      randomBetween(5, 10),
      alpha:  1,
      gravity: randomBetween(0.05, 0.18),
      swing:  randomBetween(0.02, 0.06),
      swingT: randomBetween(0, Math.PI * 2),
    }));

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      particles.current.forEach(p => {
        // Physics
        p.swingT += p.swing;
        p.vx     += Math.sin(p.swingT) * 0.3;
        p.vy     += p.gravity;
        p.x      += p.vx;
        p.y      += p.vy;
        p.rot    += p.rotV;
        // Fade out after bottom 80%
        if (p.y > canvas.height * 0.75) {
          p.alpha = Math.max(0, p.alpha - 0.015);
        }

        if (p.alpha <= 0) return;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'ribbon') {
          ctx.fillRect(-p.w / 2, -p.h / 4, p.w, p.h / 2);
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w * 0.5, p.h);
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      });

      // Stop once all faded
      const alive = particles.current.some(p => p.alpha > 0 && p.y < canvas.height + 50);
      if (alive) animRef.current = requestAnimationFrame(draw);
    };

    // Small delay so card animation plays first
    const t = setTimeout(() => { animRef.current = requestAnimationFrame(draw); }, 300);

    const onResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}

/* ── Main ── */
export default function SuccessPage({ registrationData }) {
  const {
    fullName    = 'Participant',
    mobile      = 'N/A',
    email       = 'N/A',
    fieldOfStudy = 'Tech Field',
    yearOfStudy  = 'Student',
    demoSlot     = 'Upcoming Slot',
    registrationId = 'ASP-DEMO-001'
  } = registrationData || {};

  return (
    <div className="success-page-bg">
      {/* Confetti blast */}
      <Confetti />

      {/* Ambient orbs */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />

      <div className="success-card-wrapper">
        {/* Brand */}
        <div className="success-brand-header">
          <CompanyLogo width={72} height={72} />
          <div className="company-brand-title">AspireNext Edu Tech</div>
        </div>

        {/* Animated checkmark */}
        <div className="success-badge-ring">
          <svg className="success-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div className="success-header-text">
          <div className="confirmed-pill">
            <span className="live-dot-green" />
            <span>Slot Reserved</span>
          </div>
          <h1 className="success-title">Registration Successful!</h1>
          <p className="success-subtitle">
            Thank you, <strong className="user-highlight">{fullName}</strong>! Your seat for the live demo session has been confirmed.
          </p>
        </div>

        {/* Ticket */}
        <div className="ticket-card-modern">
          <div className="ticket-top">
            <div className="ticket-pass-brand">
              <CompanyLogo width={24} height={24} />
              <span className="ticket-pass-title">AspireNext Pass</span>
            </div>
            <span className="ticket-code">REF: {registrationId}</span>
          </div>

          <div className="ticket-divider-line" />

          <div className="ticket-content-body">
            <div className="slot-highlight-banner">
              <div className="slot-banner-label">
                <svg className="clock-icon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Confirmed Time Slot</span>
              </div>
              <div className="slot-banner-time">{demoSlot}</div>
            </div>

            <div className="ticket-info-grid">
              <div className="info-block">
                <span className="info-label">Attendee Name</span>
                <span className="info-val">{fullName}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Field of Study</span>
                <span className="info-val">{fieldOfStudy}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Year of Study</span>
                <span className="info-val">{yearOfStudy}</span>
              </div>
              <div className="info-block">
                <span className="info-label">Email &amp; Mobile</span>
                <span className="info-val">{email} | {mobile}</span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp only — rebook removed */}
        <div className="action-buttons-stack">
          <a
            href="https://chat.whatsapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-action-btn"
          >
            <div className="whatsapp-shimmer" />
            <svg className="whatsapp-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.854 0-3.603-.497-5.122-1.366l-.367-.21-3.804.997 1.016-3.707-.23-.367a10.02 10.02 0 0 1-1.536-5.321c0-5.539 4.507-10.046 10.046-10.046 2.684 0 5.206 1.045 7.103 2.944 1.898 1.897 2.942 4.418 2.942 7.103 0 5.54-4.507 10.047-10.048 10.047M12.051 0C5.405 0 0 5.405 0 12.051c0 2.12.553 4.188 1.602 6.006L0 24l6.104-1.601a12.004 12.004 0 0 0 5.947 1.564h.005c6.643 0 12.048-5.406 12.048-12.053C24.104 5.405 18.697 0 12.051 0" />
            </svg>
            <span>Join WhatsApp Community</span>
          </a>
        </div>
      </div>
    </div>
  );
}
