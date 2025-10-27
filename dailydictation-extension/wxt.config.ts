import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'DailyDictation Speed Control',
    description: 'Add playback speed controls to DailyDictation.com audio players',
    version: '2.0.0',
    permissions: [],
    host_permissions: [
      '*://dailydictation.com/*',
      '*://*.dailydictation.com/*',
    ],
  },
  // Optimize build
  zip: {
    artifactTemplate: '{{name}}-{{version}}-{{browser}}.zip',
  },
});
