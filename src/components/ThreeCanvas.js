import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TWEEN from '@tweenjs/tween.js';

import { Loading } from "./Loading"

export const ThreeCanvas = ({ imageFile, locData, driverSelected, pauseButton, controls, speedFactor }) => {
  const [driverDetails, setDriverDetails] = useState(null);
  const [unit, setUnit] = useState('km/h');

  const mountRef = useRef(null);
  const infoRef = useRef(null);

  const ambientLight = useMemo(() => new THREE.AmbientLight(0xffffff, 0.5), []);
  const directionalLight = useMemo(() => {
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(1, 1, 1);
    return light;
  }, []);


  useEffect(() => {
    const scene = new THREE.Scene();
    scene.add(ambientLight);
    scene.add(directionalLight);

    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(800, 600);
    mountRef.current.appendChild(renderer.domElement);

    renderer.setClearColor(0x1f1f1f);

    const control = new OrbitControls(camera, renderer.domElement);
    control.enablePan = true;
    control.panSpeed = 0.5;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageFile, texture => {
      const imageWidth = texture.image.width / 100;
      const imageHeight = texture.image.height / 100;
      const geometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.z = -Math.PI / 2;
      scene.add(plane);
    });

    let carModel;
    const loader = new GLTFLoader();
    loader.load('/car/scene.gltf', gltf => {
      carModel = gltf.scene;
      carModel.scale.set(0.3, 0.3, 0.3);
      carModel.rotation.x = Math.PI / 2;
      carModel.rotation.y = -Math.PI;
      scene.add(carModel);
    }, undefined, error => console.error(error));

    window.addEventListener('resize', setCanvasWidth);

    function setCanvasWidth() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
  }

    const animate = () => {
      if (!mountRef.current) return;
      
      TWEEN.update(); // Ensure this is called to progress tweens
    
      if (carModel && locData.length > 0 && driverSelected && !carModel.userData.tweenActive && pauseButton) {
        const newPosition = locData.shift();
        //console.log('New position:', newPosition); // Log to see the new positions

        carModel.userData.tweenActive = true;
        const initialPosition = { x: carModel.position.x, y: carModel.position.y, z: carModel.position.z }; // Store initial position
        const tween = new TWEEN.Tween(carModel.position)
          .to({ x: newPosition.x, y: newPosition.y, z: 0 }, 10)
        
          .onUpdate(() => {
            // Use initial position for calculating the angle
            const angle = Math.atan2(newPosition.y - initialPosition.y, newPosition.x - initialPosition.x);
            const euler = new THREE.Euler(Math.PI / 2, 0, angle + Math.PI / 2, 'YZX');
            const quaternion = new THREE.Quaternion().setFromEuler(euler);
            carModel.quaternion.copy(quaternion);
            
          })
          .easing(TWEEN.Easing.Linear.None)
          .delay(50 * speedFactor)
          .onComplete(() => {
            carModel.userData.tweenActive = false; // Reset flag when tween completes
            if (infoRef.current) {
              setDriverDetails(newPosition.cardata); // Ensure details are set correctly
            }
          })
          tween.start();        
      }

      setCanvasWidth()
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
    }
      renderer.dispose();
      scene.traverse(object => {
        if (object.material) object.material.dispose();
        if (object.geometry) object.geometry.dispose();
      });
      control.dispose();
      TWEEN.removeAll();
    };
  }, [imageFile, locData, driverSelected, speedFactor, pauseButton]);

  const drsActiveNumbers = [10, 12, 14]; // Define the DRS numbers that activate the message
  const handleUnitChange = (newUnit) => {
    if (newUnit === 'mph' && unit !== 'mph') {
      setUnit('mph');
    } else if (newUnit === 'km/h' && unit !== 'km/h') {
      setUnit('km/h');
    }
  };

  return (
    <div>
      <div ref={mountRef} className="canvas-container" />
      {controls}
      {driverSelected &&
        <div className="w-full mt-32" ref={infoRef}>
          {(infoRef.current && driverDetails) ? (
            <>
              <div className="flex flex-col">
                <p className="font-display text-[128px] leading-none">{unit === 'km/h' ? driverDetails.speed : Math.round(driverDetails.speed * 0.621371)}</p>
                <div className="flex justify-between">
                <button 
                  className={`uppercase text-sm tracking-wide ${unit === 'km/h' ? '' : 'text-neutral-500'}`}
                  onClick={() => handleUnitChange('km/h')}
                >
                  km/h
                </button>
                <button 
                  className={`uppercase text-sm tracking-wide ${unit === 'mph' ? '' : 'text-neutral-500'}`}
                  onClick={() => handleUnitChange('mph')}
                >
                  mph
                </button>
                </div>
                {driverDetails.drs && drsActiveNumbers.includes(driverDetails.drs) &&(
                  <p className="border-solid border-2 border-emerald-700 bg-emerald-900 px-16">DRS Enabled</p>
                )}
              </div>
              <div className="flex flex-col">
                <p className="uppercase text-sm tracking-wide">Throttle</p>
                <div className="shadow-lg mb-8 border-solid border-2 border-neutral-800">
                  <div className="bg-emerald-900 h-24" style={{width: `${driverDetails.throttle}%`}} />
                </div>
                <div className="shadow-lg border-solid border-2 border-neutral-800">
                  <div className="bg-rose-900 h-24" style={{width: `${driverDetails.brake}%`}} />
                </div>
                <p className="uppercase text-sm tracking-wide">Brake</p>
              </div>
              <div className="flex flex-col">
                <p className="uppercase text-sm tracking-wide">Gear</p>
                <p className="font-display text-[128px] leading-none">{driverDetails.n_gear}</p>
              </div>
            </>
          ) : <Loading className="mt-64" />}
        </div>
      }
    </div>
  );
};