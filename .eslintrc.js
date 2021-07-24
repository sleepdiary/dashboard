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
  rules: {
    "no-unused-vars" : process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-console"     : process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger"    : process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-unreachable" : process.env.NODE_ENV === "production" ? "error" : "warn",
  },
}
