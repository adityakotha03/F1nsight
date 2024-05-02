import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TWEEN from '@tweenjs/tween.js';
import Stats from 'three/addons/libs/stats.module.js';

import { Loading } from "./Loading"
import classNames from 'classnames';

export const ThreeCanvas = ({ imageFile, locData, driverColor, driverSelected, fastestLap, isPaused, controls, speedFactor }) => {
  const [driverDetails, setDriverDetails] = useState(null);
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0, z: 0 });
  const [unit, setUnit] = useState('km/h');

  const mountRef = useRef(null);
  const infoRef = useRef(null);
  let stats;

  // console.log(driverDetails);
  // if(!isPaused){
  //   console.log(carPosition);
  // }
  
  const ambientLight = useMemo(() => new THREE.AmbientLight(0xffffff, 0.5), []);
  const directionalLight = useMemo(() => {
    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(1, 1, 1);
    return light;
  }, []);


  useEffect(() => {
    const scene = new THREE.Scene();
    scene.add(ambientLight);
    scene.add(directionalLight);

    stats = new Stats();
		document.body.appendChild( stats.dom );

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = -2;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    renderer.setClearColor(0x1f1f1f);

    const control = new OrbitControls(camera, renderer.domElement);
    control.maxDistance = 10;
    control.minDistance = 5;
    control.enableZoom = false;
    control.enableRotate = false;
    //control.enablePan = false;

    // Manual rotation setup
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', function(e) {
        if (e.button === 0) {  // Left mouse button begins rotation
            isDragging = true;
            previousMousePosition.x = e.clientX;
            previousMousePosition.y = e.clientY;
        }
    });

    renderer.domElement.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const deltaMove = {
                x: e.clientX - previousMousePosition.x
            };

            const zRotation = deltaMove.x * 0.005;  // Sensitivity factor for rotation
            camera.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -zRotation);  // Negative for right-hand rule
        }

        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    });

    renderer.domElement.addEventListener('mouseup', function(e) {
        if (e.button === 0) {  // Left mouse button ends rotation
            isDragging = false;
        }
    });

    const axesHelper = new THREE.AxesHelper( 20 );
    scene.add( axesHelper );

    let map;
    const lo = new GLTFLoader();
    lo.load('/map/bahrain.gltf', gltf => {
      map = gltf.scene;
      map.scale.set(0.1, 0.1, 0.1);
      map.rotation.x = Math.PI / 2;
      scene.add(map);
    }, undefined, error => console.error(error));

    let carModel;
    const loader = new GLTFLoader();
    loader.load('/car/scene.gltf', gltf => {
      carModel = gltf.scene;
      carModel.scale.set(0.1, 0.1, 0.1);
      carModel.rotation.x = Math.PI / 2;
      carModel.rotation.y = -Math.PI;
      carModel.position.set(carPosition.x, carPosition.y, carPosition.z);
      scene.add(carModel);
      //uncomment the below 3 line to get first person
      // carModel.add(camera); 
      // camera.position.set(0, 0.6, 0.1);
      // camera.rotation.set(Math.PI/8, Math.PI, 0);

      // carModel.traverse(object => {
      //   if (object.isMesh) {
      //     // Check if the material is of type MeshStandardMaterial or MeshBasicMaterial
      //     if (object.material instanceof THREE.MeshStandardMaterial || object.material instanceof THREE.MeshBasicMaterial) {
      //       console.log('Material:', object.material); // Log the material to inspect it
      //     }
      //   }
      // });
      carModel.traverse(object => {
        if (object.isMesh && object.material.name === 'main_body_colour_Red.001') {
          // Change the color of the car material
          object.material.color.setHex(`0x${driverColor ? driverColor : 737373}`);
        }
      });
    }, undefined, error => console.error(error));

    window.addEventListener('resize', setCanvasWidth);

    function setCanvasWidth() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    const animate = () => {
      if (!mountRef.current) return;
      
      TWEEN.update();
    
      if (carModel && locData.length > 0 && driverSelected && !carModel.userData.tweenActive && !isPaused) {
        const newPosition = locData.shift();
        setCarPosition(newPosition);
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
              setDriverDetails(newPosition.cardata);
            }
          })
          tween.start();        
      }

      setCanvasWidth()
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
      stats.update();
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
  }, [imageFile, locData, driverSelected, speedFactor, isPaused]);

  const drsActiveNumbers = [10, 12, 14]; // Define the DRS numbers that activate the message
  const handleUnitChange = (newUnit) => {
    if (newUnit === 'mph' && unit !== 'mph') {
      setUnit('mph');
    } else if (newUnit === 'km/h' && unit !== 'km/h') {
      setUnit('km/h');
    }
  };

  return (
    <div className='relative'>
      <div ref={mountRef} className="canvas-container" />
      {controls}
      {driverSelected &&
        <div className="driver-data absolute top-1 right-1" ref={infoRef}>
          {(infoRef.current && driverDetails) ? (
            <div className="p-16 shadow-xl bg-neutral-800/90 backdrop-blur-sm">
              <div className="flex flex-col">
                <p className="uppercase text-[1rem] tracking-sm">Gear</p>
                <div className="flex items-center justify-between">
                  {[1,2,3,4,5,6,7,8].map((number, index) => (
                    <p 
                      key={number} 
                      className={classNames(
                        "font-display ease-in-out", 
                        driverDetails.n_gear === number ? 'text-xl' : 'text-neutral-500',
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
                      className={`${unit === 'km/h' ? '' : 'text-neutral-500'}`}
                      onClick={() => handleUnitChange('km/h')}
                    >
                      km/h
                    </button>
                    /
                    <button 
                      className={`${unit === 'mph' ? '' : 'text-neutral-500'}`}
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
                  <div className="bg-gradient-to-r from-emerald-700 to-emerald-400 h-24 ease-in-out" style={{width: `${driverDetails.throttle}%`}} />
                </div>
                <div className="shadow-lg bg-rose-950">
                  <div className="bg-gradient-to-r from-rose-800 to-rose-600 h-24 ease-in-out" style={{width: `${driverDetails.brake}%`}} />
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