require("dotenv").config();
const pg = require("pg");

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } =
  process.env;
PGPASSWORD = decodeURIComponent(PGPASSWORD);

module.exports = {
  development: {
    username: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    host: PGHOST,
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
