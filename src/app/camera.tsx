import { Button, Icon, Text } from "@/components";
import { useCameraStore } from "@/stores/camera-store";
import { CameraView, type FlashMode, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  type GestureUpdateEvent,
  type PinchGestureHandlerEventPayload,
} from "react-native-gesture-handler";

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [flashOn, setFlashOn] = useState<FlashMode>("off");
  const [zoom, setZoom] = useState(0);
  const [lastZoom, setLastZoom] = useState(0);
  const { setTakenPicture } = useCameraStore();
  const router = useRouter();

  useEffect(() => {
    setTakenPicture(null);
  }, []);

  const onPinch = useCallback(
    (event: GestureUpdateEvent<PinchGestureHandlerEventPayload>) => {
      const velocity = event.velocity / 20;
      const outFactor = lastZoom * (Platform.OS === "ios" ? 25 : 15);

      let newZoom =
        velocity > 0
          ? zoom + event.scale * velocity * (Platform.OS === "ios" ? 0.01 : 25)
          : zoom -
            event.scale *
              (outFactor || 1) *
              Math.abs(velocity) *
              (Platform.OS === "ios" ? 0.02 : 50);

      if (newZoom < 0) newZoom = 0;
      else if (newZoom > 0.7) newZoom = 0.7;

      setZoom(newZoom);
    },
    [zoom, setZoom, lastZoom, setLastZoom],
  );

  const onPinchEnd = useCallback(
    (event: GestureUpdateEvent<PinchGestureHandlerEventPayload>) => {
      setLastZoom(zoom);
    },
    [zoom, setLastZoom],
  );

  const pinchGesture = useMemo(
    () => Gesture.Pinch().onUpdate(onPinch).onEnd(onPinchEnd),
    [onPinch, onPinchEnd],
  );

  if (!permission) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Perbolehkan app untuk mengakses kamera</Text>
        <Button variant="ghost" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  const takePicture = async () => {
    const picture = await cameraRef.current?.takePictureAsync({
      quality: 0,
      imageType: "jpg",
      scale: 1,
      exif: true,
    });

    if (picture) {
      setTakenPicture(picture || null);
      router.back();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={pinchGesture}>
        <CameraView
          ref={cameraRef}
          flash={flashOn}
          style={{
            width: "100%",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 64,
            paddingHorizontal: 24,
            aspectRatio: "9/16",
          }}
          zoom={zoom}
          facing="back"
        >
          <View
            style={{
              alignSelf: "flex-end",
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}></View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                style={{ width: 64, height: 64 }}
                onPress={takePicture}
                size="icon"
              >
                <Icon name="camera" size={32} />
              </Button>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button
                style={{ width: 64, height: 64 }}
                variant={flashOn === "off" ? "ghost" : "default"}
                onPress={() => {
                  setFlashOn(flashOn === "off" ? "on" : "off");
                }}
                size="icon"
              >
                <Icon name="flash" size={32} />
              </Button>
            </View>
          </View>
        </CameraView>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
