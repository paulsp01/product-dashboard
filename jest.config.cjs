module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["/node_modules/"],
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
