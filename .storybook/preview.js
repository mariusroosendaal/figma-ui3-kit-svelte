import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/global.css';
import '../src/figma-development-theme.css';

/** @type { import('@storybook/svelte').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true }, // Disable backgrounds addon, using themes instead
    layout: 'centered',
    options: {
      storySort: {
        order: ['Components'],
        method: 'alphabetical',
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'figma-dark',
      },
      defaultTheme: 'light',
    }),
    (story) => {
      // Apply Figma theme background to preview canvas
      if (typeof window !== 'undefined') {
        const injectStyles = () => {
          // Remove existing style if present
          const existing = document.getElementById('storybook-figma-background');
          if (existing) existing.remove();

          const style = document.createElement('style');
          style.id = 'storybook-figma-background';
          style.textContent = `
            .sb-show-main,
            .sb-main-padded {
              background: var(--figma-color-bg) !important;
              background-color: var(--figma-color-bg) !important;
            }
          `;
          // Append to end of head to ensure it loads after Storybook styles
          document.head.appendChild(style);
        };

        // Inject immediately
        injectStyles();

        // Also inject after a short delay to catch any late-loading Storybook styles
        setTimeout(injectStyles, 100);
      }

      return story();
    },
  ],
};

export default preview;

