declare module '*.svg?solid' {
  import type { Component, ComponentProps } from 'solid-js';
  const c: Component<ComponentProps<'svg'>>;
  export default c;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
