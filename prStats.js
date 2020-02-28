const { Octokit } = require("@octokit/rest");

exports.prStats = async (url, apiKey) => {
  const myUrl = new URL(url);
  const [owner, repo, pull, pull_number] = myUrl.pathname
    .replace(/^(\/)/, "")
    .split("/");

  const gh = new Octokit({ auth: apiKey });
  const pr = await gh.pulls.get({ owner, repo, pull_number });
  const reviews = await gh.pulls.listReviews({ owner, repo, pull_number });

  let first_reviewed;
  if (reviews.data.length > 0) {
    first_reviewed = reviews.data[0].submitted_at;
  }

  const { created_at, state, closed_at } = pr.data;
  console.log(`${state}\t${created_at}\t${first_reviewed}\t${closed_at}`);
};
