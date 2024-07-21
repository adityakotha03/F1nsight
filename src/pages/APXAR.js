import React, { useRef, useEffect, useState } from 'react';
import '@google/model-viewer/';

export const APXAR = () => {
  const arButton = useRef(null);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (arButton.current) {
      isHidden(arButton.current) ? setHide(true) : setHide(false);
    }
  }, [arButton.current]);

  const isHidden = (element) => {
    return element.offsetParent === null;
  };

  const arCheck = () => {
    setTimeout(() => {
      isHidden(arButton.current) ? setHide(true) : setHide(false);
    }, 500);
  };

  return (
    <div className="apx-ar-container">
      <header className="apx-header">
        <div className="logo">F1NSIGHT</div>
        <nav>
          <button>RESULTS</button>
          <button>COMPARISONS</button>
          <button>RACE VIEWER</button>
        </nav>
      </header>
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
            ref={arButton}
            slot="ar-button"
            className="ar-button"
            onClick={arCheck}
          >
            <img src={APXAR.defaultProps.buttonIcon} alt="AR icon" />
            Launch AR
          </button>
          
        </model-viewer>
        <div className="ar-badge">
          <span>AR Enabled</span>
        </div>
      </div>
      {hide && (
        <a
          href="https://developers.google.com/ar/discover/supported-devices"
          className="ar-not-supported"
        >
          AR not available on this device
        </a>
      )}
      <style jsx>{`
        .apx-ar-container {
          background-color: #f0f5f5;
          text-align: center;
          position: relative;
          overflow: hidden;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .apx-header {
          background-color: #1a202c;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          height: 60px;
        }
        .logo {
          font-weight: bold;
          font-size: 24px;
        }
        nav button {
          background: none;
          border: none;
          color: white;
          margin-left: 20px;
          cursor: pointer;
        }
        .model-viewer-wrapper {
          flex-grow: 1;
          width: 100%;
          position: relative;
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
        .ar-not-supported {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e53e3e;
          color: white;
          position: absolute;
          bottom: 10px;
          left: 0;
          width: 100%;
          padding: 8px;
          text-decoration: none;
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
  glbLink: 'APX/apx_livery_w_logo.glb',
  img: 'APX/poster.webp',
  buttonIcon: 'APX/3diconWhite.png',
  loading: 'eager',
  reveal: 'auto',
  autoRotate: true,
  cameraControls: true,
  shadowIntensity: '1',
  shadowSoftness: '1',
  environmentImage: 'neutral',
  skyboxImage: null,
  exposure: '2',
  ar: true,
  arModes: 'webxr scene-viewer quick-look',
  arScale: 'auto',
  arPlacement: 'floor',
  alt: 'APX GP Model',
  title: 'APX GP Model Viewer',
  link: 'https://www.f1nsight.com/',
};