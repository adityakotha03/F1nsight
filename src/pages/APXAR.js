import React, { useEffect } from 'react';

const styles = `
.apxar-container * {
  box-sizing: border-box;
}

.apxar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.apxar-container h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.apxar-container .model-viewer-container {
  width: 100%;
  max-width: 800px;
  height: 600px;
  position: relative;
}

.apxar-container model-viewer {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  --poster-color: #ffffff;
}

.apxar-container .progress-bar {
  display: block;
  width: 33%;
  height: 10%;
  max-height: 2%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 25px;
  box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.5), 0px 0px 5px 1px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.9);
  background-color: rgba(0, 0, 0, 0.5);
}

.apxar-container .progress-bar.hide {
  visibility: hidden;
  transition: visibility 0.3s;
}

.apxar-container .update-bar {
  background-color: rgba(255, 255, 255, 0.9);
  width: 0%;
  height: 100%;
  border-radius: 25px;
  float: left;
  transition: width 0.3s;
}

.apxar-container #ar-button {
  background-image: url(APX/ar_icon.png);
  background-repeat: no-repeat;
  background-size: 20px 20px;
  background-position: 12px 50%;
  background-color: #fff;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  bottom: 16px;
  padding: 0px 16px 0px 40px;
  font-family: Roboto Regular, Helvetica Neue, sans-serif;
  font-size: 14px;
  color:#4285f4;
  height: 36px;
  line-height: 36px;
  border-radius: 18px;
  border: 1px solid #DADCE0;
  cursor: pointer;
}

.apxar-container #ar-button:active {
  background-color: #E8EAED;
}

.apxar-container #ar-button:focus {
  outline: none;
}

.apxar-container #ar-button:focus-visible {
  outline: 1px solid #4285f4;
}

@keyframes circle {
  from { transform: translateX(-50%) rotate(0deg) translateX(50px) rotate(0deg); }
  to   { transform: translateX(-50%) rotate(360deg) translateX(50px) rotate(-360deg); }
}

@keyframes elongate {
  from { transform: translateX(100px); }
  to   { transform: translateX(-100px); }
}

.apxar-container model-viewer > #ar-prompt {
  position: absolute;
  left: 50%;
  bottom: 60px;
  animation: elongate 2s infinite ease-in-out alternate;
  display: none;
}

.apxar-container model-viewer[ar-status="session-started"] > #ar-prompt {
  display: block;
}

.apxar-container model-viewer > #ar-prompt > img {
  animation: circle 4s linear infinite;
}
`;

export const APXAR = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="apxar-container">
      <style>{styles}</style>
      <h1>APX GP Model Viewer</h1>
      <div className="model-viewer-container">
        <model-viewer
          src="APX/apx_livery_w_logo.glb"
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          tone-mapping="neutral"
          poster="APX/poster.webp"
          shadow-intensity="1"
        >
          <div id="error" class="hide">AR is not supported on this device</div>
          <div className="progress-bar hide" slot="progress-bar">
            <div className="update-bar"></div>
          </div>
          <button slot="ar-button" id="ar-button">
              View in AR
          </button>
          <div id="ar-prompt">
            <img src="APX/ar_hand_prompt.png" alt="AR prompt" />
          </div>
        </model-viewer>
      </div>
    </div>
  );
};

export default APXAR;