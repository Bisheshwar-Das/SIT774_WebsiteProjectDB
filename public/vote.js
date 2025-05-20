function setUpVotes(cardElement, scenario) {
  const upvoteBtn = cardElement.querySelector(".upvote-btn");
  const downvoteBtn = cardElement.querySelector(".downvote-btn");

  const upvoteCount = upvoteBtn.querySelector(".upvote-count");
  const downvoteCount = downvoteBtn.querySelector(".downvote-count");
  const upvoteIcon = upvoteBtn.querySelector(".bi");
  const downvoteIcon = downvoteBtn.querySelector(".bi");

  upvoteBtn.addEventListener("click", () => {
    if (scenario.userVoted === 'up') {
      scenario.upvotes--;
      upvoteCount.textContent = scenario.upvotes;
      upvoteBtn.classList.remove("text-success");
      upvoteIcon.classList.replace("bi-hand-thumbs-up-fill", "bi-hand-thumbs-up");
      scenario.userVoted = null;
    } else {
      if (scenario.userVoted === 'down') {
        scenario.downvotes--;
        downvoteCount.textContent = scenario.downvotes;
        downvoteBtn.classList.remove("text-danger");
        downvoteIcon.classList.replace("bi-hand-thumbs-down-fill", "bi-hand-thumbs-down");
      }
      scenario.upvotes++;
      upvoteCount.textContent = scenario.upvotes;
      upvoteBtn.classList.add("text-success");
      upvoteIcon.classList.replace("bi-hand-thumbs-up", "bi-hand-thumbs-up-fill");
      scenario.userVoted = 'up';
    }
  });

  downvoteBtn.addEventListener("click", () => {
    if (scenario.userVoted === 'down') {
      scenario.downvotes--;
      downvoteCount.textContent = scenario.downvotes;
      downvoteBtn.classList.remove("text-danger");
      downvoteIcon.classList.replace("bi-hand-thumbs-down-fill", "bi-hand-thumbs-down");
      scenario.userVoted = null;
    } else {
      if (scenario.userVoted === 'up') {
        scenario.upvotes--;
        upvoteCount.textContent = scenario.upvotes;
        upvoteBtn.classList.remove("text-success");
        upvoteIcon.classList.replace("bi-hand-thumbs-up-fill", "bi-hand-thumbs-up");
      }
      scenario.downvotes++;
      downvoteCount.textContent = scenario.downvotes;
      downvoteBtn.classList.add("text-danger");
      downvoteIcon.classList.replace("bi-hand-thumbs-down", "bi-hand-thumbs-down-fill");
      scenario.userVoted = 'down';
    }
  });
}
