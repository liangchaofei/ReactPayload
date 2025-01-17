import { BUILD_IN_SANDBOX_KEY, Sandbox } from "./constants";

function isFunction(value: any): value is Function {
  return typeof value === "function";
}

export const withSandbox = (dependency: Sandbox) => {
  const top = typeof window === "undefined" ? global : window;
  const whitelist: (keyof Sandbox)[] = [
    ...Object.keys(dependency),
    ...BUILD_IN_SANDBOX_KEY,
  ];
  const proxy = new Proxy(dependency, {
    has: () => true,
    get(_, prop) {
      if (whitelist.indexOf(prop) > -1) {
        const value = dependency[prop];
        if (isFunction(value) && !value.prototype) {
          return value.bind(top);
        }
        return dependency[prop];
      } else {
        return null;
      }
    },
    set(_, prop, newValue) {
      if (whitelist.indexOf(prop) > -1) {
        dependency[prop] = newValue;
      }
      return true;
    },
  });

  return proxy;
};
