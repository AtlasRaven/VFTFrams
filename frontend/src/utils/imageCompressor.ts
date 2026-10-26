/**
 * Utility to compress and resize images on client-side before sending to server.
 * Handles JPG, PNG, WEBP, and base64 data URLs.
 */
export async function compressImage(
  fileOrDataUrl: File | string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    let sourceUrl = "";
    let isBlobUrl = false;

    if (typeof fileOrDataUrl === "string") {
      sourceUrl = fileOrDataUrl;
    } else {
      sourceUrl = URL.createObjectURL(fileOrDataUrl);
      isBlobUrl = true;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (isBlobUrl) {
        URL.revokeObjectURL(sourceUrl);
      }

      let { width, height } = img;

      // Calculate aspect ratio scale
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(typeof fileOrDataUrl === "string" ? fileOrDataUrl : sourceUrl);
        return;
      }

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedDataUrl);
    };

    img.onerror = (err) => {
      if (isBlobUrl) {
        URL.revokeObjectURL(sourceUrl);
      }
      reject(new Error("Không thể xử lý hình ảnh. Tệp có thể bị hỏng."));
    };

    img.src = sourceUrl;
  });
}
