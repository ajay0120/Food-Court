module.exports = {
  root: true,
  env: { node: true, es2022: true },
  extends: ["eslint:recommended"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["import"],
  rules: {
    'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-undef': 'error'
  },
  settings: {
    'import/resolver': {
      node: { extensions: ['.js'] }
    }
  }
};
