const db = require("../config/db");

async function saveMessage(sessionId, sender, message) {
  await db.query(
    `INSERT INTO chat_messages(session_id,sender,message)
     VALUES($1,$2,$3)`,
    [sessionId, sender, message],
  );

  await db.query(
    `UPDATE chat_sessions
     SET last_message_at = NOW()
     WHERE id=$1`,
    [sessionId],
  );
}

module.exports = { saveMessage };
