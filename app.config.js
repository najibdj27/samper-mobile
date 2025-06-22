const withForceLightMode = require('./plugins/with-force-light-mode');

const getPackageName = (variant) => {
  switch (variant) {
    case 'sit':
      return 'com.app.samper.sit';
    case 'uat':
      return 'com.app.samper.uat';
    case 'dev':
      return 'com.app.samper.dev';
    case 'review':
      return 'com.app.samper.review';
    default:
      return 'com.app.samper'; // production
  }
};

const getAppName = (variant) => {
  switch (variant) {
    case 'sit':
      return 'Samper SIT';
    case 'uat':
      return 'Samper UAT';
    case 'dev':
      return 'Samper Dev';
    case 'review':
      return 'Samper Review';
    default:
      return 'Samper';
  }
};

const variant = process.env.APP_VVARIANT || 'production';

module.exports = {
  name: getAppName(variant),
  slug: "samper-mobile",
  version: "1.0.1",
  orientation: "portrait",
  icon: "./assets/app-icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: false,
    bundleIdenntifier: getPackageName(variant)
  },
  android: {
    versionCode: 4,
    minSdkVersion: 26,
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "CAMERA"
    ],
    package: getPackageName(variant),
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
