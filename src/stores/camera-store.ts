import type { CameraCapturedPicture } from "expo-camera";
import { create } from "zustand";

type CameraStoreState = {
  takenPicture: CameraCapturedPicture | null;
  setTakenPicture: (picture: CameraCapturedPicture | null) => void;
};

export const useCameraStore = create<CameraStoreState>()((set) => ({
  takenPicture: null,
  setTakenPicture: (picture) => set({ takenPicture: picture }),
}));
