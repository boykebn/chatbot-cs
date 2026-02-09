const db = require("../config/db");

async function getActiveSession(customerId) {
  const res = await db.query(
    `SELECT * FROM chat_sessions
     WHERE customer_id=$1 AND is_active=true
     ORDER BY started_at DESC LIMIT 1`,
    [customerId],
  );

  if (res.rows.length) return res.rows[0];

  const insert = await db.query(
    `INSERT INTO chat_sessions(customer_id,last_message_at)
     VALUES($1,NOW()) RETURNING *`,
    [customerId],
  );

  return insert.rows[0];
}

module.exports = { getActiveSession };
