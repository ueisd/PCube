declare function require(name:string);
import * as express from "express";
const nconf = require('nconf');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

import { loadConfig } from "./configuration";
const { getSequelize } = require('./configuration/sequelize');
const { closePool } = require('./database');
const { initSchemas } = require('./models');
import { PresetQuerry } from "./database/presetQuery";
const index = require('./routes/index');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
exports.app = app;

let server;

async function main() {
  await loadConfig();
  await PresetQuerry.ensureDBIsCreated(nconf.get("database_db"));

  const { getInitializedPassport, injectDependency } = require('./configuration/oauth2.google.passeport');
  injectDependency(getSequelize());
  app.use(getInitializedPassport());

  const sequelize = getSequelize();
  await initSchemas(sequelize);

  let apiOrigin = nconf.get('api_url_origin');

  if(apiOrigin) {
    app.use(cors({origin: apiOrigin}));
  } else {
    app.use(cors());
  }

  app.use(index);

  app.get('/api', (req, res) => {
    res.status(200).json({
      message: 'accueil'
    });
  });

  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'accueil heroku'
    });
  });

  app.all('*', (req, res) => {
    console.log(req.url);
    res.status(404).end();
  });

  let port: number = (process.env.PORT) ? Number(process.env.PORT) : 80
  if(process.env.HOST) {
    server = app.listen(port, process.env.HOST, ()=> {});
  } else {
    app.listen(port);
  }
}


try {
  main().then(r => console.log(r));
} catch (err) {
  console.log(`Erreur`);
  console.log(JSON.stringify({err}, null ,2));
}



// Graceful shutdown.
// On empêche les nouvelles connexions sur le serveur
// Ensuite on close proprement la connexion DB
// https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
process.on('SIGINT', async () => {
  server.close(async (err) => {
    if (err) {
      process.exit(1);
    } else {
      try {
        await closePool();
        console.log("pool fermé");
        process.exit(0);
      } catch (err) {
        process.exit(1);
      }
    }
  });
});

module.exports = app;