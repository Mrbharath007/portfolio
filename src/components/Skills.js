import React, { useState, useEffect, useRef } from "react";
import {
  SiHtml5, SiTailwindcss, SiCss, SiJavascript, SiReact,
  SiAngular, SiVite, SiNextdotjs, SiNodedotjs, SiMysql,
  SiFirebase, SiMongodb, SiPython, SiPhp, SiTensorflow,
  SiPytorch, SiOpencv, SiNumpy, SiFlutter, SiGithub,
  SiGooglecloud, SiJenkins
} from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";
import Floating3DObjects from "./Floating3DObjects";
import "../styles/Skills.css";

const skillsData = [
  { name: "HTML", category: "Frontend", icon: <SiHtml5 /> },
  { name: "CSS", category: "Frontend", icon: <SiCss /> },
  { name: "JavaScript", category: "Frontend", icon: <SiJavascript /> },
  { name: "ReactJS", category: "Frontend", icon: <SiReact /> },
  { name: "Angular", category: "Frontend", icon: <SiAngular /> },
  { name: "Vite", category: "Frontend", icon: <SiVite /> },
  { name: "Tailwind", category: "Frontend", icon: <SiTailwindcss /> },
  { name: "NextJS", category: "Frontend", icon: <SiNextdotjs /> },
  { name: "NodeJS", category: "Backend & DB", icon: <SiNodedotjs /> },
  { name: "MySQL", category: "Backend & DB", icon: <SiMysql /> },
  { name: "Firebase", category: "Backend & DB", icon: <SiFirebase /> },
  { name: "MongoDB", category: "Backend & DB", icon: <SiMongodb /> },
  { name: "GCP (Google Cloud)", category: "Cloud & DevOps", icon: <SiGooglecloud /> },
  { name: "AWS", category: "Cloud & DevOps", icon: <FaAws /> },
  { name: "Azure", category: "Cloud & DevOps", icon: <VscAzure /> },
  { name: "Jenkins (CI/CD)", category: "Cloud & DevOps", icon: <SiJenkins /> },
  { name: "Python", category: "AI & Data Science", icon: <SiPython /> },
  { name: "Java", category: "Backend & DB", icon: <FaJava /> },
  { name: "PHP", category: "Backend & DB", icon: <SiPhp /> },
  { name: "TensorFlow", category: "AI & Data Science", icon: <SiTensorflow /> },
  { name: "PyTorch", category: "AI & Data Science", icon: <SiPytorch /> },
  { name: "OpenCV", category: "AI & Data Science", icon: <SiOpencv /> },
  { name: "NumPy", category: "AI & Data Science", icon: <SiNumpy /> },
  { name: "Flutter", category: "Mobile & Tools", icon: <SiFlutter /> },
  { name: "Github", category: "Mobile & Tools", icon: <SiGithub /> },
];

const categories = ["All", "AI & Data Science", "Frontend", "Backend & DB", "Cloud & DevOps", "Mobile & Tools"];

const Skills = ({ mainColor = "#7b61ff" }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRef = useRef(null);

  // 3D Card Tilt on Mouse Move
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)`;
  };

  const filteredSkills = skillsData.filter((skill) => {
    const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = sectionElement.querySelectorAll(".skill-card");
            cards.forEach((card) => {
              card.classList.remove("animate");
              void card.offsetWidth; // trigger reflow
              card.classList.add("animate");
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionElement);
    return () => observer.disconnect();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="skills-container" id="skills" ref={sectionRef}>
      <h1 className="skills-title">My Technical Arsenal</h1>

      {/* Floating 3D Holographic Object */}
      <div className="skills-3d-header" style={{ maxWidth: "340px", margin: "-15px auto 10px auto" }}>
        <Floating3DObjects mainColor={mainColor} height="160px" mode="dodecahedron" />
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="skills-controls">
        <div className="skills-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`skills-tab ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="skills-search-input"
          placeholder="Search skill (e.g. Python, React)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="skills-grid">
        {filteredSkills.map((skill, index) => (
          <div
            className="skill-card cursor-target animate"
            key={skill.name}
            style={{ animationDelay: `${(index % 8) * 0.08}s` }}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="skill-icon">{skill.icon}</div>
            <div className="skill-name">{skill.name}</div>
            <span className="skill-category-badge">{skill.category}</span>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <p className="no-skills-message">No skills matched your search.</p>
      )}
    </div>
  );
};

export default Skills;
