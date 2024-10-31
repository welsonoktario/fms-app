import type { Project } from "@/types";
import { calculateDistance } from "@/utils/spatial";

export function isInProjectsLocation(
  project: Project,
  coords: {
    latitude: number;
    longitude: number;
  },
) {
  if (!project) {
    throw new Error("Project cannot be null or undefined");
  }

  if (!project.location) {
    throw new Error("Project's 'location' cannot be null or undefined");
  }

  if (!project.radius) {
    throw new Error("Project's 'radius' cannot be null or undefined");
  }

  const distance = calculateDistance(
    coords.latitude,
    coords.longitude,
    project.location.coordinates[1],
    project.location.coordinates[0],
  );

  return distance <= project.radius;
}
