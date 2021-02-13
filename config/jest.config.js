module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: "../",
  testMatch: [
    "**/?(*.)+(spec).ts?(x)"
 ],
 collectCoverage: true
};