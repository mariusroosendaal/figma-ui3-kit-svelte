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
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff', // --figma-color-bg in light theme
        },
        {
          name: 'dark',
          value: '#2c2c2c', // --figma-color-bg in dark theme
        },
      ],
    },
    layout: 'centered',
    options: {
      storySort: {
        order: ['Components'],
        method: 'alphabetical',
      },
    },
  },
  decorators: [
    (story) => {
      // Auto-switch theme based on OS preference
      if (typeof window !== 'undefined') {
        const updateTheme = () => {
          const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          // Apply to both html and body for maximum compatibility
          if (isDark) {
            document.documentElement.classList.add('figma-dark');
            if (document.body) {
              document.body.classList.add('figma-dark');
            }
          } else {
            document.documentElement.classList.remove('figma-dark');
            if (document.body) {
              document.body.classList.remove('figma-dark');
            }
          }
        };

        // Set initial theme
        updateTheme();

        // Listen for theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', updateTheme);
        } else {
          // Fallback for older browsers
          mediaQuery.addListener(updateTheme);
        }

        // Apply Figma theme background to preview canvas
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

