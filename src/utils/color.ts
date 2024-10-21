export const applyAlpha = (
  color: string,
  alpha: number,
  format: "hsla" | "rgba" = "hsla"
): string => {
  // Extract the HSL part of the color
  const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);

  if (!hslMatch) return color; // Return original color if it's not in HSL format

  const [, h, s, l] = hslMatch.map(Number);

  if (format === "hsla") {
    // Format the new HSLA color
    return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
  }

  // Convert HSL to RGB
  const c = ((1 - Math.abs((2 * l) / 100 - 1)) * s) / 100;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l / 100 - c / 2;

  let r;
  let g;
  let b;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  // Format the new RGBA color
  return `rgba(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}, ${alpha})`;
};
