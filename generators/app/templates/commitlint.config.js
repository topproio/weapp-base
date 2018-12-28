module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [2, 'always', [
        "feat", "fix", "docs", "style", "refactor", "test", "chore", "revert"
      ]],
      'type-case': [0,'always',['lowerCase']],
      'type-empty': [0, 'never'],
    }
  };