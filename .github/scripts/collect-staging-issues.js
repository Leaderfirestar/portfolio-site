const { Octokit } = require("@octokit/rest");

const [baseBranch, headBranch, repoFull, stagingToMainPr] = process.argv.slice(2);

const [owner, repo] = repoFull.split("/");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function run() {
	// 1️⃣ Find merged PRs into staging since last main
	const { data: commits } = await octokit.repos.compareCommits({
		owner, repo, base: baseBranch, head: headBranch,
	});

	const mergedPRs = [];
	for (const c of commits.commits) {
		const { data: prs } = await octokit.repos.listPullRequestsAssociatedWithCommit({
			owner, repo, commit_sha: c.sha,
		});
		for (const pr of prs) {
			if (pr.merged_at && pr.base.ref === headBranch) {
				mergedPRs.push(pr.number);
			}
		}
	}

	// 2️⃣ Collect issue references
	const issuesToClose = new Set();
	const prNumbers = new Set(mergedPRs);
	for (const prNum of prNumbers) {
		const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number: prNum });
		const matches = pr.body?.match(/(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\s+#\d+/gi) || [];
		for (const m of matches) {
			const numMatch = m.match(/#\d+/)[0];
			issuesToClose.add(numMatch);
		}
	}

	if (issuesToClose.size === 0) {
		console.log("✅ No issues to close.");
		return;
	}

	// 3️⃣ Update the PR description on staging→main
	const closeLine = `\n\n**Closes:** ${[...issuesToClose].join(", ")}`;
	const { data: mainPr } = await octokit.pulls.get({
		owner, repo, pull_number: parseInt(stagingToMainPr, 10),
	});

	if (!mainPr.body.includes(closeLine.trim())) {
		const updatedBody = (mainPr.body || "") + closeLine;
		await octokit.pulls.update({
			owner,
			repo,
			pull_number: mainPr.number,
			body: updatedBody,
		});
		console.log(`Appended "${closeLine.trim()}" to PR #${mainPr.number}`);
	} else {
		console.log("✅ Issue references already exist in PR body.");
	}
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
