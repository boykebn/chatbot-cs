const { findOrCreateCustomer } = require("../repositories/customer.repo");
const { getActiveSession } = require("../repositories/session.repo");
const { saveMessage } = require("../repositories/message.repo");

async function handleIncomingMessage(sock, msg) {
  try {
    if (!msg.message) return;

    const jid = msg.key.remoteJid;
    const phone = jid.split("@")[0];

    const text =
      msg.message.conversation || msg.message.extendedTextMessage?.text;

    if (!text) return;

    console.log("Incoming:", phone, text);

    // 1. customer
    const customer = await findOrCreateCustomer(phone);

    // 2. session
    const session = await getActiveSession(customer.id);

    // 3. simpan pesan user
    await saveMessage(session.id, "user", text);

    // 4. balasan dummy dulu
    const reply = "Pesan kamu sudah saya terima 👍";

    await saveMessage(session.id, "bot", reply);

    await sock.sendMessage(jid, { text: reply });
  } catch (err) {
    console.error("WA Handler Error:", err);
  }
}

module.exports = { handleIncomingMessage };
