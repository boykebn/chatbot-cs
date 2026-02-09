const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  DisconnectReason,
} = require("@whiskeysockets/baileys");

async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("wa-session");

  const sock = makeWASocket({
    auth: state,
    browser: Browsers.macOS("Desktop"),
  });

  sock.ev.on("creds.update", saveCreds);

  let pairingRequested = false;

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    console.log("WA STATE:", connection);

    if (connection === "connecting" && !pairingRequested) {
      pairingRequested = true;

      // tunggu handshake websocket selesai
      setTimeout(async () => {
        try {
          if (!sock.authState.creds.registered) {
            const phoneNumber = "628XXXXXXXXXX"; // nomor kamu
            const code = await sock.requestPairingCode(phoneNumber);
            console.log("\nKODE PAIRING ANDA:", code, "\n");
          }
        } catch (err) {
          console.log("PAIRING ERROR:", err?.output?.statusCode, err?.message);
        }
      }, 4000); // ⬅️ penting (WA butuh waktu siap)
    }

    if (connection === "open") {
      console.log("WhatsApp connected ✅");
    }

    if (connection === "close") {
      console.log("WA closed, reconnecting...");
      startWhatsApp();
    }
  });
}

module.exports = startWhatsApp;
