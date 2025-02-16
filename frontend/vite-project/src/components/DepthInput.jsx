import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './DepthInput.css';
const DepthInput = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [depth, setDepth] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!depth || isNaN(depth)) {
      alert("Please enter a valid depth value");
      return;
    }
    
    setLoading(true);
    try {
      const depthResponse = await fetch("http://localhost:5000/foodwaste-depth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depth: parseFloat(depth),
          email: "janan@gmal.com"
        }),
      });
      if (!depthResponse.ok) {
        throw new Error("Failed to process depth");
      }
      const depthData = await depthResponse.json();
      navigate("/finale", {
        state: {
          depth: depth,
          email: "janan@gmal.com",
          surfaceResults: depthData.previous_results
        }
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="farm-depth-container">
      <h1 className="farm-depth-title">Enter Container Depth</h1>
      <div className="farm-input-group">
        <label className="farm-input-label">Container Depth (cm):</label>
        <input
          className="farm-depth-input"
          type="number"
          value={depth}
          onChange={(e) => setDepth(e.target.value)}
          min="1"
          step="0.1"
          placeholder="Enter depth in centimeters"
        />
      </div>
      <button 
        className="farm-submit-button"
        onClick={handleSubmit} 
        disabled={loading || !depth}
      >
        {loading ? (
          <>
            <span className="farm-loading-spinner"></span>
            Processing...
          </>
        ) : (
          "Calculate Feed Estimate"
        )}
      </button>
    </div>
  );
};

export default DepthInput;