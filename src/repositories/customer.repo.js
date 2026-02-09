const db = require("../config/db");

async function findOrCreateCustomer(phone) {
  const existing = await db.query("SELECT * FROM customers WHERE phone = $1", [
    phone,
  ]);

  if (existing.rows.length) return existing.rows[0];

  const insert = await db.query(
    "INSERT INTO customers(phone) VALUES($1) RETURNING *",
    [phone],
  );

  return insert.rows[0];
}

module.exports = { findOrCreateCustomer };
