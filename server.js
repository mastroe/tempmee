require('rootpath')();

const dotenv = require('dotenv');
dotenv.config();

const swaggerUi = require('swagger-ui-express');
var { initialize } = require("express-openapi");
const morgan = require('morgan');
const express = require("express");
const YAML = require('js-yaml');
const fs = require('fs');
const swaggerDoc = YAML.load(fs.readFileSync('./api/swagger/swagger.yaml', 'utf8'));
const { logEntryRequest, stream, logger } = require('./config/logger');
const { helmetMiddleware, rateLimitMiddleware } = require('./config/middleware');
const cors = require('cors');
const { Seed } = require('./models/seeder/seed-data');
const dbConnection = require("./config/db-connection");
const OpenApiValidator = require('express-openapi-validator');
mongoose = require('mongoose');

logger.info(
  'server.js Initializing Server'
);

// Setup Connection to DB
dbConnection('mongodb://' + process.env.DB_HOST, process.env.DB_DATABASE)

//Run seeder
Seed();


const app = express();
const PORT = process.env.PORT;

app.use(logEntryRequest);
rateLimitMiddleware(app);
helmetMiddleware(app);
app.use(cors());

const morganType = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(morganType, { stream }));


const options = {
  customSiteTitle: 'API Explorer'
};

// OpenAPI routes
initialize({
  app,
  apiDoc: swaggerDoc,
  paths: "./api/controllers",
});

// OpenAPI UI
app.use(
  '/api/explorer',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, options)
);

app.use(
  OpenApiValidator.middleware({
    apiSpec: swaggerDoc,
    validateRequests: true,
    validateResponses: true,
  }),
);


app.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`);
});