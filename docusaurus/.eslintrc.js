module.exports = {
  parserOptions: {
    jsx: true,
    useJSXTextNode: true,
  },
  extends: ['prettier', 'plugin:react/recommended'],
  plugins: ['react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    // 'import/no-unresolved': [
    //   2,
    //   {
    //     // ignore these 2 imports being unresolved, because docusaurus has some magics to make these works on build time
    //     ignore: ['^@theme', '^@docusaurus'],
    //   },
    // ],
  },
};
