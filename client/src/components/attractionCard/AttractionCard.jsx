// src/components/attractionCard/AttractionCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaRoute, FaClock } from "react-icons/fa";
import styles from "./attractionCard.module.css";
import { Link } from "react-router-dom";

const AttractionCard = ({
  _id,
  attraction_name,
  attraction_location_name,
  attraction_img,
  attraction_description,
  attraction_difficulty,
  attraction_duration,
  attraction_distance,
}) => {
  const navigate = useNavigate();

  const imageUrl =
    attraction_img ??
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8f9fa'/%3E%3C/svg%3E";

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src =
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1470&q=80";
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const mins = parseInt(minutes, 10);
    if (isNaN(mins)) return "N/A";
    if (mins < 60) return `${mins} min`;
    if (mins < 1440) return `${Math.floor(mins / 60)} hours`;
    return `${Math.floor(mins / 1440)} days`;
  };

  const formatDistance = (distance) => {
    if (!distance) return "N/A";
    const dist = parseFloat(distance);
    return isNaN(dist) ? "N/A" : `${dist.toFixed(dist % 1 === 0 ? 0 : 1)} km`;
  };

  return (
    <div className={styles.card} onClick={() => navigate(`/attraction/${_id}`)}>
      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={attraction_name}
          className={styles.image}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{attraction_name}</h3>
        <div className={styles.location}>
          <FaMapMarkerAlt className={styles.locationIcon} />
          {attraction_location_name}
        </div>
        <p className={styles.description}>{attraction_description}</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <FaClock className={styles.statIcon} />
            {formatDuration(attraction_duration)}
          </div>
          <div className={styles.stat}>
            <FaRoute className={styles.statIcon} />
            {formatDistance(attraction_distance)}
          </div>
        </div>
        <div
          className={`${styles.difficulty} ${
            styles[attraction_difficulty?.toLowerCase()]
          }`}
        >
          {attraction_difficulty}
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;

// Add a Link component around the card
const AttractionCardWithLink = ({ ...props }) => {
  return (
    <Link to={`/attraction/${props._id}`}>
      <AttractionCard {...props} />
    </Link>
  );
};

export { AttractionCardWithLink as AttractionCard };
