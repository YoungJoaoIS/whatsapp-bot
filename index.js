const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "meubot123";

// 🔐 DADOS DA META (coloque os seus)
const TOKEN = "EAAaZAOOiAv4sBQjocvsZC3Ks17TLv77dwHYtmSaEkt4ZAsMdkHApSDM1BYsYkQ0cJHxEEeIewkhS0zZApRZAuLhujMkItBltcLZBkJsYvgB6VJ9h3ta5GfaE8CrT8ZBbjt7CvnBSVVmWkAZBMXW5AzZBVHU9LG5RYUScGq4zkY7peOwGjUAUWt4a79qZBqZCyAeYx4fdcHM9lNF6Stcy6D3S3ZAkY89SeGpNRFnQbEM8mS017NTE76FJ2K40idwWWp5O0ZCdGObxlY6Q7kRVZAyBlMUm2B8Edz";
const PHONE_NUMBER_ID = "867840126041216";

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
