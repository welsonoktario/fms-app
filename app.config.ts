import type { ConfigContext, ExpoConfig } from "expo/config";

// @ts-ignore
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  android: {
    ...config.android,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY!,
      },
    },
  },
});
