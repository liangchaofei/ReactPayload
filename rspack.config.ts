import * as path from "path";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import * as RefreshPlugin from "@rspack/plugin-react-refresh";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  context: __dirname,
  entry: {
    main: "./example/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "build"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },
  module: {
    rules: [
      {
        use: "builtin:swc-loader",
        options: {
          rspackExteriments: {
            import: [
              {
                libraryName: "antd",
                customName: "antd/es/{{ member }}",
              },
            ],
          },
        },
      },
      {
        test: /\.(module|m)\.scss$/,
        use: [
          {
            loader: "sass-loader",
            options: {
              // 同时使用 `modern-compiler` 和 `sass-embedded` 可以显著提升构建性能
              // 需要 `sass-loader >= 14.2.1`
              api: "modern-compiler",
              implementation: require.resolve("sass-embedded"),
            },
          },
        ],
        // 如果你需要将 '*.module.(sass|scss)' 视为 CSS Modules 那么将 'type' 设置为 'css/auto' 否则设置为 'css'
        type: "css/auto",
      },
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: [
                  "chrome >= 87",
                  "edge >= 88",
                  "firefox >= 78",
                  "safari >= 14",
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.HtmlRspackPlugin({
      template: "./public/index.html",
    }),
    isDev ? new RefreshPlugin() : null,
  ].filter(Boolean),
  experiments: {
    css: true,
  },
});
