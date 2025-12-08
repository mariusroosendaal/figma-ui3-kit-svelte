/** @type { import('@storybook/svelte').StorybookConfig } */
const config = {
  stories: ['../src/components/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/svelte-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
  features: {
    buildStoriesJson: false,
  },
  webpackFinal: async (config) => {
    // Handle SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test && rule.test.test && rule.test.test('.svg')
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }
    
    config.module.rules.push({
      test: /\.svg$/i,
      type: 'asset/source',
    });

    return config;
  },
};

export default config;

