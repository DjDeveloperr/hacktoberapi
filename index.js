const express = require("express");
const api = require("./api");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.send(`GET /api/repo/:user/:repo - If repo is eligible for Hacktoberfest<br/>GET /api/pr/:user/:repo/:pr_num - If PR counts for Hacktoberfest`);
});

app.use("/api", api);

app.listen(port, () => console.log(`Listening on port: ${port}`));