module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        root:['.'],
        alias: {
          "@": ".",
          "@assets": "./assets",
          "@src": "./src",
          "@components":"./src/components"
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    ],
  ],
};
