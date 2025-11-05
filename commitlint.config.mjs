const Configuration = {
    extends: ['@commitlint/config-conventional'],
    parserPreset: 'conventional-changelog-conventionalcommits',
    formatter: '@commitlint/format',
    rules: {
        'subject-case': [0, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    },
};

export default Configuration;
