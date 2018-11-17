module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  plugins: [
    //
  ],
  // add your custom rules here
  globals: {
    'expect': true,
    'describe': true,
    'it': true,
    'before': true,
    'after': true,
    'require': true,
    'xdescribe': true,
    'xit': true
  }

};
