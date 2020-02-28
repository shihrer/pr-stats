const { Octokit } = require("@octokit/rest");
const {
  parseISO,
  differenceInBusinessDays,
  differenceInMinutes,
  addBusinessDays
} = require("date-fns");

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
  const daysToReview = differenceInBusinessDays(
    parseISO(first_reviewed),
    parseISO(created_at)
  );

  let minutesToReview = differenceInMinutes(
    parseISO(first_reviewed),
    addBusinessDays(parseISO(created_at), daysToReview)
  );

  const daysToClose = differenceInBusinessDays(
    parseISO(closed_at),
    parseISO(created_at)
  );

  let minutesToClose = differenceInMinutes(
    parseISO(closed_at),
    addBusinessDays(parseISO(created_at), daysToClose)
  );

  minutesToReview += daysToReview * 1440;
  minutesToClose += daysToClose * 1440;

  console.log(
    `${state}\t${created_at}\t${first_reviewed}\t${closed_at}\t${minutesToReview}\t${minutesToClose}`
  );
};
