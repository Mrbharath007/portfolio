import React, { useState } from "react";
import Interactive3DScene from "./Interactive3DScene";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Navigation, Pagination, EffectCoverflow, Autoplay } from "swiper/modules";

// Icons
import { FaGithub } from "react-icons/fa";

// Styles
import "../styles/Project.css";

// Images
import p1 from "../assets/1.png";
import p2 from "../assets/2.png";
import p4 from "../assets/4.png";
import p9 from "../assets/9.png";
import p5 from "../assets/5.png";
import p10 from "../assets/10.png";
import p6 from "../assets/6.png";
import p11 from "../assets/11.png";
import p8 from "../assets/8.png";
import p13 from "../assets/13.png";
import p7 from "../assets/7.png";
import p14 from "../assets/14.png";
import p19 from "../assets/19.png";
import p15 from "../assets/15.png";
import p16 from "../assets/16.png";
import p18 from "../assets/18.png";

// Project data
const initialProjects = [
  { id: 1, image: p1, name: "Geonet", category: "Web & Python", tags: ["Geo Location", "React", "Python"], description: "Geo location based attendance tracking system for admins.", github: "https://github.com/Mrbharath007/geolocation_based_attandace_admin.git" },
  { id: 2, image: p16, name: "Realestate App", category: "Web & Python", tags: ["Python", "Django", "Real Estate"], description: "Buy or sell property platform with advanced filters.", github: "https://github.com/Mrbharath007/Realestate.git" },
  { id: 3, image: p2, name: "Deep Fake Detection", category: "AI & ML", tags: ["AI", "Deep Learning", "CV"], description: "AI system to analyze and detect deep fake media.", github: "https://github.com/Mrbharath007/deepfake_detection.git" },
  { id: 4, image: p4, name: "NIHA Mobile App", category: "Mobile & Flutter", tags: ["Flutter", "AI Assistant", "Dart"], description: "Smart assistant mobile application for personal productivity.", github: "https://github.com/Mrbharath007/NiHa-product.git" },
  { id: 5, image: p9, name: "Movie Review App", category: "Mobile & Flutter", tags: ["Flutter", "Firebase", "API"], description: "Read and post reviews for trending films.", github: "https://github.com/Mrbharath007/movie_review_app.git" },
  { id: 6, image: p5, name: "Farmer Mobile App", category: "Mobile & Flutter", tags: ["Flutter", "E-Commerce", "AgriTech"], description: "Direct market access platform for farmers.", github: "https://github.com/Mrbharath007/animal-ecommerce--app.git" },
  { id: 7, image: p10, name: "Library Book Search", category: "Web & Python", tags: ["Python", "NLP", "Search"], description: "Smart assistant for cataloging and book search.", github: "https://github.com/Mrbharath007/Library_book_management_app.git" },
  { id: 8, image: p6, name: "Billed Roots", category: "AI & ML", tags: ["AI Invoice", "OCR", "FinTech"], description: "Generate & analyze invoices with AI assistance.", github: "https://github.com/Mrbharath007/Billedroots-accountants.git" },
  { id: 9, image: p11, name: "Fire Detection System", category: "AI & ML", tags: ["OpenCV", "YOLO", "Python"], description: "Detect fire hazards in real-time using Computer Vision.", github: "https://github.com/Mrbharath007/fire_detection.git" },
  { id: 10, image: p8, name: "Museum Chat Bot", category: "Bots & Extensions", tags: ["NLP", "Chatbot", "AI"], description: "Interactive museum guide powered by NLP.", github: "https://github.com/Mrbharath007/Museum_chat_bot.git" },
  { id: 11, image: p14, name: "BMI Calculator", category: "Web & Python", tags: ["Python", "Health", "GUI"], description: "Body Mass Index calculator with health recommendations.", github: "https://github.com/Mrbharath007/BMI_calculator.git" },
  { id: 12, image: p7, name: "License Plate Detector", category: "AI & ML", tags: ["Computer Vision", "React", "Python"], description: "Automatic license plate recognition system.", github: "https://github.com/Mrbharath007/License-plate-detection-using-python-react.git" },
  { id: 13, image: p15, name: "Law Assistant Bot", category: "Bots & Extensions", tags: ["NLP", "Legal Tech", "AI"], description: "Legal query resolution chatbot using NLP models.", github: "https://github.com/Mrbharath007/law_chatbot.git" },
  { id: 14, image: p13, name: "Asset Management", category: "Web & Python", tags: ["Python", "Database", "Admin"], description: "Track and organize organizational assets.", github: "https://github.com/Mrbharath007/college_management.git" },
  { id: 15, image: p19, name: "Hack Blocker", category: "Bots & Extensions", tags: ["Browser Ext", "Cybersecurity"], description: "Block phishing and malicious links via Google extension.", github: "https://github.com/Mrbharath007/HackBlocker.git" },
  { id: 16, image: p18, name: "School Bus Tracker", category: "Mobile & Flutter", tags: ["Django", "GPS", "Flutter"], description: "Real-time school bus route and safety tracking.", github: "https://github.com/Mrbharath007/School-bus-routing-django.git" },
];

const categories = ["All", "AI & ML", "Mobile & Flutter", "Web & Python", "Bots & Extensions"];

const Project = ({ mainColor = "#7b61ff" }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = initialProjects.filter((project) => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="project-page-container" id="projects">
      <h1 className="main-project-title">Featured Creations</h1>

      {/* Interactive 3D Hyper Torus Knot Portal */}
      <div style={{ maxWidth: "340px", margin: "-10px auto 10px auto" }}>
        <Interactive3DScene mode="portal-knot" mainColor={mainColor} height="150px" />
      </div>

      {/* Filter Tabs & Search */}
      <div className="project-controls">
        <div className="project-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`project-tab ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="project-search-input"
          placeholder="Search projects (e.g. AI, Flutter, Python)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="swiper-container-wrapper">
        <Swiper
          key={`${selectedCategory}-${searchQuery}`}
          modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={filteredProjects.length > 2}
          autoplay={{
            delay: 3800,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 35,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          className="mySwiper"
        >
          {filteredProjects.map((project) => (
            <SwiperSlide key={project.id} className="project-swiper-slide cursor-target">
              <div className="slide-content">
                <div className="image-wrapper">
                  <img src={project.image} alt={project.name} className="project-image" />
                  <span className="project-category-tag">{project.category}</span>
                </div>
                <div className="project-info">
                  <div>
                    <h3 className="project-name">{project.name}</h3>
                    <div className="project-tags">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="project-tag">{tag}</span>
                      ))}
                    </div>
                    <p className="project-description">{project.description}</p>
                  </div>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link cursor-target"
                    >
                      <FaGithub aria-hidden="true" />
                      <span>View on GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {filteredProjects.length === 0 && <p className="no-projects-message">No matching projects found.</p>}
    </div>
  );
};

export default Project;
