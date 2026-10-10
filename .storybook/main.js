/** @type { import('@storybook/svelte').StorybookConfig } */
const config = {
  stories: ['../src/components/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
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

    // Svelte 5 runes modules, such as the renderer's createSvelte5Props.svelte.js:
    // the preset compiles only .svelte files, so `$state` would reach the
    // browser as is and throw rune_outside_svelte.
    config.module.rules.push({
      test: /\.svelte\.(js|ts)$/,
      loader: 'svelte-loader',
    });

    // The kit's own .ts modules, imported without an extension
    config.module.rules.push({
      test: /\.ts$/,
      exclude: [/node_modules/, /\.svelte\.ts$/],
      loader: new URL('./ts-loader.cjs', import.meta.url).pathname,
    });
    config.resolve.extensions = [...(config.resolve.extensions ?? []), '.ts'];

    return config;
  },
};

export default config;

