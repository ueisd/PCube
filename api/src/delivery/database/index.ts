import * as mysql from 'mysql';
import * as nconf from 'nconf';

let pool;
let connection;

export const execQuery = async (sql) => {
  connection = await exports.getConnection();
  return new Promise(function (resolve, reject) {
    connection.query(sql, function (err, result) {
      connection.release();
      if (err) reject(err);
      resolve(result);
    });
  });
};

export const execQueryNoDB = async (sql) => {
  let connection = await getConnectionNoDB();
  return new Promise(function (resolve, reject) {
    connection.query(sql, function (err, result) {
      connection.end();
      if (err) reject(err);
      resolve(result);
    });
  });
};

export const closePool = () => {
  return new Promise((reject, resolve) => {
    if (!pool) resolve();
    pool.end(function (err) {
      if (err) reject(err);
      resolve();
    });
  });
};

export const getConnection = () => {
  return new Promise((resolve, reject) => {
    try {
      if (!pool) {
        pool = mysql.createPool({
          connectionLimit: 10,
          host: nconf.get('database_host'),
          user: nconf.get('database_user'),
          password: nconf.get('database_password'),
          database: nconf.get('database_db'),
        });
      }
      pool.getConnection(function (err, connection) {
        if (err) reject(err);
        else resolve(connection);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getConnectionNoDB = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      var con = mysql.createConnection({
        host: nconf.get('database_host'),
        user: nconf.get('database_user'),
        password: nconf.get('database_password'),
      });
      con.connect(function (err) {
        if (err) reject(err);
        resolve(con);
      });
      return con;
    } catch (err) {
      reject(err);
    }
  });
};
