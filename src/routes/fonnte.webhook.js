const express = require("express");
const router = express.Router();

const { findOrCreateCustomer } = require("../repositories/customer.repo");
const { getActiveSession } = require("../repositories/session.repo");
const { saveMessage } = require("../repositories/message.repo");

router.post("/fonnte", async (req, res) => {
  try {
    const { sender, message } = req.body;

    if (!sender || !message) return res.sendStatus(200);

    const phone = sender.replace(/[^0-9]/g, "");

    console.log("WA IN:", phone, message);

    // 1. customer
    const customer = await findOrCreateCustomer(phone);

    // 2. session
    const session = await getActiveSession(customer.id);

    // 3. simpan pesan user
    await saveMessage(session.id, "user", message);

    // balasan sementara
    const reply = "Halo 👋 pesanmu sudah masuk sistem";

    await saveMessage(session.id, "bot", reply);

    // kirim balik ke fonnte
    const axios = require("axios");
    await axios.post(
      "https://api.fonnte.com/send",
      {
        target: phone,
        message: reply,
      },
      {
        headers: {
          Authorization: process.env.FONNTE_TOKEN,
        },
      },
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
