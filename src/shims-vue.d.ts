/* eslint-disable */
declare module 'vue-load-image'
declare module 'vue-resizable'
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Fix for NodeList iterable error in TypeScript
interface NodeList extends Iterable<Node> {}
interface NodeListOf<TNode extends Node> extends Iterable<TNode> {}
