"use strict";

const mysql = require('mysql');
const settings = require('./settings');
const res = require('./response');

/* for localhost mysql database */
const config = {
  host: process.env.DB_HOST || settings.sql.host,
  user: process.env.DB_USER || settings.sql.user,
  password: process.env.DB_PASS || settings.sql.pass,
  name: process.env.DB_NAME || settings.sql.dbName,
  port: process.env.DB_PORT || settings.sql.dbPort
};

const state = {
  pool: null
};

exports.connect = function (done) {

  state.pool = mysql.createPool({
    connectionLimit: 100, //important
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.name,
    port: config.port
  });

  return new Promise((resolve, reject) => {
    let conn = execute("Select version()", []);
    conn.then((data) => {
      resolve(data);
    }).catch((error) => {
      reject(error);
    });
  });
};

exports.get = function (callback) {
  return state.pool;
};

function execute(sql, param) {
  return new Promise((resolve, reject) => {
    state.pool.getConnection(function (error, connection) {
      if (error) {
        reject(res.Error(error, "There is error connecting in the database.", 500));
      } else {
        connection.query(sql, param, function (err, rows) {
          connection.release();
          if (!err) {
            resolve(res.Success(rows, "Success", 200));
          } else {
            reject(res.Error(err, "There is error in querying in the database.", 500));
          }
        });

        connection.on('error', function (err) {
          connection.release();
          reject(res.Error(err, "There is error in connecting in the database pool.", 500));
        });
      }
    });
  });
};

exports.execute = execute;