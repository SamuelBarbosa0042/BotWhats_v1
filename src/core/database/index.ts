import knex from "knex";
import knexfile from "../../../knexfile";
import dotenv from "dotenv";

dotenv.config();

type ambiente = keyof typeof knexfile;

//console.log(process.env.NODE_ENV)

const config = knex(knexfile[String(process.env.NODE_ENV) as ambiente]);

export default config;
