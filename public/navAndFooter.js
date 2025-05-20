document.addEventListener("DOMContentLoaded", () => {
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="./index.html">
          <img class="rounded" src="./Resources/ifthen_logo.png" alt="Ifthen Logo" height="40">
        </a>
         <input id="search-query" class="form-control me-2 w-50" type="search" placeholder="Search..." name="query" aria-label="Search">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="./whatIf.html">What Ifs</a></li>
            <li class="nav-item"><a class="nav-link" href="./explore.html">Explore</a></li>
            <li class="nav-item"><a class="nav-link" href="./about.html">About</a></li>
            <li class="nav-item"><a class="nav-link" href="./contactUs.html">Contact Us</a></li>
            <li class="nav-item">
            <a href="./submit.html" class="btn btn-primary btn-md">Create your WhatIF</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  const footerHTML = `
    <footer class="bg-dark text-white py-4">
    <div class="container-lg">
      <div class="row">
        <div class="col-md-6 mb-3">
          <h5>
            <img class="rounded px-2" src="./Resources/ifthen_logo.png" alt="ifthen logo" height="40"> IF{}.THEN()
          </h5>
          <p class="text-light">Explore infinite scenarios. Dive deep into "What If?"</p>
        </div>

        <div class="col-md-3 mb-3">
          <h6 class="fw-semibold">Quick Links</h6>
          <ul class="list-unstyled text-muted">
            <li><a href="./index.html" class="text-white text-decoration-none">Home</a></li>
            <li><a href="./explore.html" class="text-white text-decoration-none">Explore</a></li>
            <li><a href="./submit.html" class="text-white text-decoration-none">Submit</a></li>
          </ul>
        </div>

        <div class="col-md-3 mb-3">
          <h6 class="fw-semibold">Contact Us</h6>
          <ul class="list-unstyled text-light">
            <li><a class="text-decoration-none text-white"
                href="https://www.google.com/maps?q=1234+Imagination+Lane,+Dream+City" target="_blank">&#128204 1234
                Imagination Lane, Dream City</a></li>
            <li><a class="text-decoration-none text-white" href="tel:+1234567890">&#128222 +123 456 7890</a></li>
            <li><a class="text-decoration-none text-white" href="mailto:support@ifthen.com">&#9993
                support@ifthen.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="text-center pt-4 border-top">
        <p class="small text-light mb-0">&copy; 2025 if{}.then(). All rights reserved.</p>
      </div>
    </div>
  </footer>
  `;

  document.getElementById("navbar-placeholder").innerHTML = navbarHTML;
  document.getElementById("footer-placeholder").innerHTML = footerHTML;


  document.getElementById("search-query").addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();

    // if search is empty, display no result
    if (query===""){
      document.getElementById("scenarios-container").innerHTML = "";
      return;
    }
  
    // Filter the scenarios based on the search query
    const filteredScenarios = scenarios.filter(scenario => {
      const titleMatch = scenario.title.toLowerCase().includes(query);
      const descMatch = scenario.description.toLowerCase().includes(query);
      const tagMatch = scenario.tags.some(tag => tag.toLowerCase().includes(query));
      return titleMatch || descMatch || tagMatch;
  });
  
    // Call the function to display the filtered results and pass the query to highlight
    displayScenarios(filteredScenarios, query);
    document.getElementById("scenarios-container").scrollIntoView({ behavior: "smooth" });
  });

  function displayScenarios(scenarios, query) {
    const container = document.getElementById("scenarios-container");
    container.innerHTML = ""; // Clear previous results
  
    // Create a regex for the query to find all occurrences (case-insensitive)
    const regex = new RegExp(`(${query})`, 'gi');
  
    scenarios.forEach(scenario => {
      // Highlight the searched word in title and description
      const highlightedTitle = scenario.title.replace(regex, "<mark>$1</mark>");
      const highlightedDescription = scenario.description.replace(regex, "<mark>$1</mark>");
      const highlightedTags = scenario.tags.map(tag => {
        const regex = new RegExp(`(${query})`, 'gi');
        const tagText = tag.replace(regex, "<mark>$1</mark>");
        const color = tagStyles[tag] || '#ccc';
        return `<span class="badge me-1" style="background-color:${color}">${tagText}</span>`;
      }).join(" ");
  
      const card = `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${highlightedTitle}</h5>
            <p class="card-text">${highlightedDescription}</p>
            <div class="mt-2">${highlightedTags}</div>
          </div>
        </div>
      `;
      container.innerHTML+=card;
    });
  }
  
  
});
