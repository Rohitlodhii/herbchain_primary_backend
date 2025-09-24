 /** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/test/**/*.test.ts"], // put all tests in test/ folder
    moduleFileExtensions: ["ts", "js"],
  };
  