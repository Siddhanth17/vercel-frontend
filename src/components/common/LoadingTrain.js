import React from "react";
import "./LoadingTrain.css";

const LoadingTrain = ({ message = "Loading...", fullScreen = false }) => {
  return (
    <div
      className={`loading-train-container ${fullScreen ? "fullscreen" : ""}`}
    >
      <div className="loading-content">
        <div className="train-animation professional-train-animation">
          <div className="train professional-train">
            <div className="train-engine professional-engine">🚄</div>
            <div className="train-car professional-car">🚃</div>
            <div className="train-car professional-car">🚃</div>
            <div className="train-car professional-car">🚃</div>
          </div>
          <div className="train-track professional-track">
            <div className="track-line"></div>
            <div className="track-ties">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className="loading-message">
          <h3>{message}</h3>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingTrain;
