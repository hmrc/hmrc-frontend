const configPaths = require('../config/paths.json');

const PORT = process.env.PORT || configPaths.ports.app;

const app = require('./app')();

app.listen(PORT, () => {
  // oxlint-disable-next-line no-console
  console.log(`Server started at http://localhost:${PORT}`);
});
