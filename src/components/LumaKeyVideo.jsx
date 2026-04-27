import React, { useRef, useEffect } from "react";

/**
 * LumaKeyVideo component
 * Renders a "matted" video (RGB on left, Alpha Matte on right) with transparency using Canvas.
 * 
 * @param {string} src - Path to the matted MP4 file.
 * @param {string} poster - Path to the poster image.
 * @param {string} className - Additional CSS classes.
 * @param {object} style - Inline styles for the canvas.
 * @param {boolean} autoPlay - Whether to autoplay.
 * @param {boolean} loop - Whether to loop.
 * @param {boolean} muted - Whether to mute.
 * @param {boolean} playsInline - Whether to play inline.
 */
export const LumaKeyVideo = ({
  src,
  poster,
  className,
  style,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  ...props
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const hasRenderedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    
    // Hidden buffer canvas for processing
    const buffer = document.createElement("canvas");
    const bctx = buffer.getContext("2d", { alpha: false, willReadFrequently: true });

    // Pre-load poster image for fallback
    let posterImg = null;
    if (poster) {
      posterImg = new Image();
      posterImg.src = poster;
    }

    const render = () => {
      if (!video) return;
      
      // If video is not ready, paused, or ended, determine if we should draw the poster
      const isNotPlaying = video.paused || video.ended || video.readyState < 2;
      
      if (isNotPlaying) {
        // Only draw poster if we haven't rendered a frame yet
        if (!hasRenderedRef.current && posterImg && posterImg.complete) {
          const h = posterImg.height;
          const w = posterImg.width;
          if (w > 0 && h > 0) {
            if (canvas.width !== w || canvas.height !== h) {
              canvas.width = w;
              canvas.height = h;
            }
            ctx.drawImage(posterImg, 0, 0);
          }
        }
        // Keep the render loop going to catch when the video starts again
        requestRef.current = requestAnimationFrame(render);
        return;
      }

      const fullWidth = video.videoWidth;
      const h = video.videoHeight;
      const w = fullWidth / 2;

      if (w > 0 && h > 0) {
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          buffer.width = fullWidth;
          buffer.height = h;
        }

        // 1. Draw full video to buffer
        bctx.drawImage(video, 0, 0);

        // 2. Get pixel data from buffer
        const imageData = bctx.getImageData(0, 0, fullWidth, h);
        const fullData = imageData.data;
        
        // 3. Create output image data (left half size)
        const output = ctx.createImageData(w, h);
        const outData = output.data;

        // HIGH PERFORMANCE LOOP
        // We use a single loop to avoid nested calculations
        // We skip the alpha channel pixels (every 4th byte) on the right side
        for (let i = 0; i < h; i++) {
          const srcRowStart = i * fullWidth * 4;
          const outRowStart = i * w * 4;
          const alphaOffset = w * 4;
          
          for (let j = 0; j < w; j++) {
            const outPixelStart = outRowStart + (j * 4);
            const srcPixelStart = srcRowStart + (j * 4);
            
            outData[outPixelStart] = fullData[srcPixelStart];
            outData[outPixelStart+1] = fullData[srcPixelStart+1];
            outData[outPixelStart+2] = fullData[srcPixelStart+2];
            outData[outPixelStart+3] = fullData[srcPixelStart + alphaOffset];
          }
        }

        ctx.putImageData(output, 0, 0);
        hasRenderedRef.current = true;
      }

      requestRef.current = requestAnimationFrame(render);
    };

    const handlePlay = () => {
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(render);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("playing", handlePlay);
    
    if (!video.paused || video.readyState >= 2) {
      handlePlay();
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("playing", handlePlay);
    };
  }, []); // Use empty array to ensure Hook size never changes. src is handled via videoRef.

  // Handle src change manually if it ever changes
  useEffect(() => {
    if (videoRef.current && videoRef.current.src !== src) {
        videoRef.current.src = src;
    }
  }, [src]);

  return (
    <div className={`relative ${className}`} style={{ lineHeight: 0, ...style }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        crossOrigin="anonymous"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px' }}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-auto"
        {...props}
      />
    </div>
  );
};


