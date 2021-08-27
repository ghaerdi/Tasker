console.clear();

import app from "./app";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import "./database";

const port = process.env.PORT || 8080;

app.listen(port);
console.log(`server on port ${port}`);
