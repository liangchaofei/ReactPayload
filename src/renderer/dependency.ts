import { Sandbox } from "../utils/constants";
import { v4 as uuidv4 } from "uuid";

export const renderWithDependency = (code: string, dependency: Sandbox) => {
  const id = uuidv4();
  dependency.___BRIDGE___ = {};
  const bridge = dependency.___BRIDGE___ as Record<string, unknown>;
  const fn = new Function(
    "dependency",
    `with(dependency) { 
      function fn(){  "use strict"; return (${code.trim()}); };
      ___BRIDGE___["${id}"] = fn.call(null);
    }
    `
  );
  fn.call(null, dependency);
  return bridge[id];
};
