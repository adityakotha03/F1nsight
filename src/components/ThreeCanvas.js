import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const ThreeCanvas = ({ imageFile, locData, driverSelected }) => {
  const mountRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 600);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = true;
    controls.panSpeed = 0.5;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

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
    loader.load('/car/scene.gltf', function (gltf) {
      carModel = gltf.scene;
      carModel.scale.set(0.3, 0.3, 0.3);
      carModel.rotation.x = Math.PI / 2;
      carModel.rotation.y = -Math.PI;
      scene.add(carModel);
    }, undefined, function (error) {
      console.error(error);
    });

    const animate = () => {
      requestAnimationFrame(animate);

      if (carModel && locData.length > 0 && driverSelected) {
        const newPosition = locData.shift();
        let oldPosition = carModel.position;
        oldPosition.x = oldPosition.x + 2;
        oldPosition.y = oldPosition.y + 2;
        const angle = Math.atan2(newPosition.y - oldPosition.y, newPosition.x - oldPosition.x);
        const euler = new THREE.Euler(Math.PI / 2, 0, angle + Math.PI / 2, 'YZX');
        const quaternion = new THREE.Quaternion().setFromEuler(euler);
        carModel.quaternion.copy(quaternion);
        carModel.position.set(newPosition.x - 2, newPosition.y - 2, 0);

        if (infoRef.current) {
          displayDriverDetails(infoRef, newPosition.cardata);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.traverse(object => {
        if (object.material) {
          object.material.dispose();
        }
        if (object.geometry) {
          object.geometry.dispose();
        }
      });
      if (controls) {
        controls.dispose();
      }
    };
  }, [imageFile, locData, driverSelected]);

  return (
    <div ref={mountRef} style={{ width: '800px', height: '600px', position: 'relative' }}>
      { driverSelected &&
        <div ref={infoRef} style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', zIndex: 10, minWidth: '200px', minHeight: '100px' }}>
          <p>Loading driver details...</p>
        </div>
      }
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
    infoRef.current.innerHTML = htmlContent;
  }
}