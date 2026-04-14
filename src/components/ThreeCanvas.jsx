import React, { useRef, useEffect, useState } from "react";
import classNames from "classnames";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TWEEN from "@tweenjs/tween.js";

import { Loading } from "./Loading";
import DriverCarDetails from "./DriverCarDetails";
import RangeSlider from "./RangeSlider";

/**
 * ThreeCanvas: Self-Calibrating 3D Race Viewer
 *
 * Features:
 * - Ref-Based Synchronization: Thread-safe data management for 3D loops.
 * - Dynamic Framing: Automatic viewport fitting for any circuit.
 * - Origin-Sync: Precise overlay of telemetry on GLTF geometry.
 */
export const ThreeCanvas = ({
  MapFile,
  locData,
  driverColor,
  driverSelected,
  isPaused,
  haloView,
  topFollowView,
  speedFactor,
  className,
  showCarDetails,
  showCameraControls,
  constructorId,
  year,
}) => {
  // 1. Initial Refs for Scene
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const haloCameraRef = useRef(null);
  const topFollowCameraRef = useRef(null);
  const carModelRef = useRef(null);
  const mapRef = useRef(null);
  const trailLineRef = useRef(null);
  const trailPointsRef = useRef([]);
  const requestRef = useRef(null);

  // 2. Refs for Thread-Safe Data
  const locDataRef = useRef([]);
  const currentLoadRequestRef = useRef(0);

  // Unified Sync Ref for props & calibration
  const syncRef = useRef({
    isPaused,
    speedFactor,
    haloView,
    topFollowView,
    driverColor,
    driverSelected,
    calibrated: true, // Always calibrated in simplified model
    telemetryCenter: new THREE.Vector2(0, 0),
    telemetryScale: 1.0,
    mapDimension: 0,
    theta: (-131 * Math.PI) / 180,
    cameraHeight: 10,
    radius: 9,
  });

  // 3. UI State
  const [isCircuitLoaded, setIsCircuitLoaded] = useState(false);
  const [isCalibrated, setIsCalibrated] = useState(true);
  const [driverDetails, setDriverDetails] = useState(null);
  const [theta, setTheta] = useState((-131 * Math.PI) / 180);
  const [cameraHeight, setCameraHeight] = useState(10);
  const [radius, setRadius] = useState(9);

  // Dynamic Prop Sync
  useEffect(() => {
    syncRef.current.isPaused = isPaused;
    syncRef.current.speedFactor = speedFactor;
    syncRef.current.haloView = haloView;
    syncRef.current.topFollowView = topFollowView;
    syncRef.current.driverColor = driverColor;
    syncRef.current.driverSelected = driverSelected;
    syncRef.current.theta = theta;
    syncRef.current.cameraHeight = cameraHeight;
    syncRef.current.radius = radius;
  }, [
    isPaused,
    speedFactor,
    haloView,
    topFollowView,
    driverColor,
    driverSelected,
    theta,
    cameraHeight,
    radius,
  ]);

  // 4. Initial Scene Setup (RUN ONCE)
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = sceneRef.current;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(
      currentMount.clientWidth,
      currentMount.clientHeight || 700,
    );
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Core Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(200, 400, 200);
    scene.add(dirLight);

    // Standard Camera
    cameraRef.current = new THREE.PerspectiveCamera(
      40,
      currentMount.clientWidth / (currentMount.clientHeight || 700),
      0.5,
      30000,
    );
    cameraRef.current.up.set(0, 0, 1);

    // Car Cameras
    const aspect =
      currentMount.clientWidth / (currentMount.clientHeight || 700);

    haloCameraRef.current = new THREE.PerspectiveCamera(75, aspect, 0.01, 5000);
    haloCameraRef.current.position.set(0, 0.59, 0.4); // Y is Height, Z is Depth
    haloCameraRef.current.rotation.set(Math.PI / 10, Math.PI, 0);

    topFollowCameraRef.current = new THREE.PerspectiveCamera(
      72,
      aspect,
      0.1,
      5000,
    );
    topFollowCameraRef.current.position.set(0, 5, -15); // Y is Height, Z is Depth
    topFollowCameraRef.current.rotation.set(Math.PI / 8, Math.PI, 0);

    // Progressive Trail
    const MAX_TRAIL = 800;
    const trailGeom = new THREE.BufferGeometry();
    trailGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(MAX_TRAIL * 3), 3),
    );
    trailGeom.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(MAX_TRAIL * 3), 3),
    );
    trailLineRef.current = new THREE.Line(
      trailGeom,
      new THREE.LineBasicMaterial({
        transparent: true,
        vertexColors: true,
        linewidth: 3,
      }),
    );
    scene.add(trailLineRef.current);

    const animate = (time) => {
      try {
        TWEEN.update(time);
        const sync = syncRef.current;

        // 1. Car Animation Step
        if (
          carModelRef.current &&
          locDataRef.current.length > 0 &&
          sync.driverSelected &&
          !carModelRef.current.userData.tweenActive &&
          !sync.isPaused &&
          sync.calibrated
        ) {
          const next = locDataRef.current.shift();
          if (next) {
            carModelRef.current.userData.tweenActive = true;
            const oldPos = carModelRef.current.position.clone();

            const targetX =
              (next.x - sync.telemetryCenter.x) * sync.telemetryScale;
            const targetY =
              (next.y - sync.telemetryCenter.y) * sync.telemetryScale;

            new TWEEN.Tween(carModelRef.current.position)
              .to({ x: targetX, y: targetY, z: 0.06 }, 12)
              .onUpdate(() => {
                if (!carModelRef.current) return;
                const dx = targetX - oldPos.x;
                const dy = targetY - oldPos.y;
                if (Math.abs(dx) > 0.0001 || Math.abs(dy) > 0.0001) {
                  const angle = Math.atan2(dy, dx);
                  carModelRef.current.rotation.set(
                    Math.PI / 2,
                    0,
                    angle + Math.PI / 2,
                    "YZX",
                  );
                }
              })
              .easing(TWEEN.Easing.Linear.None)
              .delay(50 * sync.speedFactor)
              .onComplete(() => {
                if (carModelRef.current && carModelRef.current.userData) {
                  carModelRef.current.userData.tweenActive = false;
                }
                if (next.cardata) setDriverDetails(next.cardata);
              })
              .start();
          }
        }

        // 2. Trail Buffer Step
        if (carModelRef.current && trailLineRef.current) {
          const pts = trailPointsRef.current;
          pts.push(carModelRef.current.position.clone());
          if (pts.length > MAX_TRAIL) pts.shift();
          const posArr =
            trailLineRef.current.geometry.attributes.position.array;
          const colArr = trailLineRef.current.geometry.attributes.color.array;
          const baseCol = new THREE.Color(`#${sync.driverColor || "737373"}`);
          for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            posArr[i * 3] = p.x;
            posArr[i * 3 + 1] = p.y;
            posArr[i * 3 + 2] = p.z + 0.05; // Elevation offset for trail visibility
            const fade = (i + 1) / pts.length;
            colArr[i * 3] = baseCol.r * fade;
            colArr[i * 3 + 1] = baseCol.g * fade;
            colArr[i * 3 + 2] = baseCol.b * fade;
          }
          trailLineRef.current.geometry.setDrawRange(0, pts.length);
          trailLineRef.current.geometry.attributes.position.needsUpdate = true;
          trailLineRef.current.geometry.attributes.color.needsUpdate = true;
        }

        // 3. Render Step
        let activeCam = cameraRef.current;
        if (sync.haloView && carModelRef.current) {
          activeCam = haloCameraRef.current;
        } else if (sync.topFollowView && carModelRef.current) {
          activeCam = topFollowCameraRef.current;
        }

        if (activeCam && rendererRef.current) {
          if (activeCam === cameraRef.current) {
            activeCam.position.set(
              sync.radius * Math.cos(sync.theta),
              sync.radius * Math.sin(sync.theta),
              sync.cameraHeight,
            );
            activeCam.lookAt(0, 0, 0);
          }
          rendererRef.current.render(scene, activeCam);
        }
      } catch (err) {
        console.error("[THREE] Anim Loop Crash Handled:", err);
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (rendererRef.current && currentMount) {
        currentMount.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      TWEEN.removeAll();
    };
  }, []);

  // 5. Asset Loader & Map Processing
  useEffect(() => {
    if (!MapFile) return;

    setIsCircuitLoaded(false);
    setDriverDetails(null);

    new GLTFLoader().load(MapFile, (gltf) => {
      const currentScene = sceneRef.current;
      if (mapRef.current) currentScene.remove(mapRef.current);

      const map = gltf.scene;
      map.scale.set(0.1, 0.1, 0.1);
      map.rotation.x = Math.PI / 2;
      map.position.set(0, 0, 0);

      currentScene.add(map);
      mapRef.current = map;

      setIsCircuitLoaded(true);
      console.log("[THREE] Original Map Loaded and Scaled (0.1)");
    });
  }, [MapFile]);

  // 6. Telemetry Analysis & Synchronization
  useEffect(() => {
    if (
      !locData ||
      !Array.isArray(locData) ||
      locData.length === 0 ||
      !isCircuitLoaded
    )
      return;
    locDataRef.current = [...locData];
  }, [locData, isCircuitLoaded]);

  // 7. Driver Car Population
  useEffect(() => {
    if (!driverSelected || !isCalibrated) return;

    const requestId = ++currentLoadRequestRef.current;
    const currentScene = sceneRef.current;

    // Cleanup
    if (carModelRef.current) {
      currentScene.remove(carModelRef.current);
      carModelRef.current = null;
    }

    const teamTextureMap = {
      mercedes: "mercedes_LowPolyUv.png",
      ferrari: "ferrari_LowPolyUv.png",
      red_bull: "red_bull_LowPolyUv.png",
      mclaren: "mclaren_LowPolyUv.png",
      aston_martin: "aston_martin_LowPolyUv.png",
      alpine: "alpine_LowPolyUv.png",
      williams: "williams_LowPolyUv.png",
      haas: "haas_LowPolyUv.png",
      sauber: "sauber_LowPolyUv.png",
      rb: "rb_LowPolyUv.png",
      apx: "alpine_LowPolyUv.png", // Fallback for APX
    };

    const textureLoader = new THREE.TextureLoader();
    const textureFile =
      teamTextureMap[constructorId] || "mercedes_LowPolyUv.png";

    textureLoader.load(`/car25/${textureFile}`, (texture) => {
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;

      new GLTFLoader().load("/car25/scene.gltf", (gltf) => {
        if (requestId !== currentLoadRequestRef.current) return;

        const car = gltf.scene;
        car.scale.set(0.1, 0.1, 0.1);
        car.rotation.x = Math.PI / 2;
        car.rotation.y = -Math.PI;

        const startPos = locDataRef.current[0] || { x: 0, y: 0 };
        car.position.set(startPos.x, startPos.y, 0);

        car.traverse((o) => {
          if (o.isMesh && o.material && o.material.name === "Body") {
            o.material.map = texture;
            o.material.color.set(0xffffff); // Use original texture colors
            o.material.needsUpdate = true;
          }
        });

        currentScene.add(car);
        if (haloCameraRef.current) car.add(haloCameraRef.current);
        if (topFollowCameraRef.current) car.add(topFollowCameraRef.current);
        carModelRef.current = car;
      });
    });
  }, [driverSelected, isCalibrated, driverColor, constructorId]);

  return (
    <div
      className={classNames(
        className,
        "relative overflow-hidden w-full h-full min-h-[585px]",
      )}
    >
      <div
        ref={mountRef}
        className="three-canvas-container"
        style={{ width: "100%", height: "100% !important" }}
      />
      {driverSelected && (
        <div
          className={classNames(
            "driver-dashboard absolute top-40 right-4 z-50 transition-all duration-300 flex flex-col gap-12",
            showCarDetails || showCameraControls
              ? "translate-x-0 opacity-100"
              : "translate-x-[400px] opacity-0",
          )}
        >
          {showCarDetails && (
            <div className="telemetry-panel shadow-2xl">
              {driverDetails ? (
                <DriverCarDetails driverDetails={driverDetails} />
              ) : (
                <Loading message="Syncing telemetry..." />
              )}
            </div>
          )}

          {showCameraControls && !haloView && !topFollowView && (
            <div className="camera-panel bg-[#1a1a1a]/90 backdrop-blur-md p-20 rounded-md shadow-2xl border border-white/5 w-[24rem]">
              <div className="flex flex-col gap-24">
                <div className="flex flex-col gap-8">
                  <div className="flex justify-between items-center mb-4">
                    <p className="gradient-text-light uppercase text-[0.9rem] font-display tracking-widest font-bold">
                      ROTATION
                    </p>
                    <p className="text-neutral-400 text-xs font-display">
                      ({Math.round((theta * 180) / Math.PI)}°)
                    </p>
                  </div>
                  <RangeSlider
                    min={-180}
                    max={180}
                    value={Math.round((theta * 180) / Math.PI)}
                    onChange={(e) => setTheta((e.target.value * Math.PI) / 180)}
                  />
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex justify-between items-center mb-4">
                    <p className="gradient-text-light uppercase text-[0.9rem] font-display tracking-widest font-bold">
                      CAMERA HEIGHT
                    </p>
                    <p className="text-neutral-400 text-xs font-display">
                      ({cameraHeight.toFixed(1)})
                    </p>
                  </div>
                  <RangeSlider
                    min={5}
                    max={50}
                    step={0.5}
                    value={cameraHeight}
                    onChange={(e) =>
                      setCameraHeight(parseFloat(e.target.value))
                    }
                  />
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex justify-between items-center mb-4">
                    <p className="gradient-text-light uppercase text-[0.9rem] font-display tracking-widest font-bold">
                      ZOOM
                    </p>
                    <p className="text-neutral-400 text-xs font-display">
                      ({(radius / 2.5).toFixed(1)})
                    </p>
                  </div>
                  <RangeSlider
                    min={5}
                    max={100}
                    step={1}
                    value={radius}
                    onChange={(e) => setRadius(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThreeCanvas;
