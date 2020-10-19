const { Router } = require("express");
const GitHub = require("octocat");
const dotenv = require("dotenv");

dotenv.config();

const api = new Router();
const client = new GitHub({ token: process.env.TOKEN });

api.get("/repo/:user/:repo", (req, res) => {
	let user = req.params.user;
	let repo = req.params.repo;

	client.get("/repos/" + user + "/" + repo + "/topics", {}, {
		headers: {
			"Accept": "application/vnd.github.mercy-preview+json"
		}
	}).then(data => {
		if(data.statusCode != 200) return res.status(data.statusCode).json({ code: 404, msg: "Not Found" });
		let topics = data.body.names;
		let eligible = typeof topics.find(t => ["hacktoberfest", "hacktoberfest-2020"].includes(t.toLowerCase())) == "string";
		res.json({ repo, user, eligible });
	}).catch(e => {
		res.status(404).json({ code: 404, msg: e.message });
	})
});

api.get("/pr/:user/:repo/:pr_num", (req, res) => {
	let user = req.params.user;
	let repo = req.params.repo;
	let pr_num = parseInt(req.params.pr_num);

	if(!pr_num) return res.status(401).json({ code: 401, msg: "Invalid PR Number" });

	client.get("/repos/" + user + "/" + repo + "/pulls/" + pr_num).then(data => {
		if(data.statusCode != 200) return res.status(data.statusCode).json({ code: data.statusCode, msg: "Failed" });
		let labels = data.body.labels.map(l => l.name);
		let isEligible = typeof labels.find(e => e.toLowerCase() == "hacktoberfest-accepted") == "string";
		let isInvalid = typeof labels.find(e => [ "invalid", "spam" ].includes(e.toLowerCase())) == "string";
		if(isEligible) return res.json({ repo, user, pr_num, eligible: isEligible });
		else if(isInvalid) return res.json({ repo, user, pr_num, invalid: isInvalid, eligible: false });
		else {
			client.get("/repos/" + user + "/" + repo + "/topics", {}, {
				headers: {
				"Accept": "application/vnd.github.mercy-preview+json"
				}
			}).then(data2 => {
				let topics = data2.body.names;
				let eligible = typeof topics.find(t => ["hacktoberfest", "hacktoberfest-2020"].includes(t.toLowerCase())) == "string";
				if(!eligible) return res.json({ repo, user, pr_num, eligible });
				client.get("/repos/" + user + "/" + repo + "/pulls/" + pr_num + "/merge").then(merge => {
					// Yes, its merged
					res.json({ repo, user, pr_num, eligible: true, merged: true });
				}).catch(e => {
					res.json({ repo, user, pr_num, merged: false, repoEligible: true });
				});
			}).catch(e => {
				res.status(404).json({ code: 404, msg: "Error - " + e.message });
			});
		}
	}).catch(e => {
		res.status(404).json({ code: 404, msg: "Error - " + e.message });
	})
});

module.exports = api;