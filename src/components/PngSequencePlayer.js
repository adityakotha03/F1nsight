import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

const PngSequencePlayer = ({
  frameCount,
  path,
  fileExtension = "png",
  frameRate = 30,
  className,
  canvasClasses,
  loadingImage,
}) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false); // Track if the canvas is in view

  // Load the image sequence
  useEffect(() => {
    const loadedImages = [];
    let imagesLoaded = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `${path}${String(i).padStart(5, "0")}.${fileExtension}`;
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === frameCount) {
          setImages(loadedImages);
          setLoaded(true);
        }
      };
      img.onerror = (e) => console.error(`Error loading image: ${img.src}`, e);
      loadedImages.push(img);
    }
  }, [frameCount, path, fileExtension]);

  // Use IntersectionObserver to detect if the element is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry.isIntersecting); // Set inView to true when the canvas is in view
      },
      { threshold: 0.5 } // Trigger when 50% of the element is in view
    );

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => {
      if (canvasRef.current) {
        observer.unobserve(canvasRef.current);
      }
    };
  }, []);

  // Play animation only if in view and images are loaded
  useEffect(() => {
    if (!inView || !loaded || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let currentFrame = 0;
    let animationFrameId;

    const update = () => {
      if (ctx && images[currentFrame]) {
        canvas.width = images[0].width;
        canvas.height = images[0].height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images[currentFrame], 0, 0, canvas.width, canvas.height);
      }
      currentFrame = (currentFrame + 1) % frameCount;
      animationFrameId = requestAnimationFrame(update);
    };

    requestAnimationFrame(update); // Start animation immediately when in view

    return () => cancelAnimationFrame(animationFrameId); // Clean up animation when the component unmounts or goes out of view
  }, [inView, loaded, images, frameCount, frameRate]);

  return (
    <div className={classNames(className, "png-sequence-player flex justify-center items-center")}>
      {!loaded && <img className={classNames(canvasClasses, "png-sequence-player__image")} src={loadingImage} alt="Loading..." />}
      <canvas ref={canvasRef} className={classNames(canvasClasses, !loaded ? "hidden" : "", "png-sequence-player__canvas")} />      
    </div>
  );
};

export default PngSequencePlayer;