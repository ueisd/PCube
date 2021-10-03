const express = require('express');
const { ensureDBIsCreated } = require('./database/presetQuery');
const { closePool } = require('./database');
var nconf = require('nconf');
const logger = require('morgan');
const { loadConfig } = require('./configuration');
const {initSchemas} = require('./models');
const { getSequelize } = require('./configuration/sequelize');
const index = require('./routes/index');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

loadConfig()
  .then(
    res => ensureDBIsCreated(nconf.get("database_db"))
  )
  /*.then(res => {
    console.log(res);
    return ensureTablesArePopulated([
      'src/database/database_shema.init.sql', 
      'src/database/database_data.init.sql'
    ]);
  })*/
  .then(res => {
    console.log(res);
    var sequelize = getSequelize();
    return initSchemas(sequelize);
  }).then(res => {
    app.use(index);

    app.get('/', (req, res) => {
      res.status(200).json({
        message: 'accueil'
      });
    });

    app.all('*', (req, res) => {
      console.log(req.url);
      res.status(404).end();
    })
    let port = (process.env.PORT) ? process.env.PORT : 80
    let server;
    if(process.env.HOST)
      server = app.listen(port, process.env.HOST);
    else
      app.listen(port);
  })
  .catch(error => console.log("ereure de préset" + error));




// Graceful shutdown.
// On empêche les nouvelles connexions sur le serveur
// Ensuite on close proprement la connexion DB
// https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
process.on('SIGINT', () => {
  server.close((err) => {
    if (err) {
      process.exit(1);
    } else {
      closePool().then(res => {
        console.log("pool fermé");
        process.exit(0);
      }).catch(err => {
        process.exit(1);
      })
    }
  });
});