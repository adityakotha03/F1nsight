import React, { useRef, useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TWEEN from '@tweenjs/tween.js';
import Stats from 'three/addons/libs/stats.module.js';

import { Loading } from "./Loading"

export const ThreeCanvas = ({ MapFile, locData, driverColor, driverSelected, year,  driverCode, fastestLap, constructorId, isPaused, haloView, topFollowView, speedFactor, className }) => {
  const [driverDetails, setDriverDetails] = useState(null);
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0, z: 0 });
  const [unit, setUnit] = useState('km/h');

  // useEffect(() => {
  //   const element = document.querySelector('.app-container');
  //   if (element && driverSelected) {
  //     element.style.overflow = 'hidden';
  //     document.documentElement.style.overflow = 'hidden';
  //   } else {
  //     element.style.overflow = 'auto';
  //     document.documentElement.style.overflow = 'auto';
  //   }
  // }, [driverSelected]);

  const mountRef = useRef(null);
  const infoRef = useRef(null);
  let stats;
  
  const directionalLight1 = useMemo(() => {
    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(100, 20, 20);
    return light;
  }, []);
  const directionalLight2 = useMemo(() => {
    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(-50, -100, 20);
    return light;
  }, []);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.add(directionalLight1);
    scene.add(directionalLight2);
  
    stats = new Stats();
    // document.body.appendChild( stats.dom );
  
    // --- Main Camera Setup (Using Z as Up & Dynamic Tilt) ---
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    // We want the track to lie flat (at z = 0), so our target is fixed at track level.
    const target = new THREE.Vector3(0, 0, 0);
    // Instead of using spherical coordinates with a fixed phi,
    // we define horizontal parameters (radius and theta) and a separate cameraHeight.
    let radius = 7;             // Horizontal distance from target.
    let theta = -Math.PI / 2;     // Horizontal angle (so initial position is (0, -7, ?)).
    let cameraHeight = 10;        // Vertical position of the camera.
  
    // Set Z as the up vector.
    camera.up.set(0, 0, 1);
  
    // Update the camera position based on our parameters.
    function updateCameraPosition() {
      camera.position.x = target.x + radius * Math.cos(theta);
      camera.position.y = target.y + radius * Math.sin(theta);
      camera.position.z = cameraHeight;
      // Always look at the track's center (z = 0) so the tilt adjusts naturally.
      camera.lookAt(new THREE.Vector3(target.x, target.y, 0));
    }
    updateCameraPosition();
  
    // --- Halo Camera (Remains Unchanged) ---
    const haloCamera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    haloCamera.position.set(0, 0.6, 0.4);
    haloCamera.rotation.set(Math.PI / 8, Math.PI, 0);
    
    // --- Top Follow Camera (Remains Unchanged) ---
    const topFollowCamera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    topFollowCamera.position.set(4, 2, -4);
    topFollowCamera.rotation.set(Math.PI / 8, Math.PI, 0);
    topFollowCamera.lookAt(new THREE.Vector3(0, 0, 0));
  
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    renderer.setClearColor(0x1f1f1f);
  
    // --- Custom Camera Controls ---
    // Horizontal drag rotates around the target.
    // Vertical drag adjusts cameraHeight so that the camera tilts appropriately.
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
  
    function onMouseDown(e) {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  
    function onMouseMove(e) {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };
  
      // Update horizontal angle.
      theta -= deltaMove.x * 0.005;
      // Update camera height (invert delta for natural feel)
      cameraHeight -= deltaMove.y * 0.01;
      updateCameraPosition();
      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  
    function onMouseUp() {
      isDragging = false;
    }
  
    // Mouse wheel for zoom (adjust radius).
    function onWheel(e) {
      radius += e.deltaY * 0.01;
      radius = Math.max(5, Math.min(20, radius));
      updateCameraPosition();
    }
  
    if (!haloView || !topFollowView) {
      renderer.domElement.addEventListener('mousedown', onMouseDown);
      renderer.domElement.addEventListener('mousemove', onMouseMove);
      renderer.domElement.addEventListener('mouseup', onMouseUp);
      renderer.domElement.addEventListener('wheel', onWheel);
    }
    // --- End Custom Camera Controls ---
  
    // --- Light Trail Setup ---
    // This creates a trail that records the car’s positions.
    const maxTrailPoints = 50;
    let trailPoints = [];
    
    const trailGeometry = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(maxTrailPoints * 3);
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailColors = new Float32Array(maxTrailPoints * 3);
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    const trailMaterial = new THREE.LineBasicMaterial({
      transparent: true,
      vertexColors: true,
      linewidth: 3,
      // Note: linewidth support is limited in many browsers.
    });
    const trailLine = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trailLine);
  
    // Update the trail geometry each frame.
    function updateTrail() {
      const positions = trailGeometry.attributes.position.array;
      const colors = trailGeometry.attributes.color.array;
      const baseColor = new THREE.Color(`#${driverColor ? driverColor : '737373'}`);
      const offset = 0.05; // Raise the trail 0.1 units off the ground
      for (let i = 0; i < trailPoints.length; i++) {
        const point = trailPoints[i];
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z + offset;
        // Fade: newest points (at end) are brighter.
        const fade = (i + 1) / trailPoints.length;
        colors[i * 3] = baseColor.r * fade;
        colors[i * 3 + 1] = baseColor.g * fade;
        colors[i * 3 + 2] = baseColor.b * fade;
      }
      trailGeometry.setDrawRange(0, trailPoints.length);
      trailGeometry.attributes.position.needsUpdate = true;
      trailGeometry.attributes.color.needsUpdate = true;
    }
    // --- End Light Trail Setup ---
  
    // --- Load the Map ---
    let map;
    const lo = new GLTFLoader();
    if (MapFile) {
      lo.load(
        MapFile,
        (gltf) => {
          map = gltf.scene;
          map.scale.set(0.1, 0.1, 0.1);
          // Rotate the map so it lies flat.
          map.rotation.x = Math.PI / 2;
          scene.add(map);

          console.log('here', map.material)
  
          // Center the map.
          const box = new THREE.Box3().setFromObject(map);
          const center = box.getCenter(new THREE.Vector3());
          target.copy(center);
          target.z = 0; // Ensure the target is at track level.
          const dx = camera.position.x - center.x;
          const dy = camera.position.y - center.y;
          theta = Math.atan2(dy, dx);
          radius = Math.sqrt(dx * dx + dy * dy);
          updateCameraPosition();
        },
        undefined,
        (error) => console.error(error)
      );
    }
  
    // --- Load the Car Model ---
    let carModel;
    const loader = new GLTFLoader();
    loader.load(
      `${process.env.PUBLIC_URL + "/car25/scene.gltf"}`,
      (gltf) => {
        carModel = gltf.scene;
        carModel.scale.set(0.1, 0.1, 0.1);
        carModel.rotation.x = Math.PI / 2;
        carModel.rotation.y = -Math.PI;
        carModel.position.set(carPosition.x, carPosition.y, carPosition.z);
        if (driverSelected && locData.length > 0) {
          scene.add(carModel);
          carModel.add(haloCamera);
          carModel.add(topFollowCamera);
        }
        carModel.traverse((object) => {          
          if (object.isMesh && object.material.name === 'Body') {
            if (year < 2025) {
              // For previous years, use a color for the material.
              object.material.map = null;
              object.material.color.setHex(`0x${driverColor ? driverColor : '737373'}`);
              object.material.needsUpdate = true;
            } else {
              const textureLoader = new THREE.TextureLoader();
              const texturePath = `${process.env.PUBLIC_URL}/car25/${constructorId}_LowPolyUv.png`;
              textureLoader.load(texturePath, (texture) => {
                texture.flipY = false;
                object.material.map = texture;
                object.material.needsUpdate = true;
              });
            }
          }
        });
      },
      undefined,
      (error) => console.error(error)
    );
  
    window.addEventListener('resize', setCanvasWidth);
    function setCanvasWidth() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  
    // --- Animate ---
    const animate = () => {
      if (!mountRef.current) return;
  
      TWEEN.update();
  
      if (carModel && locData.length > 0 && driverSelected && !carModel.userData.tweenActive && !isPaused) {
        const newPosition = locData.shift();
        setCarPosition(newPosition);
  
        carModel.userData.tweenActive = true;
        const initialPosition = {
          x: carModel.position.x,
          y: carModel.position.y,
          z: carModel.position.z,
        };
        const tween = new TWEEN.Tween(carModel.position)
          .to({ x: newPosition.x, y: newPosition.y, z: 0 }, 10)
          .onUpdate(() => {
            const angle = Math.atan2(newPosition.y - initialPosition.y, newPosition.x - initialPosition.x);
            const euler = new THREE.Euler(Math.PI / 2, 0, angle + Math.PI / 2, 'YZX');
            const quaternion = new THREE.Quaternion().setFromEuler(euler);
            carModel.quaternion.copy(quaternion);
          })
          .easing(TWEEN.Easing.Linear.None)
          .delay(50 * speedFactor)
          .onComplete(() => {
            carModel.userData.tweenActive = false;
            if (infoRef.current) {
              setDriverDetails(newPosition.cardata);
            }
          });
        tween.start();
      }
  
      // Update the trail by recording the car's current position.
      if (carModel) {
        trailPoints.push(carModel.position.clone());
        if (trailPoints.length > maxTrailPoints) {
          trailPoints.shift();
        }
        updateTrail();
      }
  
      renderer.render(scene, haloView ? haloCamera : topFollowView ? topFollowCamera : camera);
      requestAnimationFrame(animate);
      stats.update();
    };
  
    animate();
  
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.traverse((object) => {
        if (object.material) object.material.dispose();
        if (object.geometry) object.geometry.dispose();
      });
      if (!haloView || !topFollowView) {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('wheel', onWheel);
      }
      TWEEN.removeAll();
    };
  }, [MapFile, locData, driverSelected, speedFactor, isPaused, haloView, topFollowView]);

  const drsActiveNumbers = [10, 12, 14]; // Define the DRS numbers that activate the message
  const handleUnitChange = (newUnit) => {
    if (newUnit === 'mph' && unit !== 'mph') {
      setUnit('mph');
    } else if (newUnit === 'km/h' && unit !== 'km/h') {
      setUnit('km/h');
    }
  };

  return (
    <div className={classNames(className, "relative")}>
      <div ref={mountRef} className="three-canvas-container max-sm:pointer-events-none" />
      {driverSelected &&
        <div className="driver-data absolute top-1 right-1" ref={infoRef}>
          {(infoRef.current && driverDetails) ? (
            <div className="p-16 shadow-xl bg-neutral-800/90 backdrop-blur-sm">
              <div className="flex flex-col">
                <p className="uppercase text-[1rem] tracking-sm leading-none">Gear</p>
                <div className="flex items-center justify-between">
                  {[1,2,3,4,5,6,7,8].map((number, index) => (
                    <p 
                      key={number} 
                      className={classNames(
                        "font-display ease-in-out leading-none", 
                        driverDetails.n_gear === number ? 'text-xl' : 'text-neutral-400',
                      )}
                    >
                      {number}
                    </p>
                  ))}
                </div>
              </div>

              <div className="divider-glow-dark mt-8" />

              <div className="flex gap-32">
                <div className="flex flex-col w-[10rem] sm:w-[20rem]">
                  <p className="font-display max-sm:text-[2.4rem] sm:text-[6.4rem] leading-none">{unit === 'km/h' ? driverDetails.speed : Math.round(driverDetails.speed * 0.621371)}</p>
                  <div className="flex gap-16 uppercase text-[1rem] tracking-sm">
                    <button 
                      className={`${unit === 'km/h' ? '' : 'text-neutral-400'}`}
                      onClick={() => handleUnitChange('km/h')}
                    >
                      km/h
                    </button>
                    /
                    <button 
                      className={`${unit === 'mph' ? '' : 'text-neutral-400'}`}
                      onClick={() => handleUnitChange('mph')}
                    >
                      mph
                    </button>
                  </div>
                  <p 
                    className={classNames("max-sm:text-[1rem] border-solid border-2 px-16 mt-8 text-center", drsActiveNumbers.includes(driverDetails.drs) ? 'border-emerald-700 bg-emerald-900 text-emerald-500' : 'border-neutral-700 bg-neutral-900 text-neutral-700')}
                  >
                    DRS Enabled
                  </p>
                </div>
              </div>

              <div className="divider-glow-dark mt-8" />

              <div className="flex flex-col">
                <p className="uppercase text-[1rem] tracking-sm">Throttle</p>
                <div className="shadow-lg mb-8 bg-emerald-950">
                  <div className="bg-gradient-to-r from-emerald-700 to-emerald-400 h-12 ease-in-out" style={{width: `${driverDetails.throttle}%`}} />
                </div>
                <div className="shadow-lg bg-rose-950">
                  <div className="bg-gradient-to-r from-rose-800 to-rose-600 h-12 ease-in-out" style={{width: `${driverDetails.brake}%`}} />
                </div>
                <p className="uppercase text-[1rem] tracking-sm">Brake</p>
              </div>
              
            </div>
          ) : <Loading className="mt-64" />}
        </div>
      }
    </div>
  );
};