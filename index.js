const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "meubot123";

// 🔐 DADOS DA META (coloque os seus)
const TOKEN = "EAAaZAOOiAv4sBQsVwtJBCnmBlD0crLpb4wsybPLPlb7D8DB5omx4Ey7bfVHUdr2WtZC0yqrRWT4VsP3fZBConDAOwDkTKWRL2xQ5ZBgGeWnmuvvRScVrsGVDFD2sZBJXlKBNz6h0f1n1g7fLWe60ct8Kg8VJpnt6G1aHZAaZBgRkkiZC2latf2cwLx2lvNaBy0uvrYrZBki0R5cxVZCx6j7JoNqcU9vwM4bPUfP1LpptuBvD31sgm7JY9PCy9xJZAP650PXYtnTerXo530CXQpO1d0j2pLnbgZDZD";
const PHONE_NUMBER_ID = "15551753902";

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body;

    if (text) {
      await axios.post(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: `Você disse: ${text}` }
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Bot rodando 🚀");
});
