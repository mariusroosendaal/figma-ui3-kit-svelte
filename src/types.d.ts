// Type declarations for non-JS imports

// SVG files (imported as raw strings by webpack)
declare module '*.svg' {
  const content: string;
  export default content;
}

// CSS files
declare module '*.css' {
  const content: string;
  export default content;
}

// Window extensions used by components
interface Window {
  __tooltipGlobalState?: {
    hasShownFirstTooltip: boolean;
    resetTimeout: ReturnType<typeof setTimeout> | null;
  };
}
