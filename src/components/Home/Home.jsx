import { NavLink } from "react-router-dom";
import { FaCss3Alt, FaBootstrap, FaSass, FaHtml5 } from "react-icons/fa";
import "./Home.css";
import { ROUTES } from "../../Routes/routes";

const Home = () => {
  const tabs = [
    {
      name: "HTML CSS Masterclass",
      path: ROUTES.HTML_CSS_PAGE,
      icon: <FaHtml5  />,
      color: "#ff4530",
      description: "Master modern CSS from basics to advanced layouts",
    },
    {
      name: "CSS Masterclass",
      path: ROUTES.CSS_PAGE,
      icon: <FaCss3Alt />,
      color: "#264de4",
      description: "Master modern CSS from basics to advanced layouts",
    },
    {
      name: "Bootstrap Masterclass",
      path: ROUTES.BOOTSTRAP_PAGE,
      icon: <FaBootstrap />,
      color: "#7952b3",
      description: "Build responsive websites faster with Bootstrap",
    },
    {
      name: "SCSS Masterclass",
      path: ROUTES.SCSS_PAGE,
      icon: <FaSass />,
      color: "#cd6799",
      description: "Write maintainable CSS with Sass preprocessor",
    },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          <span className="gradient-text">Masterclass</span> Home
        </h1>
        <p className="hero-description">
          Explore CSS, Bootstrap, and SCSS courses designed to level up your
          design skills. Click a tab to start learning and dive into the world of
          beautiful, responsive UI!
        </p>
        
        {/* Stats Section */}
        {/* <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">15+</span>
            <span className="stat-label">Hours of Content</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">Expert Tracks</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Interactive Examples</span>
          </div>
        </div> */}
      </div>

      {/* Tabs Section */}
      <div className="tabs-section">
        <h2 className="section-title">Choose Your Learning Path</h2>
        <div className="tabs-container">
          {tabs.map((tab, index) => (
            <NavLink
              key={index}
              to={tab.path}
              className="tab-card"
              style={{ "--card-color": tab.color }}
            >
              <div className="card-content">
                <div className="icon-wrapper" style={{ background: `${tab.color}15` }}>
                  <div className="icon" style={{ color: tab.color }}>
                    {tab.icon}
                  </div>
                </div>
                <h3 className="tab-title">{tab.name}</h3>
                <p className="tab-description">{tab.description}</p>
                <div className="card-footer">
                  <span className="start-learning">
                    Start Learning 
                    <svg className="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Features Section */}
      {/* <div className="features-section">
        <h2 className="section-title">Why Choose Our Masterclass?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <h4>Hands-on Projects</h4>
            <p>Build real-world projects and strengthen your portfolio</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <h4>Interactive Learning</h4>
            <p>Learn with live code examples and instant previews</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🏆</div>
            <h4>Expert Instructors</h4>
            <p>Learn from industry professionals with years of experience</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Home;