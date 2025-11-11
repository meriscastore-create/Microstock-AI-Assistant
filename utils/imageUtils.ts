interface ProcessImageOptions {
    targetMegapixels: number;
    enhance: boolean;
    detailedEnhance: boolean;
    setDpi300: boolean;
}

// Helper function to load an image and return an HTMLImageElement
function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Important for canvas operations
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
}

export async function processAndDownloadImage(
    imageSrc: string,
    options: ProcessImageOptions
): Promise<void> {
    try {
        const image = await loadImage(imageSrc);

        const { targetMegapixels, enhance, detailedEnhance, setDpi300 } = options;
        // Note: The setDpi300 option is acknowledged. However, directly writing EXIF metadata
        // to set physical DPI is not feasible with the standard browser Canvas API.
        // The crucial step for ensuring high-quality 300 DPI prints is upscaling
        // the image to a high pixel resolution (megapixels), which this function already does.

        const targetPixels = targetMegapixels * 1_000_000;

        // --- Step 1: Create a temporary canvas to apply initial effects ---
        const processCanvas = document.createElement('canvas');
        processCanvas.width = image.naturalWidth;
        processCanvas.height = image.naturalHeight;
        const processCtx = processCanvas.getContext('2d');

        if (!processCtx) {
            throw new Error('Could not create processing canvas context.');
        }
        
        // Apply enhancement filter if requested
        let filterString = 'none';
        if (detailedEnhance) {
            // A more aggressive filter for a "detailed" or "vibrant" look
            filterString = 'saturate(1.2) contrast(1.25) brightness(1.05)';
        } else if (enhance) {
            // The standard, subtle enhancement
            filterString = 'saturate(1.1) contrast(1.1)';
        }
        processCtx.filter = filterString;
        
        processCtx.drawImage(image, 0, 0);

        // --- Step 2: Determine final output dimensions with upscaling if necessary ---
        const currentPixelCount = image.naturalWidth * image.naturalHeight;
        let outputWidth = image.naturalWidth;
        let outputHeight = image.naturalHeight;

        // Check if the image is smaller than our target resolution.
        if (currentPixelCount < targetPixels) {
            const scaleFactor = Math.sqrt(targetPixels / currentPixelCount);
            outputWidth = Math.floor(image.naturalWidth * scaleFactor);
            outputHeight = Math.floor(image.naturalHeight * scaleFactor);
        }

        // --- Step 3: Create the final output canvas and draw the (potentially upscaled) image ---
        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = outputWidth;
        outputCanvas.height = outputHeight;
        const outputCtx = outputCanvas.getContext('2d');

        if (!outputCtx) {
            throw new Error('Could not create final output canvas context.');
        }

        // Set the highest quality scaling algorithm for the browser.
        outputCtx.imageSmoothingQuality = 'high';

        // Draw the content of the processing canvas onto the final output canvas.
        // This operation performs the high-quality scaling.
        outputCtx.drawImage(
            processCanvas,
            0, 0, image.naturalWidth, image.naturalHeight, // source rectangle
            0, 0, outputWidth, outputHeight                // destination rectangle
        );

        // --- Step 4: Trigger download ---
        const dataUrl = outputCanvas.toDataURL('image/jpeg', 0.98); // High quality JPEG
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `enhanced-image-${targetMegapixels}MP.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (e) {
        console.error("Failed to process and download image:", e);
        throw new Error("An error occurred while processing the image.");
    }
}