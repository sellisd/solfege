#!/bin/bash
# This script requires ImageMagick to be installed

# Define the source SVG content for a simple music note icon
cat > source-icon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#2c3e50"/>
  <path d="M320 128h-64v175.99c-6.93-4.09-14.6-6.85-22.9-8.25-8.3-1.4-16.9-1.4-25.2 0-16.7 2.81-31.7 11.76-42.1 25.11C154.4 334.2 148 351.7 148 369.9c0 18.2 6.4 35.7 17.8 49.05 11.4 13.35 27.4 22.3 45.1 25.11 8.3 1.4 16.9 1.4 25.2 0 16.7-2.81 31.7-11.76 42.1-25.11C289.6 405.6 296 388.1 296 369.9V176h24c13.3 0 24-10.7 24-24s-10.7-24-24-24z" fill="white"/>
</svg>
EOF

# Generate PNG icons in different sizes
convert source-icon.svg -resize 16x16 favicon-16x16.png
convert source-icon.svg -resize 32x32 favicon-32x32.png
convert source-icon.svg -resize 192x192 icon-192.png
convert source-icon.svg -resize 512x512 icon-512.png

# Clean up
rm source-icon.svg

echo "Icons generated successfully!"
