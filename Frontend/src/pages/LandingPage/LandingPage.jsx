import React, { useState } from "react";
import "./LandingPage.css";
import logo from "../../assets/AspireLogo.jpg";
import {
  FaCalendarAlt,
  FaClock,
  FaLaptopCode,
  FaUserGraduate,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaRocket,
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaAward
} from "react-icons/fa";

const companies = [
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
  { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_2017.svg" },
  { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
];

const timelineSteps = [
  {
    step: "01",
    month: "Month 1",
    title: "Web Foundations & Modern JS",
    description: "Master semantic HTML5, modern CSS flex/grid, ES6+ JavaScript, DOM manipulation, git version control, and responsive design principles.",
    duration: "4 Weeks",
    icon: <FaCode />,
    skills: ["HTML5", "CSS3", "JavaScript ES6+", "Git & GitHub", "Responsive Design"]
  },
  {
    step: "02",
    month: "Month 2",
    title: "React Ecosystem & Dynamic Apps",
    description: "Build component-driven single-page applications with React, custom Hooks, State Management, API integration, and modern UI library patterns.",
    duration: "4 Weeks",
    icon: <FaRocket />,
    skills: ["React 19", "React Router", "State Management", "REST APIs", "Vite"]
  },
  {
    step: "03",
    month: "Month 3",
    title: "Backend Architecture & Databases",
    description: "Develop scalable RESTful microservices with Node.js & Express, relational & NoSQL databases, JWT authentication, and secure API endpoints.",
    duration: "4 Weeks",
    icon: <FaBriefcase />,
    skills: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "JWT Auth"]
  },
  {
    step: "04",
    month: "Month 4",
    title: "Capstone, DevOps & Career Launch",
    description: "Deploy end-to-end fullstack projects to cloud platforms, undergo mock technical interviews, optimize resume, and get direct job referral access.",
    duration: "4 Weeks",
    icon: <FaAward />,
    skills: ["Fullstack Project", "CI/CD & Cloud", "System Design", "Mock Interviews", "Placement Support"]
  }
];

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="landing-page">
      {/* Background Decorative Ambient Lights */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="ambient-glow glow-3"></div>

      {/* Navigation Header */}
      <nav className="navbar-container">
        <div className="navbar">
          <div className="logo">
            <img src={logo} alt="Aspire Next Logo" className="logo-img" />
            <div className="logo-text">
              <h2>Aspire Next</h2>
              <p>Aspire Your Dreams</p>
            </div>
          </div>

          <ul className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
            <li><a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li><a href="#why-join" onClick={() => setMobileMenuOpen(false)}>Why Demo</a></li>
            <li><a href="#courses" onClick={() => setMobileMenuOpen(false)}>Course Timeline</a></li>
            <li><a href="#companies" onClick={() => setMobileMenuOpen(false)}>Companies</a></li>
          </ul>

          <div className="nav-actions">
            <button className="register-btn glow-btn">Register Now</button>
            <button 
              className="mobile-toggle-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-left">
            <h1>
              Build Your Tech Future With <span>Aspire Next</span>
            </h1>

            <p className="hero-description">
              Transform your passion into a high-paying tech career. Join our interactive, expert-led live demo session and discover our industry-proven full-stack roadmap.
            </p>

            <div className="hero-actions">
              <button className="hero-btn primary-glow">
                Register Now <FaArrowRight className="btn-icon" />
              </button>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card-wrapper">
              <div className="card-glow-bg"></div>
              <div className="hero-card">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                  alt="Students collaborating at Aspire Next"
                  className="hero-image"
                />
                <div className="glass-floating-tag tag-top">
                  <FaGraduationCap className="tag-icon" />
                  <div>
                    <strong>Industry Experts</strong>
                    <span>1-on-1 Mentorship</span>
                  </div>
                </div>
                <div className="glass-floating-tag tag-bottom">
                  <FaCheckCircle className="tag-icon check-icon" />
                  <div>
                    <strong>Guaranteed Projects</strong>
                    <span>Real-world portfolio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Demo Section */}
      <section className="why-join" id="why-join">
        <div className="section-container">
          <div className="section-header center">
            <span className="section-label">WHY JOIN OUR DEMO?</span>
            <h2>Experience The Aspire Next Advantage</h2>
            <p className="section-copy">
              Our live demo gives you an insider look into how we help complete beginners and aspiring devs transform into confident software engineers.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <FaCalendarAlt className="icon" />
              </div>
              <h3>Flexible Demo Schedule</h3>
              <p>Choose convenient weekend or evening demo slots tailored to fit your busy schedule.</p>
              <div className="card-accent-line"></div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <FaClock className="icon" />
              </div>
              <h3>Fast-Track Roadmap</h3>
              <p>Get a clear 16-week execution plan detailing every technology required for modern jobs.</p>
              <div className="card-accent-line"></div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <FaLaptopCode className="icon" />
              </div>
              <h3>Hands-On Project Labs</h3>
              <p>Work on live coding exercises during the demo and experience our interactive learning portal.</p>
              <div className="card-accent-line"></div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <FaUserGraduate className="icon" />
              </div>
              <h3>Direct Mentor Guidance</h3>
              <p>Interact live with senior engineers from top tech firms and clarify all your career questions.</p>
              <div className="card-accent-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Timeline Section */}
      <section className="timeline-section" id="courses">
        <div className="section-container">
          <div className="section-header center">
            <span className="section-label">CURRICULUM ROADMAP</span>
            <h2>Attractive & Structured Course Timeline</h2>
            <p className="section-copy">
              Step-by-step 4-month immersive learning track designed with advanced tech stacks and industry standards.
            </p>
          </div>

          <div className="advanced-timeline">
            <div className="timeline-central-line"></div>

            {timelineSteps.map((item, index) => (
              <div 
                className={`timeline-card-row ${index % 2 === 0 ? "row-left" : "row-right"}`} 
                key={index}
              >
                <div className="timeline-node">
                  <span className="node-number">{item.step}</span>
                  <div className="node-pulse"></div>
                </div>

                <div className="timeline-card">
                  <div className="card-header">
                    <div className="month-badge-wrap">
                      <span className="month-badge">{item.month}</span>
                      <span className="duration-pill"><FaClock /> {item.duration}</span>
                    </div>
                    <div className="card-icon">{item.icon}</div>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  <div className="skills-tags">
                    {item.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="skill-chip">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section - Infinite Marquee */}
      <section className="companies-section" id="companies">
        <div className="section-container">
          <div className="section-header center">
            <span className="section-label">TOP EMPLOYERS</span>
            <h2>Our Alumni Work at Top Companies</h2>
            <p className="section-copy">
              Graduates from Aspire Next have been placed at industry leaders and fast-growing tech unicorns.
            </p>
          </div>
        </div>

        {/* Infinite Moving Marquee Ticker (Right to Left) */}
        <div className="marquee-wrapper">
          <div className="marquee-fade-left"></div>
          <div className="marquee-fade-right"></div>

          <div className="marquee-track">
            {/* First Set of Logos */}
            {companies.map((comp, idx) => (
              <div key={`comp-1-${idx}`} className="company-logo-card">
                <img src={comp.logo} alt={comp.name} title={comp.name} />
                <span>{comp.name}</span>
              </div>
            ))}
            {/* Second Set of Logos (for continuous loop) */}
            {companies.map((comp, idx) => (
              <div key={`comp-2-${idx}`} className="company-logo-card">
                <img src={comp.logo} alt={comp.name} title={comp.name} />
                <span>{comp.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo">
                <img src={logo} alt="Aspire Next Logo" className="logo-img" />
                <div className="logo-text">
                  <h2>Aspire Next</h2>
                  <p>Aspire Your Dreams</p>
                </div>
              </div>
              <p className="brand-desc">
                Empowering students and job-seekers to master fullstack web engineering through practical mentorship, live projects, and dedicated career guidance.
              </p>
            </div>

            <div className="footer-links-group">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#why-join">Why Demo</a></li>
                <li><a href="#courses">Course Timeline</a></li>
                <li><a href="#companies">Hiring Companies</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Aspire Next. All Rights Reserved.</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

