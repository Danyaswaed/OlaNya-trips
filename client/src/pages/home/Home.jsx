import React, { useEffect, useState } from "react";

import AttractionCard from "../../components/attractionCard/AttractionCard";
import CampingCard from "../../components/campingCard/CampingCard";
import { useNavigate } from 'react-router-dom';
import styles from "./home.module.css";

const Home = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [campingSamples, setCampingSamples] = useState([]);
  const [attractionSamples, setAttractionSamples] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load camping examples
    fetch("http://localhost:5000/api/camping/spots")
  .then((res) => res.json())
  .then((data) => {
    console.log("Raw camping data:", data); // ← כאן תראי אם camping_img תקין

    const samples = data.slice(2, 5)
      .filter((camping) => camping.camping_img) // סינון אם אין תמונה
      .map((camping) => ({
        camping_img: `http://localhost:5000/uploads/camping/${camping.camping_img}`,
        camping_name: camping.camping_name,
        camping_description: camping.camping_description,
        camping_location_name: camping.camping_location_name || '',
        camping_difficulty: camping.camping_difficulty || '',
        camping_duration: camping.camping_duration,
        camping_distance: camping.camping_distance || '',
      }));
    setCampingSamples(samples);
  });


    // Load attraction examples
    fetch("http://localhost:5000/api/attractions")
      .then((res) => res.json())
      .then((data) => {
        const samples = data.slice(5, 8).map((attraction) => ({
          attraction_img: `http://localhost:5000/uploads/attractions/${attraction.attraction_img}`,
          attraction_name: attraction.attraction_name,
          attraction_description: attraction.attraction_description,
          attraction_location_name: attraction.attraction_location_name || '',
          attraction_difficulty: attraction.attraction_difficulty || '',
          attraction_duration: attraction.attraction_duration,
          attraction_distance: attraction.attraction_distance || '',
        }));
        setAttractionSamples(samples);
      });

  }, []);

  

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <div className={styles.homeContainer}>
      {/* Welcome Text */}
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeText}>Welcome to DO OlaNya Trips</h1>
      </section>

    

      {/* Featured Camping Spots */}
      <section className={`${styles.recommendationSection} ${styles.campingSection}`}>
        <h2>Featured Camping Spots</h2>
        <div className={styles.cardsGrid}>
        {campingSamples.map((camping, index) => (
          <CampingCard
          key={index} 
          camping_img={camping.camping_img}
          camping_name={camping.camping_name}
          camping_description={camping.camping_description}
          camping_location_name={camping.camping_location_name}
          camping_difficulty={camping.camping_difficulty}
          camping_duration={camping.camping_duration}
          camping_distance={camping.camping_distance}
          className="trip-card"
        />
      ))}
        </div>
      </section>


      {/* Attraction Recommendations */}
      <section className={styles.recommendationSection}>
        <h2>Popular Attractions</h2>
        <div className={styles.cardsGrid}>
          {attractionSamples.map((attraction, index) => (
            <AttractionCard
              key={index}
              attraction_img={attraction.attraction_img}
              attraction_name={attraction.attraction_name}
              attraction_description={attraction.attraction_description}
              attraction_duration={attraction.attraction_duration}
              attraction_distance={attraction.attraction_distance}
              attraction_difficulty={attraction.attraction_difficulty}
            />
          ))}
        </div>
      </section>

      {/* Contact Button */}
      <div className={styles.contactContainer} onClick={handleContactClick}>
        <h3>Let’s connect and plan your next unforgettable trip 🌿</h3>
        <p>Get in Touch With the Do OlaNya Team</p>
      </div>
    </div>
  );
};

export default Home;
