function loadScenarios() {
  const scenarioContainer = document.getElementById('scenario-container');
  scenarioContainer.innerHTML = ''; // Clear any existing content

  scenarios.forEach(scenario => {

    let tagsHTML = '';
    for (let i = 0; i < scenario.tags.length; i++) {
      const tag = scenario.tags[i];
      const bgColor = tagStyles[tag] || '#bdc3c7';
      tagsHTML += `<span class="badge me-2" style="background-color: ${bgColor}; color: white;">${tag}</span>`;
    }


    const card = document.createElement('div');
    card.classList.add('col-xl-4', 'col-lg-6');

    card.innerHTML = `
      <div class="card h-100">
        <img src="${scenario.imageUrl}" class="card-img-top img-fluid" alt="${scenario.title}"
            style="height: 200px;object-fit:cover;">
        <div class="card-body">
          <div class="mb-2">
            ${tagsHTML}
          </div>
          <h5 class="card-title">${scenario.title}</h5>
          <p class="card-text description">${scenario.description}</p>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <a href="discussion.html?id=${scenario.id}" class="btn btn-outline-primary btn-sm">Join the Discussion</a>
    
          <div class="d-flex align-items-center">
            <button class="btn btn-md upvote-btn me-2" data-id="${scenario.id}">
              <i class="bi bi-hand-thumbs-up"></i> <span class="upvote-count">${scenario.upvotes}</span>
            </button>
            <button class="btn btn-md downvote-btn" data-id="${scenario.id}">
              <i class="bi bi-hand-thumbs-down"></i> <span class="downvote-count">${scenario.downvotes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    `;


    scenarioContainer.appendChild(card);
    setUpVotes(card, scenario);
  });
}

// Load scenarios when the page is ready
document.addEventListener('DOMContentLoaded', loadScenarios);

