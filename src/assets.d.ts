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
