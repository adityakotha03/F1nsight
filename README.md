# Rebranded to F1-Telemetry

Welcome to **F1-Telemetry**! This project is dedicated to providing Formula 1 enthusiasts with detailed analyses of past race data, including leaderboards, lap times, tire strategies, and the fastest laps for each driver. Explore an interactive 3D canvas that lets you visualize the telemetry data of selected F1 drivers, tracing their performance on the track lap by lap with high-fidelity telemetry sync and dynamic camera angles.

**Data Credit:** Driver comparisons in this application are powered by the [f1nsight-api-2](https://github.com/praneeth7781/f1nsight-api-2) repository. I am grateful to the original developer for this data source, which I continue to use following my refactor to React 19 and Vite 8.

![F1-Telemetry Animation](public/Media/animation-grid_1.gif)
![F1-Telemetry Visualization](public/images/HeroImage.png)

## Features

**F1-Telemetry** offers several exciting features:

- **Detailed Leaderboards:** Get comprehensive rankings and statistics from previous races.
- **Lap Times Analysis:** Dive into lap-by-lap performance metrics to study consistency and strategy.
- **Tire Strategies:** Understand how different tire choices play out during a race.
- **Fastest Laps:** Discover which drivers achieved the fastest laps during each event.
- **Interactive AR Viewer:** Experience high-fidelity 3D car models with **Draco/Meshopt** compression for ultra-fast loading (shrunk from 90MB to 23MB).
- **Interactive Telemetry Viewer:** Follow your favorite drivers' telemetry data with synchronized 3D visualization and professional broadcast-style framing.

## Developer Workflow

### AR Model Optimization

This project uses a custom pipeline to optimize massive 3D models for the web. If you add new `.glb` files to `public/ArFiles/glbs/`, you can optimize them using:

```powershell
npm run compress-models
```

_Script Location:_ `scripts/robust-compress-glbs.ps1` (Requires PowerShell and Node.js).

### Transparent Video System (Luma Key)

This project uses a custom **Luma Key** system to achieve high-performance video transparency across all modern browsers. This replaces standard video transparency (which is often inconsistent) with a reliable `<canvas>` based approach.

**How it works:**
- Videos are encoded in a "matted side-by-side" format.
- The **left half** of every frame contains the **RGB color data**.
- The **right half** contains the **Alpha mask** (grayscale).
- The `LumaKeyVideo` component extracts both halves and combines them into transparent pixels on a canvas.

**FFmpeg Asset Generation:**
This command converts a transparent PNG sequence (`input_00001.png`, etc.) into the side-by-side format. The left half will contain the RGB color, and the right half will contain the Alpha mask extracted from the original frames.

```powershell
# Requires ffmpeg-static (included in devDependencies)
& "node_modules/ffmpeg-static/ffmpeg.exe" -y -i "input_%05d.png" `
  -filter_complex "[0:v]pad=w=iw:h=ceil(ih/2)*2,split[v1][v2]; [v2]alphaextract[alpha]; [v1][alpha]hstack" `
  -c:v libx264 -crf 18 -pix_fmt yuv420p "output.mp4"
```

_Note: The `pad` filter ensures the height is divisible by 2 for H.264 compatibility._


### Driver Image Background Removal

To maintain a consistent and premium look, driver headshots (specifically for F2) have their backgrounds removed. This ensures they blend seamlessly into the grid and detail views.

**Script Location:** `scripts/remove-backgrounds.mjs`

**Usage:**
If you add new driver headshots to the F2 image directories (`public/images/2025/F2` or `public/images/2026/F2`), run the following command to process them:

```bash
npm run remove-f2-bg
```

**Processing Different Directories:**
If you need to process images in a different directory, edit the `dirs` array in `scripts/remove-backgrounds.mjs`:

```javascript
async function run() {
  const dirs = [
    'public/images/2025/F2',
    'public/images/2026/F2',
    'public/images/NEW_DIRECTORY' // Add your new path here
  ];
  // ...
}
```

_This utility uses `@imgly/background-removal-node` to automatically detect and remove backgrounds from all PNG files in the targeted directories in-place._


### Local Decoders

To bypass browser **Tracking Prevention** and ensure 100% reliability, Draco and Meshopt decoders are hosted locally in `/public/decoders/`.

## Deployment (IONOS / Static Hosting)

For optimal performance on IONOS or similar hosts:

1. Ensure the `.htaccess` file in `public/` is deployed to the root to enable **Gzip compression** for `.glb` files.
2. Verify the `public/decoders/` folder is included in your build to avoid cross-domain script blocking.

## Interactive Canvas

... (rest of the file as before)

Our interactive canvas is a standout feature, offering users a real-time simulation of telemetry data. This tool allows fans to:

- Select a driver and watch their race unfold lap by lap.
- Switch between multiple camera views to get a closer look at race strategies and driver skills.
- Analyze detailed representations of speed, gear, and track position per driver.

## Notice

Please note that **F1-Telemetry** is an unofficial project and is not associated in any way with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX, and related marks are trademarks of Formula One Licensing B.V.

## Website

For more information and to access the interactive features, visit:
[F1-Telemetry](https://f1-telemetry.matthews-world.co.uk/)

## Data Sources

F1-Telemetry leverages a multi-tier data ecosystem to provide high-fidelity race insights:

- **OpenF1 API:** Real-time telemetry, track positioning, and stint data.
- **f1nsight-api-2:** Primary source for driver comparison data.
- **F1-Telemetry Historical Engine:** Historical race results, driver rankings, and seasonal standings.
- **F1 Academy & F2 API:** Dedicated data streams for junior categories.

## Support and Contribution

Contributions to F1-Telemetry are always welcome! Whether it's improving the codebase, adding new features, or fixing bugs, please feel free to fork the repository and submit a pull request.

## License

This project is licensed under our custom license.

## Contact

For any questions or suggestions, please visit our discussion boards.

Enjoy exploring the data and insights at **F1-Telemetry**!
