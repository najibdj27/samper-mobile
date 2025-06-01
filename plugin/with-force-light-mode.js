const { withMainActivity } = require('@expo/config-plugins');

module.exports = function withForceLightMode(config) {
  return withMainActivity(config, (config) => {
    if (config.modResults.language === 'java') {
      let contents = config.modResults.contents;

      // Import AppCompatDelegate
      if (!contents.includes('AppCompatDelegate')) {
        contents = contents.replace(
          'import android.os.Bundle;',
          `import android.os.Bundle;\nimport androidx.appcompat.app.AppCompatDelegate;`
        );
      }

      // Inject the force light mode line
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
