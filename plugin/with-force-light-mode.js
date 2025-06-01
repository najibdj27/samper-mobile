const { withMainActivity } = require('@expo/config-plugins');

/**
 * Custom Expo plugin to force light mode on Android by modifying MainActivity.kt
 */
module.exports = function withForceLightMode(config) {
  console.log('✅ withForceLightMode plugin is running!');
  return withMainActivity(config, (config) => {
    if (config.modResults.language === 'kotlin') {
      let contents = config.modResults.contents;

      // Add import for AppCompatDelegate
      if (!contents.includes('AppCompatDelegate')) {
        contents = contents.replace(
          'import android.os.Bundle;',
          'import android.os.Bundle;\nimport androidx.appcompat.app.AppCompatDelegate;'
        );
      }

      // Add the setDefaultNightMode call
      if (!contents.includes('AppCompatDelegate.setDefaultNightMode')) {
        contents = contents.replace(
          'super.onCreate(null);',
          'super.onCreate(null);\n    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);'
        );
      }

      config.modResults.contents = contents;
    }
    return config;
  });
};
