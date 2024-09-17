"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const config = require("../config/config");
// const { dbConfig } = require("../config/config");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "production";
// const config = require(__dirname + "/../config/config.json")[env];
const pg = require("pg");

const db = {};

require("dotenv").config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID, ENDPOINT } =
  process.env;
// PGPASSWORD = decodeURIComponent(PGPASSWORD);

let sequelize;
if (config.use_env_variable) {
  // sequelize = new Sequelize(process.env[config.use_env_variable], config);
  sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, config);
} else {
  sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
