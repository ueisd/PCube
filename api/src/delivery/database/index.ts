import * as mysql from 'mysql';
import { actualConfig } from '../../configuration';

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
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

// export const closePool = () => {
//   return new Promise((reject, resolve) => {
//     if (!pool) resolve();
//     pool.end(function (err) {
//       if (err) reject(err);
//       resolve();
//     });
//   });
// };

export const getConnection = () => {
  return new Promise((resolve, reject) => {
    try {
      if (!pool) {
        pool = mysql.createPool({
          connectionLimit: 10,
          host: actualConfig.database_host,
          user: actualConfig.database_user,
          password: actualConfig.database_password,
          database: actualConfig.database_db,
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
      const connectionConfig: any = {
        host: actualConfig.database_host,
        user: actualConfig.database_user,
        password: actualConfig.database_password,
      };

      if (actualConfig.database_port) {
        connectionConfig.port = actualConfig.database_port;
      }

      console.log('4'.repeat(100));
      console.log(connectionConfig);

      const con = mysql.createConnection(connectionConfig);
      con.connect(function (err) {
        if (err) {
          reject(err);
        }
        resolve(con);
      });
    } catch (err) {
      reject(err);
    }
  });
};
