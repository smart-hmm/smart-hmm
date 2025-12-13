export async function cropImageToBlob(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  opts?: { mimeType?: string; quality?: number; size?: number }
) {
  const mimeType = opts?.mimeType ?? "image/jpeg";
  const quality = opts?.quality ?? 0.92;
  const size = opts?.size ?? 512;

  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // Crop to square output (size x size)
  canvas.width = size;
  canvas.height = size;

  // Draw cropped area scaled to output size
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
      mimeType,
      quality
    );
  });

  return blob;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
