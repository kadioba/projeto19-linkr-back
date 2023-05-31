import pg from "pg";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const { Pool } = pg;

const configDatabase = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.MODE === "prod") configDatabase.ssl = true;

const db = new Pool(configDatabase);

db.query('SELECT NOW()', (err, res) => {
  if(err) console.log(err)
  console.log(res.rows[0])
})

export default db;  