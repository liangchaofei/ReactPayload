import type { Options as SucraseOptions } from "sucrase";
export type { SucraseOptions };
export type Sandbox = Record<string | symbol, unknown>;
export const BUILD_IN_SANDBOX_KEY = ["___BRIDGE___"];
export const DEFAULT_SUCRASE_OPTIONS: SucraseOptions = {
  transforms: ["jsx"],
  production: true,
};
