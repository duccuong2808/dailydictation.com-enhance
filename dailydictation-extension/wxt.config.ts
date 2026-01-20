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
    browser_specific_settings: {
      gecko: {
        id: 'dailydictation-speed-control@example.com',
        strict_min_version: '140.0',
        data_collection_permissions: {
          required: ['none'],
        },
      },
      gecko_android: {
        strict_min_version: '142.0',
      },
    } as Record<string, unknown>,
  },
  // Optimize build
  zip: {
    artifactTemplate: '{{name}}-{{version}}-{{browser}}.zip',
  },
});
