export default {
  '*.{js,jsx,ts,tsx}': ['./node_modules/.bin/eslint --fix', './node_modules/.bin/prettier --write'],
  '*.{css,scss}': ['./node_modules/.bin/stylelint --fix', './node_modules/.bin/prettier --write'],
  '*.{json,md,yml,yaml}': ['./node_modules/.bin/prettier --write'],
};
