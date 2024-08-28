export const applyAlpha = (color: string, alpha: number): string => {
  // Extract the HSL part of the color
  const hslMatch = color.match(/hsl\(([^)]+)\)/);
  if (!hslMatch) return color; // Return original color if it's not in HSL format

  // Format the new HSLA color
  return `hsla(${hslMatch[1]}, ${alpha})`;
};
