export type LayoutType = 'default' | 'blank'

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: LayoutType
  }
}