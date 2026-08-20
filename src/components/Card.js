import React from "react";
import ProfileCard from "./ProfileCard";
import pb from "../assets/card.png";

const Card = () => {
  // Handle scroll to contact section
  const handleContactClick = () => {
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="profile-card-section flex flex-col items-center justify-center bg-transparent relative z-10 py-12">
      <div className="flex justify-center items-center">
        <ProfileCard
          name="BHARATH BASKARAN"
          title="AI Engineer"
          handle="Welcome to my portfolio"
          status="Online"
          contactText="Contact Me"
          avatarUrl={pb} // ✅ local image
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          onContactClick={handleContactClick} // ✅ scroll to Contact section
        />
      </div>
    </div>
  );
};

export default Card;
