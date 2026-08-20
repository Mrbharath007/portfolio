// AreaOfInterest.js
import React, { useState } from "react";
import Interactive3DScene from "./Interactive3DScene";
import "../styles/AreaOfInterest.css";
import { AiOutlineRobot } from "react-icons/ai";
import { FaCode, FaAndroid, FaApple, FaChartLine, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const domains = [
  { name: "Artificial Intelligence", icon: <AiOutlineRobot /> },
  { name: "Web Development", icon: <FaCode /> },
  { name: "Android App Development", icon: <FaAndroid /> },
  { name: "IOS App Development", icon: <FaApple /> },
  { name: "Data Analyst", icon: <FaChartLine /> }
];

const AreaOfInterest = ({ mainColor = "#7b61ff" }) => {
  // manualOffset adds to the auto-rotation
  const [manualOffset, setManualOffset] = useState(0);

  const rotateLeft = () => {
    setManualOffset((prev) => prev - 30);
  };

  const rotateRight = () => {
    setManualOffset((prev) => prev + 30);
  };

  return (
    <div className="area-of-interest" id="domains">
      <h1 className="area-title">Area of Interest</h1>
      
      {/* Interactive 3D Multi-Axis Quantum Gyroscope */}
      <div style={{ maxWidth: "300px", margin: "-10px auto 10px auto" }}>
        <Interactive3DScene mode="quantum-gyro" mainColor={mainColor} height="150px" />
      </div>

      <div className="carousel-container">
        <div className="arrow left-arrow" onClick={rotateLeft}>
          <FaArrowLeft />
        </div>
        <div className="carousel">
          <div
            className="carousel-rotation-direction"
            style={{ "--manual-offset": `${manualOffset}deg` }}
          >
            <ul
              className="carousel-item-wrapper"
              style={{ "--_num-elements": domains.length }}
            >
              {domains.map((domain, index) => (
                <li
                  key={index}
                  className="carousel-item"
                  style={{ "--_index": index + 1 }}
                >
                  <div className="carousel-content">
                    <div className="domain-icon">{domain.icon}</div>
                    <p>{domain.name}</p>
                  </div>
                </li>
              ))}
              <li className="carousel-ground"></li>
            </ul>
          </div>
        </div>
        <div className="arrow right-arrow" onClick={rotateRight}>
          <FaArrowRight />
        </div>
      </div>
    </div>
  );
};

export default AreaOfInterest;
