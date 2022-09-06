'use strict';

import { SignInInteractor } from './UseCasesFamiles/SignIn/Interactors/SignInInteractor';

declare function require(name: string);
import * as express from 'express';
const nconf = require('nconf');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

import { loadConfig } from './configuration';
const { closePool } = require('./database');
const { buildDataset } = require('./models');
import { PresetQuery } from './database/presetQuery';
import GatewayRegisterImpl from './entitiesFamilies/utils/GatewayRegisterImpl';
import { RequestFactory } from './Requestors/RequestFactory';
import { InteractorFactory } from './Requestors/InteractorFactory';
import { SignInController } from './UseCasesFamiles/SignIn/Controllers/SignInController';
import { SignInRequest } from './UseCasesFamiles/SignIn/Interactors/SignInRequest';
import { GetCurrentUserInteractor } from './UseCasesFamiles/GetCurrentUser/Interactors/GetCurrentUserInteractor';
import { GetCurrentUserRequest } from './UseCasesFamiles/GetCurrentUser/Interactors/GetCurrentUserRequest';
import { GetCurrentUserController } from './UseCasesFamiles/GetCurrentUser/Controllers/GetCurrentUserController';
import _ = require('lodash');
import { UseCaseFactories } from './UseCasesFamiles/_utils/UseCaseFactories';
import { Controller } from './UseCasesFamiles/_utils/Controller';
import { RefreshTokenController } from './UseCasesFamiles/SignIn/Controllers/RefreshTokenController';
import { RefreshTokenInteractor } from './UseCasesFamiles/SignIn/Interactors/RefreshTokenInteractor';
import { RefreshTokenRequest } from './UseCasesFamiles/SignIn/Interactors/RefreshTokenRequest';
import { GoogleSignInController } from './UseCasesFamiles/SignIn/Controllers/GoogleSignInController';
import { GoogleCbSignInController } from './UseCasesFamiles/SignIn/Controllers/GoogleCbSignInController';
import { ListUsersController } from './UseCasesFamiles/ManageUsers/Controllers/ListUsersController';
import { ListUsersInteractor } from './UseCasesFamiles/ManageUsers/Interactors/ListUsersInterractor';
import { ListRolesController } from './UseCasesFamiles/ListRoles/Controllers/ListRolesController';
import { ListRolesInteractor } from './UseCasesFamiles/ListRoles/Interactors/ListRolesInterractor';
import { AddUserController } from './UseCasesFamiles/ManageUsers/Controllers/AddUserController';
import { AddUserInteractor } from './UseCasesFamiles/ManageUsers/Interactors/AddUserInterractor';
import { AddUserRequest } from './UseCasesFamiles/ManageUsers/Interactors/AddUserRequest';
import { UpdateUserController } from './UseCasesFamiles/ManageUsers/Controllers/UpdateUserController';
import { UpdateUserRequest } from './UseCasesFamiles/ManageUsers/Interactors/UpdateUserRequest';
import { UpdateUserInteractor } from './UseCasesFamiles/ManageUsers/Interactors/UpdateUserInterractor';
import { DeleteUserController } from './UseCasesFamiles/ManageUsers/Controllers/DeleteUserController';
import * as console from 'console';
import { DeleteUserRequest } from './UseCasesFamiles/ManageUsers/Interactors/DeleteUserRequest';
import { DeleteUserInteractor } from './UseCasesFamiles/ManageUsers/Interactors/DeleteUserInterractor';
import { CheckUserEmailExistController } from './UseCasesFamiles/ManageUsers/Controllers/CheckUserEmailExistController';
import { CheckUserEmailExistRequest } from './UseCasesFamiles/ManageUsers/Interactors/CheckUserEmailExistRequest';
import { CheckUserEmailExistInteractor } from './UseCasesFamiles/ManageUsers/Interactors/CheckUserEmailIsUniqueInterractor';
import { ListActivitiesController } from './UseCasesFamiles/ManageActivities/Controllers/ListActivitiesController';
import { ListActivitiesInteractor } from './UseCasesFamiles/ManageActivities/Interractors/ListActivitiesInterractor';
import { CreateActivityController } from './UseCasesFamiles/ManageActivities/Controllers/CreateActivityController';
import { CreateActivityInteractor } from './UseCasesFamiles/ManageActivities/Interractors/CreateActivityInterractor';
import { CreateActivityRequest } from './UseCasesFamiles/ManageActivities/Interractors/CreateActivityRequest';
import { UpdateActivityController } from './UseCasesFamiles/ManageActivities/Controllers/UpdateActivityController';
import { UpdateActivityInteractor } from './UseCasesFamiles/ManageActivities/Interractors/UpdateActivityInterractor';
import { UpdateActivityRequest } from './UseCasesFamiles/ManageActivities/Interractors/UpdateActivityRequest';
import { CheckActivityNameExistController } from './UseCasesFamiles/ManageActivities/Controllers/CheckActivityNameExistController';
import { CheckActivityNameExistInterractor } from './UseCasesFamiles/ManageActivities/Interractors/CheckActivityNameExistInterractor';
import { CheckActivityNameExistRequest } from './UseCasesFamiles/ManageActivities/Interractors/CheckActivityNameExistRequest';
import { DeleteActivityController } from './UseCasesFamiles/ManageActivities/Controllers/DeleteActivityController';
import { DeleteActivityInterractor } from './UseCasesFamiles/ManageActivities/Interractors/DeleteActivityInterractor';
import { DeleteActivityRequest } from './UseCasesFamiles/ManageActivities/Interractors/DeleteActivityRequest';
import { ListProjectController } from './UseCasesFamiles/ManageProjects/Controllers/ListProjectController';
import { ListProjectsInteractor } from './UseCasesFamiles/ManageProjects/Interractors/ListProjectsInterractor';
import { CreateProjectController } from './UseCasesFamiles/ManageProjects/Controllers/CreateProjectController';
import { CreateProjectRequest } from './UseCasesFamiles/ManageProjects/Interractors/CreateProjectRequest';
import { CreateProjectInteractor } from './UseCasesFamiles/ManageProjects/Interractors/CreateProjectInterractor';
import { CheckProjectNameExistController } from './UseCasesFamiles/ManageProjects/Controllers/CheckProjectNameExistController';
import { CheckProjectNameExistRequest } from './UseCasesFamiles/ManageProjects/Interractors/CheckProjectNameExistRequest';
import { CheckProjectNameExistInterractor } from './UseCasesFamiles/ManageProjects/Interractors/CheckProjectNameExistInterractor';
import { UpdateProjectController } from './UseCasesFamiles/ManageProjects/Controllers/UpdateProjectController';
import { UpdateProjectRequest } from './UseCasesFamiles/ManageProjects/Interractors/UpdateProjectRequest';
import { UpdateProjectInteractor } from './UseCasesFamiles/ManageProjects/Interractors/UpdateProjectInterractor';
import { DeleteProjectController } from './UseCasesFamiles/ManageProjects/Controllers/DeleteProjectController';
import { DeleteProjectRequest } from './UseCasesFamiles/ManageProjects/Interractors/DeleteProjectRequest';
import { DeleteProjectInterractor } from './UseCasesFamiles/ManageProjects/Interractors/DeleteProjectInterractor';
import { ListExpenseAccountsController } from './UseCasesFamiles/ManageExpenseAccounts/Controllers/ListExpenseAccountsController';
import { ListExpenseAccountInteractor } from './UseCasesFamiles/ManageExpenseAccounts/Interractors/ListExpenseAccountInterractor';
import { CreateExpenseAccountController } from './UseCasesFamiles/ManageExpenseAccounts/Controllers/CreateExpenseAccountController';
import { CreateExpenseAccountRequest } from './UseCasesFamiles/ManageExpenseAccounts/Interractors/CreateExpenseAccountRequest';
import { CreateExpenseAccountInterractor } from './UseCasesFamiles/ManageExpenseAccounts/Interractors/CreateExpenseAccountInterractor';
import { CheckExpenseAccountNameExistController } from './UseCasesFamiles/ManageExpenseAccounts/Controllers/CheckExpenseAccountNameExistController';
import { CheckExpenseAccountNameExistRequest } from './UseCasesFamiles/ManageExpenseAccounts/Interractors/CheckExpenseAccountNameExistRequest';
import { CheckExpenseAccountNameExistInterractor } from './UseCasesFamiles/ManageExpenseAccounts/Interractors/CheckExpenseAccountNameExistInterractor';

const { initRouters } = require('./routes/index');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
exports.app = app;

let server;

async function main() {
  await loadConfig();
  await PresetQuery.ensureDBIsCreated(nconf.get('database_db'));

  const { getInitializedPassport } = require('./configuration/oauth2.google.passeport');
  app.use(getInitializedPassport());

  const gateways = await GatewayRegisterImpl.buildGateways();

  if (nconf.get('have_to_build_dataset')) {
    await PresetQuery.syncSchemas();
  }
  if (nconf.get('have_to_sync_schemas')) {
    await buildDataset(gateways);
  }

  let apiOrigin = nconf.get('api_url_origin');
  if (apiOrigin) {
    app.use(cors({ origin: apiOrigin }));
  } else {
    app.use(cors());
  }

  app.use(initRouters(gateways));

  const requestFactories = new RequestFactory([
    {
      name: 'SignIn',
      requestFactory: async (req) => {
        await SignInRequest.checkBuildParamsAreValid(req.body);
        return new SignInRequest(req.body);
      },
    },
    {
      name: 'GetCurrentUser',
      requestFactory: async (req) => {
        const params = { id: _.get(req, 'user.id') + '' };
        await GetCurrentUserRequest.checkBuildParamsAreValid(params);
        return new GetCurrentUserRequest(params);
      },
    },
    {
      name: 'RefreshToken',
      requestFactory: async (req) => {
        const params = { token: _.get(req, 'headers.authorization') };
        await RefreshTokenRequest.checkBuildParamsAreValid(params);
        return new RefreshTokenRequest(params);
      },
    },
    {
      name: 'AddUser',
      requestFactory: async (req) => {
        // TODO remove roleName from frontend query
        const params = _.omit(req.body, ['roleName']);
        await AddUserRequest.checkBuildParamsAreValid(params);
        return new AddUserRequest(params);
      },
    },
    {
      name: 'UpdateUser',
      requestFactory: async (req) => {
        const params = await UpdateUserRequest.checkBuildParamsAreValid(req.body);
        return new UpdateUserRequest(params);
      },
    },
    {
      name: 'DeleteUser',
      requestFactory: async (req) => {
        const params = { ...req.params };
        params.id = Number(params.id);
        await DeleteUserRequest.checkBuildParamsAreValid(params);
        return new DeleteUserRequest(params);
      },
    },
    {
      name: 'CheckUserEmailExist',
      requestFactory: async (req) => {
        const params = await CheckUserEmailExistRequest.checkBuildParamsAreValid(req.params);
        return new CheckUserEmailExistRequest(params);
      },
    },
    {
      name: 'CreateActivity',
      requestFactory: async (req) => {
        const params = await CreateActivityRequest.checkBuildParamsAreValid(req.body);
        return new CreateActivityRequest(params);
      },
    },
    {
      name: 'UpdateActivity',
      requestFactory: async (req) => {
        const params = await UpdateActivityRequest.checkBuildParamsAreValid(req.body);
        return new UpdateActivityRequest(params);
      },
    },
    {
      name: 'CheckActivityNameExist',
      requestFactory: async (req) => {
        const params = await CheckActivityNameExistRequest.checkBuildParamsAreValid(req.body);
        return new CheckActivityNameExistRequest(params);
      },
    },
    {
      name: 'DeleteActivity',
      requestFactory: async (req) => {
        const params = await DeleteActivityRequest.checkBuildParamsAreValid(req.params);
        return new DeleteActivityRequest(params);
      },
    },
    {
      name: 'CreateProject',
      requestFactory: async (req) => {
        const { ProjectId, ...params } = await CreateProjectRequest.checkBuildParamsAreValid(req.body);
        if (ProjectId && ProjectId > 0) {
          params.ProjectId = ProjectId;
        }
        return new CreateProjectRequest(params);
      },
    },
    {
      name: 'CheckProjectNameExist',
      requestFactory: async (req) => {
        const params = await CheckProjectNameExistRequest.checkBuildParamsAreValid(req.params);
        return new CheckProjectNameExistRequest(params);
      },
    },
    {
      name: 'UpdateProject',
      requestFactory: async (req) => {
        const params = await UpdateProjectRequest.checkBuildParamsAreValid(req.body);
        return new UpdateProjectRequest(params);
      },
    },
    {
      name: 'DeleteProject',
      requestFactory: async (req) => {
        const params = await DeleteProjectRequest.checkBuildParamsAreValid(req.params);
        return new DeleteProjectRequest(params);
      },
    },
    {
      name: 'CreateExpenseAccount',
      requestFactory: async (req) => {
        const { ExpenseAccountId, ...params } = await CreateExpenseAccountRequest.checkBuildParamsAreValid(req.body);
        if (ExpenseAccountId && ExpenseAccountId > 0) {
          params.ExpenseAccountId = ExpenseAccountId;
        }
        return new CreateExpenseAccountRequest(params);
      },
    },
    {
      name: 'CheckExpenseAccountNameExist',
      requestFactory: async (req) => {
        const params = await CheckExpenseAccountNameExistRequest.checkBuildParamsAreValid(req.params);
        return new CheckExpenseAccountNameExistRequest(params);
      },
    },
  ]);

  const interactorFactories = new InteractorFactory([
    { name: 'SignIn', activator: new SignInInteractor(gateways.userDbGateway) },
    { name: 'GetCurrentUser', activator: new GetCurrentUserInteractor(gateways.userDbGateway) },
    { name: 'RefreshToken', activator: new RefreshTokenInteractor(gateways.userDbGateway) },
    { name: 'ListUsers', activator: new ListUsersInteractor(gateways.userDbGateway) },
    { name: 'ListRoles', activator: new ListRolesInteractor(gateways.userDbGateway) },
    { name: 'AddUser', activator: new AddUserInteractor(gateways.userDbGateway) },
    { name: 'UpdateUser', activator: new UpdateUserInteractor(gateways.userDbGateway) },
    { name: 'DeleteUser', activator: new DeleteUserInteractor(gateways.userDbGateway) },
    { name: 'CheckUserEmailExist', activator: new CheckUserEmailExistInteractor(gateways.userDbGateway) },
    { name: 'ListActivities', activator: new ListActivitiesInteractor(gateways.activityDbGateway) },
    { name: 'CreateActivity', activator: new CreateActivityInteractor(gateways.activityDbGateway) },
    { name: 'UpdateActivity', activator: new UpdateActivityInteractor(gateways.activityDbGateway) },
    { name: 'CheckActivityNameExist', activator: new CheckActivityNameExistInterractor(gateways.activityDbGateway) },
    { name: 'DeleteActivity', activator: new DeleteActivityInterractor(gateways.activityDbGateway) },
    { name: 'ListProjects', activator: new ListProjectsInteractor(gateways.projectDbGateway) },
    { name: 'CreateProject', activator: new CreateProjectInteractor(gateways.projectDbGateway) },
    { name: 'CheckProjectNameExist', activator: new CheckProjectNameExistInterractor(gateways.projectDbGateway) },
    { name: 'UpdateProject', activator: new UpdateProjectInteractor(gateways.projectDbGateway) },
    { name: 'DeleteProject', activator: new DeleteProjectInterractor(gateways.projectDbGateway) },
    { name: 'ListExpenseAccounts', activator: new ListExpenseAccountInteractor(gateways.expenseAccountDBGateway) },
    { name: 'CreateExpenseAccount', activator: new CreateExpenseAccountInterractor(gateways.expenseAccountDBGateway) },
    { name: 'CheckExpenseAccountNameExist', activator: new CheckExpenseAccountNameExistInterractor(gateways.expenseAccountDBGateway) },
  ]);

  UseCaseFactories.initFactories({
    requestFactories,
    interactorFactories,
  });

  RouteManager.setRouteHandler(app);
  RouteManager.addController(new GoogleSignInController({ url: '/api/auth/google' }));
  RouteManager.addController(new GoogleCbSignInController({ url: '/api/auth/google/cb' }));
  RouteManager.addController(new SignInController({ url: '/api/auth/signin' }));
  RouteManager.addController(new GetCurrentUserController({ url: '/api/user/curent' }));
  RouteManager.addController(new RefreshTokenController({ url: '/api/auth/refresh-token' }));
  RouteManager.addController(new ListUsersController({ url: '/api/user' }));
  RouteManager.addController(new ListRolesController({ url: '/api/roles' }));
  RouteManager.addController(new AddUserController({ url: '/api/user' }));
  RouteManager.addController(new UpdateUserController({ url: '/api/user' }));
  RouteManager.addController(new DeleteUserController({ url: '/api/user/:id' }));
  RouteManager.addController(new CheckUserEmailExistController({ url: '/api/user/isEmailExist/:email' }));
  RouteManager.addController(new ListActivitiesController({ url: '/api/activity' }));
  RouteManager.addController(new CreateActivityController({ url: '/api/activity' }));
  RouteManager.addController(new UpdateActivityController({ url: '/api/activity' }));
  RouteManager.addController(new CheckActivityNameExistController({ url: '/api/activity/is-name-exist' }));
  RouteManager.addController(new DeleteActivityController({ url: '/api/activity/:id' }));
  RouteManager.addController(new ListProjectController({ url: '/api/project' }));
  RouteManager.addController(new CreateProjectController({ url: '/api/project' }));
  RouteManager.addController(new CheckProjectNameExistController({ url: '/api/project/is-name-exist/:name' }));
  RouteManager.addController(new UpdateProjectController({ url: '/api/project' }));
  RouteManager.addController(new DeleteProjectController({ url: '/api/project/:id' }));
  RouteManager.addController(new ListExpenseAccountsController({ url: '/api/expense-account' }));
  RouteManager.addController(new CreateExpenseAccountController({ url: '/api/expense-account' }));
  RouteManager.addController(new CheckExpenseAccountNameExistController({ url: '/api/expense-account/is-name-exist/:name' }));

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'accueil heroku ' });
  });

  app.all('*', (req, res) => {
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
  main().then(() => console.log('Main started!'));
} catch (err) {
  console.log(`Erreur !`);
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
        console.log('pool fermé');
        process.exit(0);
      } catch (err) {
        process.exit(1);
      }
    }
  });
});

module.exports = app;
