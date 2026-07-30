import "./LandingPage.css";
import logo from "../../assets/AspireLogo.jpg";
import {
  FaCalendarAlt,
  FaClock,
  FaLaptop,
  FaUserGraduate,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Aspire Next Logo" className="logo-img" />
          <div className="logo-text">
            <h2>Aspire Next</h2>
            <p>Aspire Your Dreams</p>
          </div>
        </div>

        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#why-join">Why Demo</a>
          </li>
          <li>
            <a href="#courses">Course Timeline</a>
          </li>
          <li>
            <a href="#companies">Companies</a>
          </li>
        </ul>

        <button className="register-btn">Register Now</button>
      </nav>

      <section className="hero" id="home">
        <div className="hero-left">
          <p className="eyebrow">Student Demo Portal</p>
          <h1>
            Welcome to <span>Aspire Next</span>
          </h1>
          <p>
            Join our free online demo session and discover how Aspire Next
            helps students become industry-ready through expert mentorship,
            practical learning, and career guidance.
          </p>
          <div className="hero-actions">
            <button className="hero-btn">Register Now</button>
            <a href="#why-join" className="secondary-link">
              Explore Demo
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <img
              src="https://img.magnific.com/free-photo/young-attractive-smiling-student-showing-thumb-up-outdoors-campus-university_8353-6394.jpg"
              alt="Happy student"
            />
            <div className="hero-card-badge">
              <span>Live Demo</span>
              <strong>Every Saturday</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="why-join" id="why-join">
        <div className="section-header">
          <p className="section-label">Why Join Our Demo?</p>
          <h2>See what makes our program unique</h2>
          <p className="section-copy">
            Learn from industry experts, build real projects, and get the
            confidence to step into your first role.
          </p>
        </div>

        <div className="benefits">
          <div className="benefit">
            <FaCalendarAlt className="icon" />
            <h3>Flexible Scheduling</h3>
            <p>Choose a demo time that fits your routine.</p>
          </div>
          <div className="benefit">
            <FaClock className="icon" />
            <h3>Fast Results</h3>
            <p>Get practical insights in a short, focused session.</p>
          </div>
          <div className="benefit">
            <FaLaptop className="icon" />
            <h3>Hands-On Learning</h3>
            <p>Experience real tools and real workflows from day one.</p>
          </div>
          <div className="benefit">
            <FaUserGraduate className="icon" />
            <h3>Mentor Support</h3>
            <p>Receive guidance from professionals who know the industry.</p>
          </div>
        </div>
      </section>

      <section className="timeline-section" id="courses">
        <div className="section-header center">
          <p className="section-label">Course Timeline</p>
          <h2>Your path to career-ready skills</h2>
        </div>

        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-circle">1</div>
            <div className="timeline-content">
              <h3>Month 1</h3>
              <p>Programming fundamentals, HTML, CSS, JavaScript, and Git.</p>
              <span className="duration-badge">4 Weeks</span>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-circle">2</div>
            <div className="timeline-content">
              <h3>Month 2</h3>
              <p>React, component design, state management, and APIs.</p>
              <span className="duration-badge">4 Weeks</span>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-circle">3</div>
            <div className="timeline-content">
              <h3>Month 3</h3>
              <p>Node, Express, databases, authentication, and backend APIs.</p>
              <span className="duration-badge">4 Weeks</span>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-circle">4</div>
            <div className="timeline-content">
              <h3>Month 4</h3>
              <p>Capstone project, interview prep, and career support.</p>
              <span className="duration-badge">4 Weeks</span>
            </div>
          </div>
        </div>
      </section>

      <section className="companies-section" id="companies">
        <div className="section-header center">
          <p className="section-label">Trusted by companies</p>
          <h2>Top employers love our students</h2>
        </div>

        <div className="companies-track">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" />
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Aspire Next. All Rights Reserved.</p>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
