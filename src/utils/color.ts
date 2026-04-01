export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  return { r, g, b };
}
