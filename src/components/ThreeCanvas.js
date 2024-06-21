import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TWEEN from '@tweenjs/tween.js';
import Stats from 'three/addons/libs/stats.module.js';

import { Loading } from "./Loading"
import classNames from 'classnames';

export const ThreeCanvas = ({ MapFile, locData, driverColor, driverSelected, driverCode, fastestLap, isPaused, haloView, controls, speedFactor }) => {
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

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, -7, 10);

    const haloCamera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    haloCamera.position.set(0, 0.6, 0.1);
    haloCamera.rotation.set(Math.PI / 8, Math.PI, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    renderer.setClearColor(0x1f1f1f);

    const control = new OrbitControls(camera, renderer.domElement);
    control.maxDistance = 10;
    control.minDistance = 5;

    const axesHelper = new THREE.AxesHelper( 20 );
    // scene.add( axesHelper );

    // const textureLoader = new THREE.TextureLoader();
    // textureLoader.load('/maps/imola.png', texture => {
    //   const imageWidth = texture.image.width / 100;
    //   const imageHeight = texture.image.height / 100;
    //   const geometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
    //   const material = new THREE.MeshBasicMaterial({ map: texture });
    //   const plane = new THREE.Mesh(geometry, material);
    //   plane.rotation.z = -Math.PI / 2;
    //   scene.add(plane);
    // });

    let map;
    const lo = new GLTFLoader();
    if (MapFile) { 
      lo.load(MapFile, gltf => {
        map = gltf.scene;
        map.scale.set(0.1, 0.1, 0.1);
        map.rotation.x = Math.PI / 2; // causing orbit issue in canvas
        scene.add(map);

        // Calculate the bounding box of the map
        const box = new THREE.Box3().setFromObject(map);
        const center = box.getCenter(new THREE.Vector3());

        // const boxHelper = new THREE.Box3Helper(box, 0xff0000); // Red color for the box
        // scene.add(boxHelper);

        // const min = box.min;
        // const max = box.max;
        // camera.position.set(min.x+1, min.y+1, min.z + 5);

        // control.target.set((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2);
        // control.update();
        
        // Update camera position to be at the center of the map
        camera.position.set(center.x, center.y, center.z + 7);
        // Update the target of the OrbitControls to the center of the map
        control.target.set(center.x, center.y, center.z);
        control.update(); // Apply the changes to the controls

      }, undefined, error => console.error(error));
    }

    let carModel;
    const loader = new GLTFLoader();
    loader.load(`${process.env.PUBLIC_URL + "/car/scene.gltf"}`, gltf => {
      carModel = gltf.scene;
      carModel.scale.set(0.1, 0.1, 0.1);
      carModel.rotation.x = Math.PI / 2;
      carModel.rotation.y = -Math.PI;
      carModel.position.set(carPosition.x, carPosition.y, carPosition.z);
      if(driverSelected && locData.length > 0){
        scene.add(carModel);
        carModel.add(haloCamera);
      }

      if (haloView) {
        control.enabled = false;
      }
      else{
        control.enablePan = true;
        control.enableRotate = true;
        control.enableZoom = true;
      }
      
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
        // camera.position.set(newPosition.x, newPosition.y, 10);

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

      //setCanvasWidth()
      renderer.render(scene, haloView ? haloCamera : camera);
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
  }, [MapFile, locData, driverSelected, speedFactor, isPaused, haloView]);

  const drsActiveNumbers = [10, 12, 14]; // Define the DRS numbers that activate the message
  const handleUnitChange = (newUnit) => {
    if (newUnit === 'mph' && unit !== 'mph') {
      setUnit('mph');
    } else if (newUnit === 'km/h' && unit !== 'km/h') {
      setUnit('km/h');
    }
  };

  return (
    <div className="relative">
      <div ref={mountRef} className="canvas-container max-sm:pointer-events-none" />
      {controls}
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