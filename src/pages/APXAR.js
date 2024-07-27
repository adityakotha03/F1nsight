import React from 'react';
import '@google/model-viewer/';

export const APXAR = () => {

  return (
    <div className="apx-ar-container">
      <div className="model-viewer-wrapper">
        <model-viewer
          poster={APXAR.defaultProps.img}
          src={APXAR.defaultProps.glbLink}
          ar-modes={APXAR.defaultProps.arModes}
          ar={APXAR.defaultProps.ar}
          ar-scale={APXAR.defaultProps.arScale}
          camera-controls={APXAR.defaultProps.cameraControls}
          exposure={APXAR.defaultProps.exposure}
          loading={APXAR.defaultProps.loading}
          shadow-intensity={APXAR.defaultProps.shadowIntensity}
          shadow-softness={APXAR.defaultProps.shadowSoftness}
          alt={APXAR.defaultProps.alt}
        >
          <button
            slot="ar-button"
            className="ar-button"
          >
            <img src={APXAR.defaultProps.buttonIcon} alt="AR icon" />
            Launch AR
          </button>
        </model-viewer>
        <div className="ar-badge">
          <span>AR Enabled</span>
        </div>
      </div>
      <style jsx="true">{`
        .apx-ar-container {
          background-color: #f0f5f5;
          text-align: center;
          position: relative;
          overflow: hidden;
          top: 65px;
          width: 100vw;
          height: 60vh;
          display: flex;
          flex-direction: column;
        }
        .model-viewer-wrapper {
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        model-viewer {
          width: 100%;
          height: 100%;
          background-color: #f0f5f5;
        }
        .ar-button {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #3182ce;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .ar-button img {
          width: 15px;
          margin-right: 8px;
        }
        .ar-badge {
          background-color: #3182ce;
          position: absolute;
          right: -50px;
          top: 2rem;
          width: 200px;
          transform: rotate(45deg);
          padding: 8px;
        }
        .ar-badge span {
          font-size: 12px;
          text-transform: uppercase;
          font-weight: bold;
          letter-spacing: 0.05em;
          color: white;
        }
        @media (max-width: 768px) {
          .ar-badge {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default APXAR;

APXAR.defaultProps = {
  glbLink: `${process.env.PUBLIC_URL + "/APX/apx_livery_w_logo.glb"}`,
  img: `${process.env.PUBLIC_URL + "/APX/poster.webp"}`,
  buttonIcon: `${process.env.PUBLIC_URL + "/APX/3diconWhite.png"}`,
  loading: 'auto',
  reveal: 'auto',
  autoRotate: true,
  cameraControls: true,
  shadowIntensity: '1',
  shadowSoftness: '1',
  environmentImage: 'neutral',
  skyboxImage: null,
  exposure: '2',
  ar: true,
  arModes: 'scene-viewer quick-look',
  arScale: 'auto',
  arPlacement: 'floor',
  alt: 'APX GP Model'
};