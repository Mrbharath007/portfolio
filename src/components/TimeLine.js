import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Interactive3DScene from "./Interactive3DScene";
import "../styles/TimeLine.css";
import { GraduationCap, Briefcase, Building2, Calendar } from "lucide-react";

const MY_EVENTS = [
  {
    year: "2017 - 2018",
    title: "SSLC",
    subtitle: "ARC Kamatchi Matric Hr Sec School",
    description:
      "Completed my Secondary School Leaving Certificate with strong academic performance.",
    icon: <GraduationCap className="timeline-icon" />,
  },
  {
    year: "2019 - 2020",
    title: "HSC",
    subtitle: "ARC Kamatchi Matric Hr Sec School",
    description: "Completed Higher Secondary with focus on Computer Science.",
    icon: <GraduationCap className="timeline-icon" />,
  },
  {
    year: "2020 - 2024",
    title: "B.Tech. Artificial Intelligence and Data Science",
    subtitle: "Sri Ramakrishna Engineering College",
    description:
      "Graduated with a solid foundation in Data Science, AI, and full-stack development.",
    icon: <GraduationCap className="timeline-icon" />,
  },
  {
    year: "2024 - 2025",
    title: "SDE Intern",
    subtitle: "IBots",
    description:
      "Worked on real-time AI-driven software development as a Software Development Engineer Intern.",
    icon: <Briefcase className="timeline-icon" />,
  },
  {
    year: "2025 - Current",
    title: "System Engineer",
    subtitle: "TCS",
    description:
      "Currently working as a System Engineer at Tata Consultancy Services, focusing on AI and system design.",
    icon: <Building2 className="timeline-icon" />,
  },
];

const TimeLine = ({ mainColor = "#7b61ff" }) => {
  const containerRef = useRef(null);
  const [fillHeight, setFillHeight] = useState(0);

  useEffect(() => {
    let animId;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Line starts filling as soon as container enters lower half of screen (65% from top)
      const triggerPoint = windowHeight * 0.65;
      const currentScrollDepth = triggerPoint - rect.top;
      const totalContainerHeight = rect.height || 1;

      if (totalContainerHeight > 0) {
        let percent = (currentScrollDepth / totalContainerHeight) * 100;
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        setFillHeight(percent);
      }
    };

    const triggerUpdate = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(handleScroll);
    };

    // Passive scroll and resize listeners
    window.addEventListener("scroll", triggerUpdate, { passive: true });
    window.addEventListener("resize", triggerUpdate, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", triggerUpdate);
      window.removeEventListener("resize", triggerUpdate);
    };
  }, []);

  return (
    <div className="timeline-section" id="timeline">
      <h2 className="timeline-title">My Journey</h2>

      {/* Interactive 3D Chrono-Helix Time Spiral */}
      <div style={{ maxWidth: "300px", margin: "-10px auto 20px auto" }}>
        <Interactive3DScene mode="chrono-helix" mainColor={mainColor} height="150px" />
      </div>

      <div
        ref={containerRef}
        className="timeline-container"
        style={{ position: "relative" }}
      >
        {/* The Track (Gray Background Line) */}
        <div className="timeline-line">
          {/* The Progress Fill (Colored Glowing Line) */}
          <div
            className="timeline-line-progress"
            style={{
              height: `${fillHeight}%`,
              background: `linear-gradient(180deg, ${mainColor} 0%, #00d2ff 100%)`,
              boxShadow: `0 0 15px ${mainColor}, 0 0 25px ${mainColor}`,
            }}
          />
        </div>

        {/* Timeline Items */}
        {MY_EVENTS.map((event, index) => {
          const itemThreshold = (index / (MY_EVENTS.length - 1)) * 90;
          const isActive = fillHeight >= itemThreshold;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`timeline-item ${index % 2 === 0 ? "left" : "right"} ${
                isActive ? "active" : ""
              }`}
            >
              <div
                className={`timeline-dot ${isActive ? "active-dot" : ""}`}
                style={{
                  borderColor: isActive ? mainColor : "#444",
                  color: isActive ? mainColor : "#888",
                  boxShadow: isActive
                    ? `0 0 16px ${mainColor}`
                    : "0 0 10px rgba(0,0,0,0.5)",
                }}
              >
                {event.icon}
              </div>
              <div className="timeline-box cursor-target">
                <span
                  className="timeline-year"
                  style={{ color: isActive ? mainColor : "#aaa" }}
                >
                  <Calendar className="calendar-icon" /> {event.year}
                </span>
                <h3 className="timeline-heading">{event.title}</h3>
                {event.subtitle && (
                  <p className="timeline-subtitle">{event.subtitle}</p>
                )}
                <p className="timeline-description">{event.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeLine;
