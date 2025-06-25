import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./camping.module.css";

const CampingDetail = () => {
  const { id } = useParams();
  const [camping, setCamping] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCamping = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/camping/spots/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch camping data');
        }
        const data = await response.json();
        setCamping(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCamping();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!camping) return <div className={styles.notFound}>Camping not found</div>;

  const imageUrl = `http://localhost:5000/uploads/camping/${camping.camping_img}`;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.imageContainer}>
        <img 
          src={imageUrl} 
          alt={camping.camping_name}
          className={styles.mainImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1470&q=80";
          }}
        />
      </div>
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>{camping.camping_name}</h1>
        <div className={styles.infoContainer}>
          <div className={styles.infoItem}>
            <span className={styles.icon}>📍</span>
            <span className={styles.infoText}>{camping.camping_location_name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.icon}>⏱️</span>
            <span className={styles.infoText}>{camping.camping_duration} minutes</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.icon}>📏</span>
            <span className={styles.infoText}>{camping.camping_distance} km</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.icon}>💪</span>
            <span className={styles.infoText}>{camping.camping_difficulty}</span>
          </div>
        </div>
        <div className={styles.description}>
          <h2>Description</h2>
          <p>{camping.camping_description}</p>
        </div>
      </div>
    </div>
  );
};

export default CampingDetail;
