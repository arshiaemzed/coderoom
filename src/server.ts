import { json } from "body-parser";
import express from "express";

const app = express();

app.use(json);

app.router.get("/", (req, res) => {
  console.log("hey");
  res.json({ message: "hello" });
});

app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
