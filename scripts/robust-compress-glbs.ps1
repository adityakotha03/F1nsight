# Ultra-High-Performance AR Compression Script (V3 - Mesh Reduction)
# This script shrinks high-fidelity cars to < 10MB by simplifying geometry.

# 1. Target ALL GLB files in the AR collection
$glbFiles = Get-ChildItem -Path "public/ArFiles/glbs" -Filter *.glb -Recurse

Write-Host "Starting 'ULTRA V3' mesh optimization for $($glbFiles.Count) models..." -ForegroundColor Cyan

foreach ($file in $glbFiles) {
    if ($file.Length -lt 8MB) { continue } # Already optimized enough
    
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    Write-Host "Simplifying ($sizeMB MB): $($file.FullName)..." -ForegroundColor Yellow
    
    $tempFile = "$($file.FullName)_ultra_v3.glb"
    
    # [ULTRA V3 FLAGS]
    # --simplify: Aggressive triangle reduction (50%) to drop mesh weight.
    # --texture-compress webp: High-efficiency texture format.
    # --resize 1024: Downscale textures.
    npx -y @gltf-transform/cli optimize "$($file.FullName)" "$tempFile" --simplify 0.5 --texture-compress webp --resize 1024 --verbose
    
    if ($LASTEXITCODE -eq 0 -and (Test-Path "$tempFile")) {
        Move-Item -Path "$tempFile" -Destination "$($file.FullName)" -Force
        $newSizeMB = [math]::Round((Get-Item "$($file.FullName)").Length / 1MB, 2)
        Write-Host "Success! $($file.Name) shrunk from $sizeMB MB to $newSizeMB MB." -ForegroundColor Green
    } else {
        Write-Host "Error: Failed to simplify $($file.Name)." -ForegroundColor Red
        if (Test-Path "$tempFile") { Remove-Item "$tempFile" }
    }
}
