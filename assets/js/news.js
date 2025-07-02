fetch("assets/data/news.json")
  .then(response => response.json())
  .then(newsItems => {
    const newsContainer = document.querySelector(".recent_news_card .row");
    newsContainer.innerHTML = ""; // clear

    newsItems.forEach(article => {
      newsContainer.innerHTML += `
        <div class="col-md-4">
          <div class="card card-hover h-100">
            <img src="${article.image}" class="card-img-top img-fluid" alt="${article.title}">
            <div class="card-body">
              <p class="recent_news_time">${article.date}</p>
              <h5 class="card-title">${article.title}</h5>
              <p class="card-text">${article.summary}</p>
              <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#newsModal" data-id="${article.id}">
                Read More <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    // attach event for the modal
    document.querySelectorAll('[data-bs-target="#newsModal"]').forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const item = newsItems.find(x => x.id === id);
        if (item) {
          document.getElementById("newsModalTitle").textContent = item.title;
          document.getElementById("newsModalContent").innerHTML = item.content;
        }
      });
    });
  })
  .catch(error => console.error("Error loading news:", error));
