import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const ThreeCanvas = ({ imageFile, locData }) => {
  const mountRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 600); // Set fixed size for canvas
    mountRef.current.appendChild(renderer.domElement);

    // Camera and lighting setup
    camera.position.z = 5;
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
      // Get the original dimensions of the image
      const imageWidth = texture.image.width/100;
      const imageHeight = texture.image.height/100;
      const geometry = new THREE.PlaneGeometry(imageWidth, imageHeight);

      const material = new THREE.MeshBasicMaterial({ map: texture });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.z = -Math.PI / 2;
      scene.add(plane);
    });

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
          oldPosition.x = oldPosition.x + 2;
          oldPosition.y = oldPosition.y + 2;
          const angle = Math.atan2(newPosition.y - oldPosition.y, newPosition.x - oldPosition.x);
      
          // Apply rotation using quaternion to smoothly rotate towards the direction of movement
          const euler = new THREE.Euler(Math.PI / 2, 0, angle + Math.PI / 2, 'YZX');
          const quaternion = new THREE.Quaternion().setFromEuler(euler);
          carModel.quaternion.copy(quaternion);
      
          // Update the carModel's position
          carModel.position.set(newPosition.x - 2, newPosition.y - 2, 0); 

          // Display driver and car data
          displayDriverDetails(infoRef, newPosition.cardata);
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

  return (
    <div ref={mountRef} style={{ width: '800px', height: '600px', position: 'relative' }}>
      <div ref={infoRef} style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', zIndex: 10, minWidth: '200px', minHeight: '100px' }}>
        <p>Loading driver details...</p> {/* Initial content to ensure visibility */}
      </div>
    </div>
  );
};

function displayDriverDetails(infoRef, carData) {
  if (infoRef.current && carData) {
    let htmlContent = `<h3>Driver Details</h3>`;
    htmlContent += `<p>Driver Number: ${carData.driver_number}</p>`;
    htmlContent += `<p>Speed: ${carData.speed} km/h</p>`;
    htmlContent += `<p>RPM: ${carData.rpm}</p>`;
    htmlContent += `<p>Throttle: ${carData.throttle}</p>`;
    htmlContent += `<p>Brake: ${carData.brake}</p>`;
    htmlContent += `<p>DRS Active: ${carData.drs}</p>`;
    htmlContent += `<p>Current Gear: ${carData.n_gear}</p>`;
    infoRef.current.innerHTML = htmlContent;  // Update the inner HTML of the infoRef div
  }
}

export default ThreeCanvas;
