// server.js
const app = require("./src/app");
const config = require("./src/config/config");

const server = app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
