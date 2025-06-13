import app from "./src/app";
import config from "./src/config/config";

const server = app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
