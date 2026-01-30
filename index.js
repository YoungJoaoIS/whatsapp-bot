const express = require("express");
const app = express();

app.use(express.json());

const VERIFY_TOKEN = "meubot123"; // use o MESMO token da Meta

app.get("/", (req, res) => {
  res.send("Servidor online 🚀");
});

// 🔑 VERIFICAÇÃO DO WEBHOOK (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verificado com sucesso ✅");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 📩 RECEBER MENSAGENS (POST)
app.post("/webhook", (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Rodando na porta", PORT);
});
