const HtmlWebPackPlugin = require("html-webpack-plugin");
//pwa requirements
const { InjectManifest } = require("workbox-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin")
const path = require("path");
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html",
});

const copyWebpackPlugin = new CopyWebpackPlugin({
  patterns: [{ from: path.resolve(__dirname, "./public") }],
});

const injectManifest = new InjectManifest({
  swSrc: path.resolve(
    __dirname,
    "./service-worker/serviceWorkerWorkbox.ts"
  ),
  swDest: "service-worker.js",
})

module.exports = (env, argv) => {
  return {
    entry: "./src/index.tsx",
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    output: {
      // NEW
      path: path.join(__dirname, "dist"),
      filename: "[name].js",
    }, // NEW Ends
    plugins: [
      injectManifest,
      htmlPlugin,
      copyWebpackPlugin,
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: ["ts-loader"],
        },
        // css rules
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
  };
};
