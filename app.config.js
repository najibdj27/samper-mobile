const withForceLightMode = require('./plugins/with-force-light-mode');

module.exports = ({ config }) => {
  return {
    ...config,
    name: "Samper",
    slug: "samper-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/app-icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.app.sampermobile", // Add this if not already present
    },
    android: {
      versionCode: 5,
      minSdkVersion: 26,
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA"
      ],
      package: "com.app.sampermobile",
      adaptiveIcon: {
        foregroundImage: "./assets/app-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    androidConfig: {
      minSdkVersion: 26
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    updates: {
      url: "https://u.expo.dev/064ec752-7f7a-4ad4-be12-152bf22177cd"
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    extra: {
      eas: {
        projectId: "064ec752-7f7a-4ad4-be12-152bf22177cd"
      }
    },
    plugins: [
      withForceLightMode,
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow Samper App to use your location."
        }
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow Samper App to access your camera",
          microphonePermission: "Allow Samper App to access your microphone",
          recordAudioAndroid: true
        }
      ],
      [
        "react-native-vision-camera",
        {
          cameraPermissionText: "Samper App needs access to your Camera."
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            minSdkVersion: 26,
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: "35.0.0"
          },
          ios: {
            deploymentTarget: "15.1"
          }
        }
      ]
    ]
  };
};
