module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
    testMatch: ['**/test/**/*.test.js'],
    collectCoverageFrom: [
        'routes/**/*.js',
        'models/**/*.js',
        'middleware/**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    testTimeout: 30000,
    verbose: true,
    maxWorkers: 1,
    forceExit: true,
    detectOpenHandles: true
}; 