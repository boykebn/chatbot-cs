/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

export const up = (pgm) => {
  // ================= CUSTOMERS =================
  pgm.createTable("customers", {
    id: "id",
    phone: { type: "varchar(20)", notNull: true, unique: true },
    name: { type: "varchar(100)" },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  // ================= CHAT SESSIONS =================
  pgm.createTable("chat_sessions", {
    id: "id",
    customer_id: {
      type: "integer",
      notNull: true,
      references: "customers",
      onDelete: "cascade",
    },
    started_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    last_message_at: { type: "timestamp" },
    is_active: { type: "boolean", default: true },
  });

  // ================= CHAT MESSAGES =================
  pgm.createTable("chat_messages", {
    id: "id",
    session_id: {
      type: "integer",
      notNull: true,
      references: "chat_sessions",
      onDelete: "cascade",
    },
    sender: { type: "varchar(10)", notNull: true }, // user | bot | system
    message: { type: "text", notNull: true },
    message_type: { type: "varchar(20)", default: "text" },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  // ================= SESSION MEMORY (AI CONTEXT) =================
  pgm.createTable("session_memory", {
    session_id: {
      type: "integer",
      primaryKey: true,
      references: "chat_sessions",
      onDelete: "cascade",
    },
    last_intent: { type: "varchar(50)" },
    last_product_id: { type: "integer" },
    last_store_id: { type: "integer" },
    collected_data: { type: "jsonb", default: "{}" },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  // ================= AI LOGS (DEBUGGING) =================
  pgm.createTable("ai_logs", {
    id: "id",
    session_id: { type: "integer" },
    user_message: { type: "text" },
    ai_reasoning: { type: "text" },
    tool_called: { type: "varchar(100)" },
    tool_payload: { type: "jsonb" },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  // INDEX biar cepat saat production
  pgm.createIndex("chat_messages", "session_id");
  pgm.createIndex("chat_sessions", "customer_id");
  pgm.createIndex("ai_logs", "session_id");
};

export const down = (pgm) => {
  pgm.dropTable("ai_logs");
  pgm.dropTable("session_memory");
  pgm.dropTable("chat_messages");
  pgm.dropTable("chat_sessions");
  pgm.dropTable("customers");
};
