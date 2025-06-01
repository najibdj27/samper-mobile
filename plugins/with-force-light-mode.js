const { withMainActivity } = require('@expo/config-plugins');

module.exports = function withForceLightMode(config) {
  return withMainActivity(config, (config) => {
    if (config.modResults.language === 'kt') {
      console.log('✅ Plugin is running: modifying MainActivity.kt');
      let contents = config.modResults.contents;

      // Ensure AppCompatDelegate is imported
      if (!contents.includes('AppCompatDelegate')) {
        contents = contents.replace(
          'import android.os.Bundle',
          `import android.os.Bundle\nimport androidx.appcompat.app.AppCompatDelegate`
        );
      }

      // Add the line to disable dark mode
      if (!contents.includes('AppCompatDelegate.setDefaultNightMode')) {
        contents = contents.replace(
          'super.onCreate(null)',
          `super.onCreate(null)\n    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)`
        );
      }

      config.modResults.contents = contents;
    } else {
      console.log('⚠️ MainActivity is not in Kotlin.', config.modResults.language);
    }

    return config;
  });
};
