const singleEmoji = /^\W*(:[\w-+]+:|[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])\W*$/g;

module.exports = robot => {
  // Delete :+1: comments
  robot.on('issue_comment.created', async (event, context) => {
    if (event.payload.comment.body.match(singleEmoji)) {
      const github = await robot.integration.asInstallation(event.payload.installation.id);

      const comment = event.payload.comment;

      const deleteFunction =
        (comment.pull_request_review_id && github.pullRequests.deleteComment) ||
        (comment.commit_id && github.repos.deleteCommitComment) ||
        github.issues.deleteComment;

      return deleteFunction(context.repo({id: comment.id}));
    }
  });
};
