module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["./__tests__/_setupJest.js"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
};
