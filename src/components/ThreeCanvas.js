import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const ThreeCanvas = ({ imageFile, locData }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 600); // Set fixed size for canvas
    mountRef.current.appendChild(renderer.domElement);

    // Camera and lighting setup
    camera.position.z = 100;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = true;
    controls.panSpeed = 0.5;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Adding image as a texture to a plane geometry
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageFile, texture => {
      const geometry = new THREE.PlaneGeometry(7, 7);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.z = -Math.PI /2 ;
      scene.add(plane);
    });

    // Camera position
    camera.position.z = 5;

    // GLTF car model
    let carModel;
    const loader = new GLTFLoader();
    loader.load('/car/scene.gltf', function (gltf) {
      carModel = gltf.scene;
      carModel.scale.set(0.3, 0.3, 0.3);
      carModel.rotation.x = Math.PI / 2;
      carModel.rotation.y = -Math.PI;
      scene.add(carModel);
    }, undefined, function (error) {
      console.error(error);
    });

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
      
        // Assuming locData is an array of objects with x and y coordinates
        if (carModel && locData.length > 0) {
          const newPosition = locData.shift(); // Get and remove the first position from the array
      
          // Optionally, calculate the angle for rotation if your model needs to face the direction of movement
          let oldPosition = carModel.position;
          oldPosition.x = oldPosition.x + 3;
          oldPosition.y = oldPosition.y + 2;
          const angle = Math.atan2(newPosition.y - oldPosition.y, newPosition.x - oldPosition.x);
      
          // Apply rotation using quaternion to smoothly rotate towards the direction of movement
          const euler = new THREE.Euler(Math.PI / 2, 0, angle + Math.PI / 2, 'YZX');
          const quaternion = new THREE.Quaternion().setFromEuler(euler);
          carModel.quaternion.copy(quaternion);
      
          // Update the carModel's position
          carModel.position.set(newPosition.x - 3, newPosition.y - 2, 0); 
        }
      
        renderer.render(scene, camera);
      };
      
      animate();      

    // Clean up
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [imageFile, locData]); // Depend on locData for reactivity

  return <div ref={mountRef} />;
};

export default ThreeCanvas;
