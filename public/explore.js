document.addEventListener("DOMContentLoaded", () => {
  // Initialize select2 for tag search input
  const tagInput = $("#tagSearchInput");
  tagInput.select2({
    theme: "bootstrap-5",
    placeholder: "Search by tags...",
    tags: false,
    data: Object.keys(tagStyles).map(tag => ({ id: tag, text: tag }))
  });

  // Listen for tag changes or keyup events to filter scenarios
  tagInput.on('change', () => {
    const selectedTags = tagInput.val(); // Get selected tags
    filterByTags(selectedTags);
  });

  // Initial call to load scenarios
  filterByTags([]);
});

function filterByTags(tags) {
  const browseScenarioContainer = document.getElementById('browse-scenario-container');
  browseScenarioContainer.innerHTML = ''; // Clear the container

  // Filter scenarios based on selected tags
  const filteredScenarios = scenarios.filter(s =>
    tags.length === 0 || tags.every(t => s.tags.map(st => st.toLowerCase()).includes(t.toLowerCase()))
  );

  // Display message if no scenarios match
  if (filteredScenarios.length === 0) {
    browseScenarioContainer.innerHTML = '<p class="text-center">No scenarios found for selected tags.</p>';
    return;
  }

  // Loop through filtered scenarios and create cards
  filteredScenarios.forEach(scenario => {
    let tagsHTML = scenario.tags.map(tag => {
      const bgColor = tagStyles[tag] || '#bdc3c7';
      return `<span class="badge me-2" style="background-color: ${bgColor}; color: white;">${tag}</span>`;
    }).join('');

    const browseCard = document.createElement('div');
    browseCard.classList.add('col-xl-4', 'col-lg-6');

    browseCard.innerHTML = `
      <div class="card h-100">
        <img src="${scenario.imageUrl}" class="card-img-top img-fluid" alt="${scenario.title}" style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <div class="mb-2">${tagsHTML}</div>
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
    `;

    browseScenarioContainer.appendChild(browseCard);
    setUpVotes(browseCard, scenario);
  });
}
