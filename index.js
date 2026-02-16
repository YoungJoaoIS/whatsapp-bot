const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "meubot123";

// 🔐 DADOS DA META (coloque os seus)
const TOKEN = "EAAaZAOOiAv4sBQgFUGIOkNZCHVhz5ZCnVFMGbxEFPyCT2Ye2JZBwIJbp92GBAAXxFPXvjaj2DTvR3ZBpGDhy1gZAhnfl60DHjE7958Iu66EghCsZBKlaWI0GNGHRNkybJw90UZAHlgOoHeujXMVZA0ZB9GaVlYLyadTfwTi8ZAujogb8cXOnfUJLOlUZAElDBYpcThnnVpvZANUaEkbZC88JQ02hUxGdRavgjVJFu9sZCMt7MhZCRbHxb908wPHfCwUJsM2nccWtGglep76n5FX6QEBas4nw5CgLwwZDZD";
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
        `https://graph.facebook.com/v18.0/${893349430539002}/messages`,
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
