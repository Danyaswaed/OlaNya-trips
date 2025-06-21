// src/pages/attraction/Attractions.jsx
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../services/api";
import AttractionCard from "../../components/attractionCard/AttractionCard";
import styles from "./attraction.module.css";
import ImageTrail from "../../components/ImageTrail/ImageTrail";

const Attractions = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await axiosInstance.get("/attractions");
        const data = response.data.map((attr) => {
          const image = attr.attraction_img?.split(",")[0];
          const imageUrl = image
            ? `http://localhost:5000/uploads/attractions/${image}`
            : "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1170&q=80";
          return { ...attr, attraction_img: imageUrl };
        });
        setAttractions(data);
        setError(null);
      } catch (err) {
        console.error("Error loading attractions:", err);
        setError("Failed to load attractions");
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []);

  if (loading) return <div className={styles.loading}>טוען...</div>;

  return (
    <div className={styles.attractionsPage}>
      <div className={styles.hero}>
        <h1>Explore Exciting Attractions</h1>
        <p>From serene spots to adrenaline adventures – we've got them all</p>
        <div className={styles.trailWrapper}>
          <ImageTrail
            items={attractions.map((a, i) => ({
              key: `image-${a._id || `attr-${i}`}`,
              url: a.attraction_img,
            }))}
            variant={1}
          />
        </div>
      </div>

      <div className={styles.gridContainer}>
        {error && <div className={styles.error}>{error}</div>}

        {attractions.length > 0 ? (
          <div className={styles.grid}>
            {attractions.map((attr, i) => (
              <AttractionCard key={attr._id || `attr-${i}`} {...attr} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>אין אטרקציות להצגה כרגע</div>
        )}
      </div>
    </div>
  );
};

export default Attractions;
