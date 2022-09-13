'use strict';

import jwt = require('jsonwebtoken');
import GatewayRegisterImpl from '../../EntitiesFamilies/utils/GatewayRegisterImpl';
import { actualConfig } from '../../configuration';

export async function isLoggedIn(req, res, next) {
  const userDb = GatewayRegisterImpl.getUserDbGateway();

  try {
    const rsaPublicKey = actualConfig.rsaKeyPublic;
    const token = tryExtractToken(req);

    let id = await tryExtractUserIdFromToken(token, rsaPublicKey);

    req.user = await tryGetUserById(id);

    next();
  } catch (err) {
    return renderTokenError(res, err);
  }

  async function tryGetUserById(sub) {
    const user = await userDb.findUserById(sub);

    if (!user) {
      throw new Error("Pas d'utilisateur associe");
    }

    return user;
  }
}

// service functions
function tryExtractToken(req) {
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("Il n'y a pas de token");
  }

  return token;
}

function renderTokenError(res, err) {
  if (err.name === 'Error') {
    return res.status(401).end(stringifyError(err));
  } else {
    return res.status(500).end(stringifyError(err));
  }
}

function stringifyError(error) {
  return JSON.stringify({ name: error.name, message: error.message }, null, 2);
}

async function tryExtractUserIdFromToken(token, rsaPublicKey) {
  let id;
  await jwt.verify(token, rsaPublicKey, (err, decoded) => {
    if (err) {
      throw new Error('Mauvais token');
    }
    id = decoded.sub;
  });

  if (!id) {
    throw new Error("Pas d'id dans le token");
  }

  return id;
}
