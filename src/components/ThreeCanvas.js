import React, { useRef, useEffect, useState, useMemo } from "react";
import classNames from "classnames";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TWEEN from "@tweenjs/tween.js";
import Stats from "three/addons/libs/stats.module.js";

import { Loading } from "./Loading";
import RangeSlider from "./RangeSlider";
import DriverCarDetails from "./DriverCarDetails";

export const ThreeCanvas = ({
    MapFile,
    locData,
    driverColor,
    driverSelected,
    year,
    driverCode,
    fastestLap,
    constructorId,
    isPaused,
    haloView,
    topFollowView,
    speedFactor,
    className,
    showCarDetails,
    showCameraControls,
}) => {
    const [driverDetails, setDriverDetails] = useState(null);
    const [carPosition, setCarPosition] = useState({ x: 0, y: 0, z: 0 });

    // Camera control states
    const [theta, setTheta] = useState(-Math.PI / 2); // in radians
    const [cameraHeight, setCameraHeight] = useState(10);
    const [radius, setRadius] = useState(7);

    const mountRef = useRef(null);
    const infoRef = useRef(null);
    const cameraRef = useRef(null); // store the camera instance here
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

    // This function updates the camera's position based on the current state values
    const updateCameraPosition = () => {
        if (cameraRef.current) {
            const target = new THREE.Vector3(0, 0, 0);
            cameraRef.current.position.x = target.x + radius * Math.cos(theta);
            cameraRef.current.position.y = target.y + radius * Math.sin(theta);
            cameraRef.current.position.z = cameraHeight;
            // Ensure the camera always looks at track level (z = 0)
            cameraRef.current.lookAt(new THREE.Vector3(target.x, target.y, 0));
        }
    };

    // useEffect to update camera when slider states change
    useEffect(() => {
        updateCameraPosition();
    }, [theta, cameraHeight, radius]);

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.add(directionalLight1);
        scene.add(directionalLight2);

        stats = new Stats();
        // document.body.appendChild(stats.dom);

        // Create the main camera and store it in cameraRef
        const camera = new THREE.PerspectiveCamera(
            40,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.up.set(0, 0, 1);
        cameraRef.current = camera; // store camera instance

        updateCameraPosition();

        // Setup additional cameras (halo, topFollow) if needed
        const haloCamera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        haloCamera.position.set(0, 0.6, 0.4);
        haloCamera.rotation.set(Math.PI / 8, Math.PI, 0);

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
        renderer.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight
        );
        mountRef.current.appendChild(renderer.domElement);
        renderer.setClearColor(0x1f1f1f);

        // Custom camera controls via mouse (if needed)
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
            // Update horizontal angle
            setTheta((prevTheta) => prevTheta - deltaMove.x * 0.005);
            // Update camera height (vertical drag)
            setCameraHeight((prevHeight) => prevHeight - deltaMove.y * 0.01);
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
        function onMouseUp() {
            isDragging = false;
        }
        function onWheel(e) {
            setRadius((prevRadius) => {
                const newRadius = prevRadius + e.deltaY * 0.01;
                return Math.max(5, Math.min(20, newRadius));
            });
        }
        if (!haloView && !topFollowView) {
            renderer.domElement.addEventListener("mousedown", onMouseDown);
            renderer.domElement.addEventListener("mousemove", onMouseMove);
            renderer.domElement.addEventListener("mouseup", onMouseUp);
            renderer.domElement.addEventListener("wheel", onWheel);
        }

        // --- Light Trail Setup ---
        // This creates a trail that records the car’s positions.
        const maxTrailPoints = 50;
        let trailPoints = [];

        const trailGeometry = new THREE.BufferGeometry();
        const trailPositions = new Float32Array(maxTrailPoints * 3);
        trailGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(trailPositions, 3)
        );
        const trailColors = new Float32Array(maxTrailPoints * 3);
        trailGeometry.setAttribute(
            "color",
            new THREE.BufferAttribute(trailColors, 3)
        );
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
            const baseColor = new THREE.Color(
                `#${driverColor ? driverColor : "737373"}`
            );
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

        // --- Load Map and Car Model (your existing code) ---
        let map;
        const lo = new GLTFLoader();
        if (MapFile) {
            lo.load(
                MapFile,
                (gltf) => {
                    map = gltf.scene;
                    map.scale.set(0.1, 0.1, 0.1);
                    map.rotation.x = Math.PI / 2;
                    scene.add(map);
                    const box = new THREE.Box3().setFromObject(map);
                    const center = box.getCenter(new THREE.Vector3());
                    // Optionally update target, theta, radius etc. based on map center
                    updateCameraPosition();
                },
                undefined,
                (error) => console.error(error)
            );
        }

        let carModel;
        const loader = new GLTFLoader();
        loader.load(
            `${process.env.PUBLIC_URL + "/car25/scene.gltf"}`,
            (gltf) => {
                carModel = gltf.scene;
                carModel.scale.set(0.1, 0.1, 0.1);
                carModel.rotation.x = Math.PI / 2;
                carModel.rotation.y = -Math.PI;
                carModel.position.set(
                    carPosition.x,
                    carPosition.y,
                    carPosition.z
                );
                if (driverSelected && locData.length > 0) {
                    scene.add(carModel);
                    carModel.add(haloCamera);
                    carModel.add(topFollowCamera);
                }
                carModel.traverse((object) => {
                    if (object.isMesh && object.material.name === "Body") {
                        if (year < 2025) {
                            object.material.map = null;
                            object.material.color.setHex(
                                `0x${driverColor ? driverColor : "737373"}`
                            );
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

        window.addEventListener("resize", setCanvasWidth);
        function setCanvasWidth() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        const animate = () => {
            if (!mountRef.current) return;

            TWEEN.update();

            if (
                carModel &&
                locData.length > 0 &&
                driverSelected &&
                !carModel.userData.tweenActive &&
                !isPaused
            ) {
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
                        const angle = Math.atan2(
                            newPosition.y - initialPosition.y,
                            newPosition.x - initialPosition.x
                        );
                        const euler = new THREE.Euler(
                            Math.PI / 2,
                            0,
                            angle + Math.PI / 2,
                            "YZX"
                        );
                        const quaternion = new THREE.Quaternion().setFromEuler(
                            euler
                        );
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

            renderer.render(
                scene,
                haloView ? haloCamera : topFollowView ? topFollowCamera : camera
            );
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
            if (!haloView && !topFollowView) {
                renderer.domElement.removeEventListener(
                    "mousedown",
                    onMouseDown
                );
                renderer.domElement.removeEventListener(
                    "mousemove",
                    onMouseMove
                );
                renderer.domElement.removeEventListener("mouseup", onMouseUp);
                renderer.domElement.removeEventListener("wheel", onWheel);
            }
            TWEEN.removeAll();
        };
    }, [
        MapFile,
        locData,
        driverSelected,
        speedFactor,
        isPaused,
        haloView,
        topFollowView,
    ]);

    // Convert theta from radians to degrees for slider display.
    const thetaInDegrees = (theta * 180) / Math.PI;

    // Slider change handlers
    const handleRotationChange = (e) => {
        const newThetaDegrees = parseFloat(e.target.value);
        setTheta(newThetaDegrees * (Math.PI / 180));
    };

    const handleHeightChange = (e) => {
        setCameraHeight(parseFloat(e.target.value));
    };

    const handleZoomChange = (e) => {
        setRadius(parseFloat(e.target.value));
    };

    return (
        <div className={classNames(className, "relative")}>
            <div
                ref={mountRef}
                className="three-canvas-container max-sm:pointer-events-none"
            />

            {driverSelected && (
                <>
                    <div
                        className={classNames(
                            "driver-data absolute top-40 transition-all duration-300",
                            showCarDetails ? "right-1" : "right-[-400px]"
                        )}
                        ref={infoRef}
                    >
                        {infoRef.current && driverDetails ? (
                            <DriverCarDetails driverDetails={driverDetails} />
                        ) : (
                            <Loading message={`Loading car data`} />
                        )}
                    </div>
                    {showCameraControls && (
                        <div
                            className={classNames(
                                "p-16 shadow-xl bg-neutral-800/90 backdrop-blur-sm mt-2 absolute w-full sm:w-[232px] max-sm:top-full sm:bottom-64 sm:rounded-l-md transition-all duration-300 z-50",
                                showCameraControls
                                    ? "max-sm:left-0 sm:right-1 "
                                    : "max-sm:left-full sm:right-[200%]"
                            )}
                        >
                            <div className="mb-4">
                                <label className="gradient-text-light text-xs tracking-xs uppercase">
                                    Rotation ({thetaInDegrees.toFixed(0)}°)
                                </label>
                                <RangeSlider
                                    min="-180"
                                    max="180"
                                    step="1"
                                    value={thetaInDegrees}
                                    onChange={handleRotationChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="gradient-text-light text-xs tracking-xs uppercase">
                                    Camera Height ({cameraHeight.toFixed(1)})
                                </label>
                                <RangeSlider
                                    min="0"
                                    max="50"
                                    step="0.1"
                                    value={cameraHeight}
                                    onChange={handleHeightChange}
                                />
                            </div>
                            <div>
                                <label className="gradient-text-light text-xs tracking-xs uppercase">
                                    Zoom ({radius.toFixed(1)})
                                </label>
                                <RangeSlider
                                    min="5"
                                    max="20"
                                    step="0.1"
                                    value={radius}
                                    onChange={handleZoomChange}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ThreeCanvas;
