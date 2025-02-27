import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

const PngSequencePlayer = ({ frameCount, path, fileExtension = "png", frameRate = 30, className, canvasClasses }) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadedImages = [];
    let imagesLoaded = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `${path}${String(i).padStart(5, "0")}.${fileExtension}`;
      img.onload = () => {
        imagesLoaded++;
        // console.log(`✅ Loaded: ${img.src}`);
        if (imagesLoaded === frameCount) {
          // console.log("🟢 All images loaded!");
          setImages(loadedImages);
          setLoaded(true);
        }
      };
      img.onerror = (e) => console.error(`❌ Error loading image: ${img.src}`, e);
      loadedImages.push(img);
    }
  }, [frameCount, path, fileExtension]);

  useEffect(() => {
    if (!loaded || images.length === 0 || !canvasRef.current) return;
  
    // console.log("🟢 Start Animation");
  
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
  
    // console.log("🟡 Animation starting now...");
    requestAnimationFrame(update); // 🚀 Start animation immediately
  
    return () => cancelAnimationFrame(animationFrameId);
  }, [loaded, images, frameCount, frameRate]);

  // console.log("Canvas Ref:", canvasRef.current);

  return (
    <div className={classNames(className, "png-sequence-player flex justify-center items-center")}>
      {!loaded && <p className="text-gray-500">Loading animation...</p>}
      <canvas ref={canvasRef} className={classNames(canvasClasses, "png-sequence-player__canvas")} />
    </div>
  );
};

export default PngSequencePlayer;