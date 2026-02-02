const express = require("express");
const path = require("path");

const app = express();

// Статические файлы из dist/spa
app.use(express.static(path.join(__dirname, "dist/spa")));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/spa", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
