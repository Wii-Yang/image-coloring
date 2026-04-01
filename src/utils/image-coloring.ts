import { hexToRgb } from "./color.ts";

function getImageByUrl(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = url;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject("路径无效");
    };
  });
}

async function getImageCanvas(url: string) {
  const icon = await getImageByUrl(url);
  const { width, height } = icon;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(icon, 0, 0, width, height);
  return canvas;
}

export async function imageColoring(url: string, color: string) {
  const canvas = await getImageCanvas(url);
  const ctx = canvas.getContext("2d")!;
  const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { r, g, b } = hexToRgb(color);

  for (let i = 0; i < canvasData.data.length; i += 4) {
    canvasData.data[i] = canvasData.data[i] * r;
    canvasData.data[i + 1] = canvasData.data[i + 1] * g;
    canvasData.data[i + 2] = canvasData.data[i + 2] * b;
  }

  ctx.putImageData(canvasData, 0, 0);

  return canvas.toDataURL("image/png");
}
