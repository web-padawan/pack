module.exports = {
  plugins: {
    istanbul: {
      dir: "./coverage",
      reporters: ["text-summary", "lcov"],
      include: [
        "/src/**/*.html"
      ],
      exclude: [
        "/src/vendor/**/*.html"
      ],
      thresholds: {
        global: {
          statements: 90
        }
      }
    }
  }
};
