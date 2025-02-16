import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Finale.css";

const Finale = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("recipe");

  const userEmail = localStorage.getItem('userEmail') || state?.email;

  useEffect(() => {
    const fetchFinalAnalysis = async () => {
      try {
        if (!state?.depth || !userEmail) {
          throw new Error("Missing depth or email");
        }

        const response = await fetch("http://localhost:5000/finale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            depth: parseFloat(state.depth),
            email: userEmail,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch analysis");
        }

        const data = await response.json();
        setAnalysis(data);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinalAnalysis();
  }, [state, userEmail]);

  if (!state?.depth || !userEmail) {
    navigate("/");
    return null;
  }

  const tabContent = {
    recipe: {
      title: "Recipe Instructions",
      content: analysis?.sections?.recipe
    },
    nutrition: {
      title: "Nutritional Content",
      content: analysis?.sections?.nutritional_content
    },
    recommendations: {
      title: "Recommendations",
      content: analysis?.sections?.recommendations
    },
    feeding: {
      title: "Feeding Capacity",
      content: analysis?.sections?.feeding_capacity
    }
  };

  return (
    <div className="finale-container">
      <h1 className="finale-title">Feed Analysis Results</h1>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Calculating feed analysis...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">⚠️ Error: {error}</p>
          <button onClick={() => navigate("/")} className="error-button">
            Return to Start
          </button>
        </div>
      )}

      {analysis && (
        <div className="analysis-container">
          <div className="parameters-card">
            <div className="parameter">
              <span className="parameter-label">Surface Items:</span>
              <span className="parameter-value">{analysis.surface_data}</span>
            </div>
            <div className="parameter">
              <span className="parameter-label">Container Depth:</span>
              <span className="parameter-value">{analysis.depth} cm</span>
            </div>
            <div className="parameter">
              <span className="parameter-label">Animal Breed:</span>
              <span className="parameter-value">{analysis.animal_name}</span>
            </div>
          </div>

          <div className="tabs-container">
            <div className="tabs-header">
              {Object.keys(tabContent).map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="tab-content">
              <h3 className="tab-title">{tabContent[activeTab].title}</h3>
              <div className="tab-text">
                {tabContent[activeTab].content}
              </div>
            </div>
          </div>

          <div className="button-container">
            <button 
              onClick={() => navigate("/depth-input")}
              className="nav-button"
            >
              ← Back
            </button>
            <button
              onClick={() => navigate("/nutrition-chart")}
              className="nav-button"
            >
              View Nutrition Chart
            </button>
            <button
              onClick={() => navigate("/")}
              className="nav-button"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finale;