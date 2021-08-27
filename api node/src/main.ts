import app from "./app";
// import "./database";

const port = process.env.PORT || 8080;

console.clear();

app.listen(port);
console.log(`server on port ${port}`);
