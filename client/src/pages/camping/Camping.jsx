import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import styles from "./camping.module.css";
import CampingCard from "../../components/campingCard/CampingCard";
import { getCampingSpots, getCampingSpotById } from "../../services/api";
// import ImgUpload from "../../components/imgUpload/ImgUpload";
import ImageTrail from "../../components/ImageTrail/ImageTrail";
import { useParams } from "react-router-dom";

const Camping = () => {
  const [campingSpots, setCampingSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCamping, setSelectedCamping] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchCampingDetail(id);
    }
  }, [id]);

  const fetchCampingDetail = async (id) => {
    try {
      setDetailLoading(true);
      const response = await getCampingSpotById(id);
      setSelectedCamping(response.data);
    } catch (err) {
      console.error("Error fetching camping detail:", err);
      setError("Failed to fetch camping detail");
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    const fetchCampingSpots = async () => {
      try {
        setLoading(true);
        const response = await getCampingSpots();

        const spots = response.data.map((spot) => {
          const imageFilename = spot.camping_img?.split(",")[0];

          const fullImageUrl = imageFilename
            ? `http://localhost:5000/uploads/camping/${imageFilename}`
            : "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1170&q=80";

          return {
            id: spot.id || spot._id,
            camping_name: spot.camping_location_name || "Unnamed Camping Spot",
            camping_location_name:
              spot.camping_location_name || "Location not specified",
            camping_description:
              spot.camping_description || "No description available",
            camping_img: fullImageUrl,
            camping_duration: spot.camping_duration || "",
            camping_difficulty: spot.camping_difficulty || "",
            camping_distance: spot.camping_distance || "",
          };
        });

        setCampingSpots(spots);
        setError(null);
      } catch (err) {
        console.error("Error fetching camping spots:", err);
        setError("Failed to fetch camping spots");
      } finally {
        setLoading(false);
      }
    };

    fetchCampingSpots();
  }, []);

  return (
    <div className={styles.campingContainer}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinner} />
          <p>Loading camping spots...</p>
        </div>
      ) : (
        <>
          {/* Detailed View */}
          {selectedCamping && (
            <div className={styles.detailedView}>
              <div className={styles.detailHeader}>
                <h2>{selectedCamping.camping_name}</h2>
                <div className={styles.detailBack}>
                  <button onClick={() => setSelectedCamping(null)}>
                    ← Back to List
                  </button>
                </div>
              </div>
              <div className={styles.detailContent}>
                <div className={styles.detailImage}>
                  <img
                    src={selectedCamping.camping_img}
                    alt={selectedCamping.camping_name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1170&q=80";
                    }}
                  />
                </div>
                <div className={styles.detailInfo}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Location:</span>
                    <span>{selectedCamping.camping_location_name}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Difficulty:</span>
                    <span>{selectedCamping.camping_difficulty}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Duration:</span>
                    <span>{selectedCamping.camping_duration} minutes</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Distance:</span>
                    <span>{selectedCamping.camping_distance} km</span>
                  </div>
                  <div className={styles.detailDescription}>
                    <h3>Description</h3>
                    <p>{selectedCamping.camping_description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Content */}
          {!selectedCamping && (
            <>
              {/* אזור תצוגה עליון עם אנימציית תמונות */}
              <div className={styles.discoverSection}>
                <h1>Discover Your Camping Adventure</h1>
                <p className={styles.subTitle}>
                  Escape the ordinary. Find your perfect camping experience under the
                  stars.
                </p>
                <div
                  style={{ height: "450px", position: "relative", overflow: "hidden" }}
                >
                  <ImageTrail
                    items={campingSpots.map((spot, index) => ({
                      key: `trail-${spot.id || index}`, // Adding prefix to ensure unique key
                      url: spot.camping_img,
                    }))}
                    variant={1}
                  />
                </div>
              </div>
              <section className={styles.campingSection}>
                <div className={styles.container}>
                  {error && <div className={styles.errorMessage}>{error}</div>}

                  {campingSpots.length > 0 ? (
                    <div className={styles.campingGrid}>
                      {campingSpots.map((spot) => (
                        <CampingCard
                          key={spot.id}
                          id={spot.id}
                          camping_name={spot.camping_name}
                          camping_location_name={spot.camping_location_name}
                          camping_img={spot.camping_img}
                          camping_description={spot.camping_description}
                          camping_duration={spot.camping_duration}
                          camping_difficulty={spot.camping_difficulty}
                          camping_distance={spot.camping_distance}
                          onClick={() => setSelectedCamping(spot)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>No camping spots found</p>
                    </div>
                  )}

                  {/* <ImgUpload /> */}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Camping;
