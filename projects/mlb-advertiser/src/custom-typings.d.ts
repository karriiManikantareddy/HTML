/// reference types="sugar" />

import * as sugarjs from "sugar";

declare global {
  namespace Object {
    interface Constructor {
      merge<T, U, V>(instance: T, source: U, options?: sugarjs.Object.ObjectMergeOptions<V>): T & U;
    }

    interface ChainableBase<RawValue> {
      merge<T, U, V>(instance: T, source: U, options?: sugarjs.Object.ObjectMergeOptions<V>): T & U;
    }
  }

  interface ObjectConstructor {
    merge<T, U, V>(instance: T, source: U, options?: sugarjs.Object.ObjectMergeOptions<V>): T & U;
  }
}
