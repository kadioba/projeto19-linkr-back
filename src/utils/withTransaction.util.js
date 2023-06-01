import db from "../configs/database.connection.js";

async function withTransaction(callback) {
    try {
      await db.query("BEGIN");
      const result = await callback(db);
      await db.query("COMMIT");
      return result;
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  }

export default withTransaction;
