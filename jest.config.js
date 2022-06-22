module.exports = {
  preset: "ts-jest",
  testRegex: '/__test__/.*.test.ts',
  testEnvironment: "node",
  setupFiles: ["dotenv/config"]
};
