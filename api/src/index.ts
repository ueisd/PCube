"use strict";

import { SignInInteractor } from "./UseCasesFamiles/SignIn/Interactors/SignInInteractor";

declare function require(name: string);
import * as express from "express";
const nconf = require("nconf");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

import { loadConfig } from "./configuration";
const { closePool } = require("./database");
const { buildDataset } = require("./models");
import { PresetQuerry } from "./database/presetQuery";
import GatewayRegisterImpl from "./entitiesFamilies/utils/GatewayRegisterImpl";
import { RequestFactory } from "./Requestors/RequestFactory";
import { InteractorFactory } from "./Requestors/InteractorFactory";
import { SignInController } from "./UseCasesFamiles/SignIn/Controllers/SignInController";
import { SignInRequest } from "./UseCasesFamiles/SignIn/Interactors/SignInRequest";
import { GetCurrentUserInteractor } from "./UseCasesFamiles/GetCurrentUser/Interactors/GetCurrentUserInteractor";
import { GetCurrentUserRequest } from "./UseCasesFamiles/GetCurrentUser/Interactors/GetCurrentUserRequest";
import { GetCurrentUserController } from "./UseCasesFamiles/GetCurrentUser/Controllers/GetCurrentUserController";
import _ = require("lodash");
import { UseCaseFactories } from "./UseCasesFamiles/_utils/UseCaseFactories";
import { Controller } from "./UseCasesFamiles/_utils/Controller";
import { RefreshTokenController } from "./UseCasesFamiles/SignIn/Controllers/RefreshTokenController";
import { RefreshTokenInteractor } from "./UseCasesFamiles/SignIn/Interactors/RefreshTokenInteractor";
import { RefreshTokenRequest } from "./UseCasesFamiles/SignIn/Interactors/RefreshTokenRequest";

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
  } = require("./configuration/oauth2.google.passeport");
  app.use(getInitializedPassport());

  const gateways = await GatewayRegisterImpl.buildGateways();
  await buildDataset(gateways);

  // let apiOrigin = nconf.get("api_url_origin");
  //
  // if (apiOrigin) {
  //   app.use(cors({ origin: apiOrigin }));
  // } else {
  //   app.use(cors());
  // }

  app.use(cors());

  app.use(initRouters(gateways));

  const requestFactories = new RequestFactory([
    {
      name: "SignIn",
      requestFactory: async (req) => {
        await SignInRequest.checkBuildParamsAreValid(req.body);
        return new SignInRequest(req.body);
      },
    },
    {
      name: "GetCurrentUser",
      requestFactory: async (req) => {
        const params = { id: _.get(req, "user.id") + "" };
        await GetCurrentUserRequest.checkBuildParamsAreValid(params);
        return new GetCurrentUserRequest(params);
      },
    },
    {
      name: "RefreshToken",
      requestFactory: async (req) => {
        const params = { token: _.get(req, "headers.authorization") };
        await RefreshTokenRequest.checkBuildParamsAreValid(params);
        return new RefreshTokenRequest(params);
      },
    },
  ]);
  const interactorFactories = new InteractorFactory([
    {
      name: "SignIn",
      activator: new SignInInteractor(gateways.userDbGateway),
    },
    {
      name: "GetCurrentUser",
      activator: new GetCurrentUserInteractor(gateways.userDbGateway),
    },
    {
      name: "RefreshToken",
      activator: new RefreshTokenInteractor(gateways.userDbGateway),
    },
  ]);

  UseCaseFactories.initFactories({
    requestFactories,
    interactorFactories,
  });

  RouteManager.setRouteHandler(app);
  RouteManager.addController(new SignInController({ url: "/api/auth/signin" }));
  RouteManager.addController(
    new GetCurrentUserController({
      url: "/api/user/curent",
    })
  );

  RouteManager.addController(
    new RefreshTokenController({ url: "/api/auth/refresh-token" })
  );

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

class RouteManager {
  private static routeHandler: any;
  public static setRouteHandler(routeHandler: any) {
    RouteManager.routeHandler = routeHandler;
  }
  public static addController(controller: Controller) {
    controller.addToRouter(RouteManager.routeHandler);
  }
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

module.exports = app;
