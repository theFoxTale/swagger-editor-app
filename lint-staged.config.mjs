export default {
  '*.{js,jsx,ts,tsx,mjs,cjs}': [
    './node_modules/.bin/eslint --fix --cache',
    './node_modules/.bin/prettier --write',
  ],
  '*.{css,scss}': [
    './node_modules/.bin/stylelint --fix --cache',
    './node_modules/.bin/prettier --write',
  ],
  '*.{json,md,yml,yaml}': ['./node_modules/.bin/prettier --write'],
};
