/// <reference types="vite/client" />

// Absolute-path image imports (e.g. import img from '/images/foo.png')
declare module '*.png' {
  const src: string
  export default src
}
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.jpeg' {
  const src: string
  export default src
}
declare module '*.svg' {
  const src: string
  export default src
}
declare module '*.webp' {
  const src: string
  export default src
}

// YAML raw imports (e.g. import raw from '/config/nav.yml?raw')
declare module '*.yml?raw' {
  const src: string
  export default src
}
declare module '*.yaml?raw' {
  const src: string
  export default src
}
