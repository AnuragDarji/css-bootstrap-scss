import { NavLink } from "react-router-dom";
import {
  FaCss3Alt,
  FaBootstrap,
  FaSass,
  FaHtml5,
  FaReact,
  FaNodeJs,
} from "react-icons/fa";
import { SiMongodb } from "react-icons/si";

import "./Home.css";
import { ROUTES } from "../../Routes/routes";

const Home = () => {
  const tabs = [
    {
      name: "HTML CSS Masterclass",
      path: ROUTES.HTML_CSS_PAGE,
      icon: <FaHtml5 />,
      color: "#ff4530",
      description: "Learn HTML and CSS to build modern responsive websites",
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
    {
      name: "React Masterclass",
      path: ROUTES.REACT_PAGE,
      icon: <FaReact />,
      color: "#61DBFB",
      description: "Build modern and dynamic web applications using React",
    },
    {
      name: "Node.js Masterclass",
      path: ROUTES.NODE_PAGE,
      icon: <FaNodeJs />,
      color: "#3C873A",
      description: "Learn backend development using Node.js and Express",
    },
    {
      name: "MongoDB Masterclass",
      path: ROUTES.MONGO_PAGE,
      icon: <SiMongodb />,
      color: "#4DB33D",
      description: "Master NoSQL database development using MongoDB",
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
          Explore HTML, CSS, Bootstrap, SCSS, React, Node.js, and MongoDB
          courses designed to level up your development skills. Click a course
          to start learning and build modern web applications.
        </p>
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
                <div
                  className="icon-wrapper"
                  style={{ background: `${tab.color}15` }}
                >
                  <div className="icon" style={{ color: tab.color }}>
                    {tab.icon}
                  </div>
                </div>

                <h3 className="tab-title">{tab.name}</h3>

                <p className="tab-description">{tab.description}</p>

                <div className="card-footer">
                  <span className="start-learning">
                    Start Learning
                    <svg
                      className="arrow-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
