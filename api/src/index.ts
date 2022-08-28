"use strict";

import { SignInInteractor } from "./UseCasesFamiles/Signin/Interactors/SignInInteractor";

declare function require(name: string);
import * as express from "express";
const nconf = require("nconf");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

import { loadConfig } from "./configuration";
const { getSequelize } = require("./configuration/sequelize");
const { closePool } = require("./database");
const { buildDataset } = require("./models");
import { PresetQuerry } from "./database/presetQuery";
import GatewayRegisterImpl from "./entitiesFamilies/utils/GatewayRegisterImpl";
import { RequestFactory } from "./Requestors/RequestFactory";
import { InteractorFactory } from "./Requestors/InteractorFactory";

const { initRouters } = require("./routes/index");

const app = express();
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
exports.app = app;

let server;

async function main() {
  await loadConfig();
  await PresetQuerry.ensureDBIsCreated(nconf.get("database_db"));

  const {
    getInitializedPassport,
    injectDependency,
  } = require("./configuration/oauth2.google.passeport");
  injectDependency(getSequelize());
  app.use(getInitializedPassport());

  const gateways = await GatewayRegisterImpl.buildGateways();
  await buildDataset(gateways);

  let apiOrigin = nconf.get("api_url_origin");

  if (apiOrigin) {
    app.use(cors({ origin: apiOrigin }));
  } else {
    app.use(cors());
  }

  app.use(initRouters(gateways));

  const requestFactory = new RequestFactory();
  const interactorFactory = new InteractorFactory([
    {
      name: "SignIn",
      activator: new SignInInteractor(gateways.userDbGateway),
    },
  ]);

  const signInController = new Controller({
    strategy: Controller.STRATEGIES.SEND,
    url: "/api/auth/signin",
    useCaseName: "SignIn",
    requestFactory,
    interactorFactory,
  });
  signInController.addToRouter(app);

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "accueil heroku",
    });
  });

  app.all("*", (req, res) => {
    console.log(req.url);
    res.status(404).end();
  });

  let port: number = process.env.PORT ? Number(process.env.PORT) : 80;
  if (process.env.HOST) {
    server = app.listen(port, process.env.HOST, () => {});
  } else {
    app.listen(port);
  }
}

try {
  main().then((r) => console.log(r));
} catch (err) {
  console.log(`Erreur`);
  console.log(JSON.stringify({ err }, null, 2));
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

// Graceful shutdown.
// On empêche les nouvelles connexions sur le serveur
// Ensuite on close proprement la connexion DB
// https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
process.on("SIGINT", async () => {
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

class Controller {
  private url: string;
  private method: string;
  private successCode: number;
  private useCaseName: string;
  private requestFactory: RequestFactory;
  private interactorFactory: InteractorFactory;

  public static get STRATEGIES() {
    return {
      CREATE: {
        method: "post",
        successCode: 201,
      },
      GET: {
        method: "get",
        successCode: 200,
      },
      SEND: {
        method: "post",
        successCode: 201,
      },
    };
  }

  constructor(opts: {
    url: string;
    strategy: { method: string; successCode: number };
    requestFactory: RequestFactory;
    interactorFactory: InteractorFactory;
    useCaseName: string;
  }) {
    this.url = opts.url;
    this.method = opts.strategy.method;
    this.successCode = opts.strategy.successCode;
    this.requestFactory = opts.requestFactory;
    this.interactorFactory = opts.interactorFactory;
    this.useCaseName = opts.useCaseName;
  }

  public addToRouter(route) {
    route[this.method](this.url, this.executeRouteCmd());
  }

  private executeRouteCmd() {
    return async (req, res) => {
      res.setHeader("Content-Type", "application/json");

      let useCaseRequest;
      try {
        useCaseRequest = await this.requestFactory.make(this.useCaseName, req);
      } catch (err) {
        if (err.name === "ValidationError") {
          return res
            .status(400)
            .end(
              JSON.stringify({ name: err.name, message: err.message }, null, 2)
            );
        } else {
          return res
            .status(500)
            .end(
              JSON.stringify(
                { name: err.name, message: err.message, err },
                null,
                2
              )
            );
        }
      }
      try {
        const interactor = this.interactorFactory.make(this.useCaseName);
        const result = await interactor.execute(useCaseRequest);
        res.status(this.successCode);
        return res.end(JSON.stringify(result, null, 2));
      } catch (err) {
        if (err.name === "NotFoundError") {
          return res
            .status(404)
            .end(
              JSON.stringify({ name: err.name, message: err.message }, null, 2)
            );
        } else {
          return res
            .status(500)
            .end(
              JSON.stringify(
                { name: err.name, message: err.message, err },
                null,
                2
              )
            );
        }
      }
    };
  }
}

module.exports = app;
