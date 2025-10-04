import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.NovaVida',
  appName: 'NovaVida',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration:0,
      launchAutoHide: true,
      backgroundColor: "#19da79ff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner:false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen:false,
      splashImmersive:false,
      layoutName: "launch_screen",
      useDialog:false,
    },
  },
};

export default config;
