module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        root:['.'],
        alias: {
          "@": "./src",
          "@assets": "./src/assets",
          "@components":"./src/components",
          "@styles":"./src/styles"
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    ],
  ],
};
