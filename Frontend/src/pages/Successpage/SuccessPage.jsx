/**
 * SuccessPage.jsx — Registration Confirmation Page
 * Split two-panel card: left logo panel + right success content panel.
 * Logo-matched brand colors: Royal Blue #4169C8, Deep Navy #1E2B8C.
 */

import React, { useEffect, useRef } from 'react';
import logoImg from '../../assets/Logo_f8hqc0.jpg';
import './SuccessPage.css';

const CONFETTI_COUNT = 130;
const COLORS = ['#4169C8','#1E2B8C','#C0392B','#F59E0B','#10B981','#7096E0','#FFFFFF','#EC4899'];
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

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(p => {
        p.swingT += p.swing;
        p.vx     += Math.sin(p.swingT) * 0.3;
        p.vy     += p.gravity;
        p.x      += p.vx;
        p.y      += p.vy;
        p.rot    += p.rotV;
        if (p.y > canvas.height * 0.75) p.alpha = Math.max(0, p.alpha - 0.015);
        if (p.alpha <= 0) return;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        if (p.shape === 'circle')      { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
        else if (p.shape === 'ribbon') { ctx.fillRect(-p.w / 2, -p.h / 4, p.w, p.h / 2); }
        else if (p.shape === 'rect')   { ctx.fillRect(-p.w / 2, -p.h / 2, p.w * 0.5, p.h); }
        else                           { ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
        ctx.restore();
      });
      const alive = particles.current.some(p => p.alpha > 0 && p.y < canvas.height + 50);
      if (alive) animRef.current = requestAnimationFrame(draw);
    };

    const t = setTimeout(() => { animRef.current = requestAnimationFrame(draw); }, 300);
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(t); cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}

export default function SuccessPage({ registrationData }) {
  const { fullName = 'Participant' } = registrationData || {};

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="sp-bg">
      <Confetti />

      {/* ── Split Card ── */}
      <div className="sp-card">

        {/* LEFT — Logo panel */}
        <div className="sp-left">
          <div className="sp-left-inner">
            <div className="sp-logo-ring">
              <img src={logoImg} alt="AspireNext Logo" className="sp-logo-img" />
            </div>
            <p className="sp-left-sub">Empowering students with industry-ready skills and expert mentorship.</p>
          </div>
        </div>

        {/* RIGHT — Success content */}
        <div className="sp-right">
          {/* Animated check */}
          <div className="sp-check-ring">
            <svg className="sp-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="sp-title">Registration Successful!</h1>
          <p className="sp-subtitle">
            Thank you, <strong className="sp-name">{fullName}</strong>!<br/>
            Your seat for the live demo session has been confirmed. We'll see you soon! 
          </p>

          <a
            href="https://chat.whatsapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="sp-whatsapp-btn"
          >
            <div className="sp-btn-shimmer" />
            <svg viewBox="0 0 24 24" fill="currentColor" className="sp-wa-icon">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.854 0-3.603-.497-5.122-1.366l-.367-.21-3.804.997 1.016-3.707-.23-.367a10.02 10.02 0 0 1-1.536-5.321c0-5.539 4.507-10.046 10.046-10.046 2.684 0 5.206 1.045 7.103 2.944 1.898 1.897 2.942 4.418 2.942 7.103 0 5.54-4.507 10.047-10.048 10.047M12.051 0C5.405 0 0 5.405 0 12.051c0 2.12.553 4.188 1.602 6.006L0 24l6.104-1.601a12.004 12.004 0 0 0 5.947 1.564h.005c6.643 0 12.048-5.406 12.048-12.053C24.104 5.405 18.697 0 12.051 0"/>
            </svg>
            <span>Join WhatsApp Community</span>
          </a>
        </div>
      </div>
    </div>
  );
}
