module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: Object.fromEntries(
    ["no-unused-vars","no-console","no-debugger","no-unreachable"].map(
      process.env.NODE_ENV === "production" ? key => [key,"error"] : key => [key,"warn"],
  )),
}
