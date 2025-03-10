import { Sequelize } from "sequelize";
import { CONFIG_PARAMS } from "../helpers/config.js";

const database = CONFIG_PARAMS.database;

export const sequelize = new Sequelize({
  dialect: "postgres", // Changed from "mysql" to "postgres"
  host: database.host,
  username: database.user,
  password: database.password,
  database: database.database,
  logging: false, // Disable logging (set to `true` for debugging)
  port: 5432, // Ensure this matches your PostgreSQL port
});

sequelize.authenticate()
  .then(() => console.log("PostgreSQL connected successfully"))
  .catch((err) => console.error("Failed to connect to PostgreSQL", err));


export default sequelize;
