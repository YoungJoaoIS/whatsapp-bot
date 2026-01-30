const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "meubot123";

// 🔐 DADOS DA META (coloque os seus)
const TOKEN = "EAAaZAOOiAv4sBQh81k9dBacEbAMlOZAHCSkz7NTViBDMZB8sPwjxB6E1UA8CRLn3bBlYDrM70Cfe0a1yaQou4ifz1R3NviewZARw6WMKvOiCBqbMZBbIVjvl7XdDzZCUZCkWxZBmFCrhSVkuq1yxcdtOPJB68cV8jrFlCFcMC55FZAKB9Vtkjk7QLAX2nicPpxH4ZC76oI3jtYCsuSG8ADbKWCAGfvEUkXZBF7pfCnZBqXZCCUUByjqs206ZAji4mZCvJvycBNtXZA6AZBrrvhmx9PZAzWN5ufhqM3pAZDZD";
const PHONE_NUMBER_ID = "893349430539002";

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
