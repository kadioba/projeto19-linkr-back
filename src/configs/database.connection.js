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

db.query(`SELECT '🐘 PostgreSQL - ' || TO_CHAR(NOW(), 'HH24:MI:SS DD/MM/YYYY') AS output`, (err, res) => {
  if (err) console.log(err) || process.exit(1);
  const { output } = res.rows[0];
  console.log(output);
});

export default db;
