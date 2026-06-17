$dest = "C:\Users\svija\GreenEarth\favicon"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

Add-Type -AssemblyName System.Drawing

function New-GreenEarthIcon {
    param([int]$Size)

    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    $primary = [System.Drawing.Color]::FromArgb(255, 45, 106, 79)
    $accent = [System.Drawing.Color]::FromArgb(255, 82, 183, 136)
    $white = [System.Drawing.Color]::FromArgb(230, 255, 255, 255)

    $margin = [Math]::Max(1, [int]($Size * 0.06))
    $g.FillEllipse(
        (New-Object System.Drawing.SolidBrush $primary),
        $margin, $margin, ($Size - 2 * $margin), ($Size - 2 * $margin)
    )

    $inner = [int]($Size * 0.18)
    $g.FillEllipse(
        (New-Object System.Drawing.SolidBrush $accent),
        $inner, $inner, ($Size - 2 * $inner), ($Size - 2 * $inner)
    )

    $leafW = [int]($Size * 0.16)
    $cx = [int]($Size / 2)
    $cy = [int]($Size / 2 - $Size * 0.08)
    $g.FillEllipse(
        (New-Object System.Drawing.SolidBrush $white),
        ($cx - $leafW), ($cy - $leafW), ($leafW * 2), ([int]($leafW * 1.5))
    )

    $g.Dispose()
    return $bmp
}

$files = @{
    "favicon-16x16.png" = 16
    "favicon-32x32.png" = 32
    "apple-touch-icon.png" = 180
    "android-chrome-192x192.png" = 192
    "android-chrome-512x512.png" = 512
}

foreach ($entry in $files.GetEnumerator()) {
    $icon = New-GreenEarthIcon -Size $entry.Value
    $path = Join-Path $dest $entry.Key
    $icon.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $icon.Dispose()
    Write-Output "Created $($entry.Key)"
}

$icon32 = New-GreenEarthIcon -Size 32
$icoPath = Join-Path $dest "favicon.ico"
$icon32.Save($icoPath, [System.Drawing.Imaging.ImageFormat]::Icon)
$icon32.Dispose()
Write-Output "Created favicon.ico"

Get-ChildItem $dest | Format-Table Name, Length
