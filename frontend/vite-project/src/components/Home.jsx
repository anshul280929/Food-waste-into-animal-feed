import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Homepage.module.css";

const Homepage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);

      const previewReader = new FileReader();
      previewReader.onloadend = () => {
        setSelectedImage(previewReader.result);
      };
      previewReader.readAsDataURL(file);

      try {
        const base64Image = await getBase64(file);
        const imageData = base64Image.split(",")[1];

        const response = await fetch("http://localhost:5000/foodwaste", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ image: imageData }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        navigate("/depth-input", {
          state: {
            surfaceResults: data.results,
            image: previewReader.result,
          },
        });
      } catch (error) {
        console.error("Error details:", error);
        alert("Error processing image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.decorativeElements}>
        {/* Clouds */}
        <div className={styles.cloud + " " + styles.cloud1}></div>
        <div className={styles.cloud + " " + styles.cloud2}></div>
        
        {/* Ground and Fence */}
        <div className={styles.ground}></div>
        <div className={styles.fence}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.fencePost}></div>
          ))}
        </div>
        
        {/* Butterflies */}
        <div className={styles.butterfly + " " + styles.butterfly1}></div>
        <div className={styles.butterfly + " " + styles.butterfly2}></div>
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.title}>Food Waste to Animal Feed</h1>
        <p className={styles.subtitle}>Transform your food waste into nutritious animal feed!</p>

        <div className={styles.uploadContainer}>
          <label htmlFor="file-upload" className={styles.uploadButton}>
            {loading ? "Processing..." : "Upload Food Waste Image"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />

          {selectedImage && (
            <div className={styles.previewContainer}>
              <img src={selectedImage} alt="Preview" className={styles.previewImage} />
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Processing your image...</p>
        </div>
      )}
    </div>
  );
};

export default Homepage;