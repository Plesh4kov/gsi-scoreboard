const express = require("express");
const app = express();
const PORT = 2727;

app.use(express.json());

app.post("/api/gsi", (req, res) => {
  console.log("GSI Data Received:", req.body); // Логируем полученные данные
  res.status(200).send("OK");
});

app.listen(PORT, "192.168.88.141", () => {
  console.log(`GSI Server running on http://192.168.88.141:${PORT}`);
});
