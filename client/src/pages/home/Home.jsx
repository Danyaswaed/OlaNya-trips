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
    //שליפת נתוני קמפינג
    const fetchCampingData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/camping/spots");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Raw camping data:", data);

        const samples = data
          .slice(2, 5)
          .filter((camping) => camping.camping_img)
          .map((camping) => ({
            camping_img: `http://localhost:5000/uploads/camping/${camping.camping_img}`,
            camping_name: camping.camping_name,
            camping_description: camping.camping_description,
            camping_location_name: camping.camping_location_name || "",
            camping_difficulty: camping.camping_difficulty || "",
            camping_duration: camping.camping_duration,
            camping_distance: camping.camping_distance || "",
          }));
        setCampingSamples(samples);
      } catch (error) {
        console.error("Error fetching camping data:", error);
        // Set some default data or empty array
        setCampingSamples([]);
      }
    };

    //שליפת נתוני אטרקציות
    const fetchAttractionData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/attractions");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const samples = data.slice(5, 8).map((attraction) => ({
          attraction_img: `http://localhost:5000/uploads/attractions/${attraction.attraction_img}`,
          attraction_name: attraction.attraction_name,
          attraction_description: attraction.attraction_description,
          attraction_location_name: attraction.attraction_location_name || "",
          attraction_difficulty: attraction.attraction_difficulty || "",
          attraction_duration: attraction.attraction_duration,
          attraction_distance: attraction.attraction_distance || "",
        }));
        setAttractionSamples(samples);
      } catch (error) {
        console.error("Error fetching attraction data:", error);
        // Set some default data or empty array
        setAttractionSamples([]);
      }
    };

    // Execute both fetches
    fetchCampingData();
    fetchAttractionData();
  }, []);

  

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to DO OlaNya Trips</h1>
          <p className={styles.heroSubtitle}>Explore nature's wonders through our curated camping experiences and exciting attractions</p>
          <div className={styles.heroActions}>
            <button className={styles.primaryButton} onClick={() => navigate('/trips')}>Explore Trips</button>
            <button className={styles.secondaryButton} onClick={() => navigate('/camping')}>View Camping Spots</button>
            <button className={styles.secondaryButton} onClick={() => navigate('/attractions')}>View Attractions</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.sectionTitle}>Why Choose DO OlaNya Trips</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <h3>Expert Planning</h3>
              <p>Our experienced team helps you plan the perfect trip tailored to your needs</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-tent"></i>
              </div>
              <h3>Quality Gear</h3>
              <p>Access to premium camping equipment and modern facilities</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-hiking"></i>
              </div>
              <h3>Safe Adventures</h3>
              <p>Guided tours with professional guides ensuring your safety</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-heart"></i>
              </div>
              <h3>Memorable Experiences</h3>
              <p>Create lasting memories with our curated experiences</p>
            </div>
          </div>
        </div>
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
