// Function to create a card element from the JSON data
function createCard(data) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.id = data.Id; // Use the 'Id' from the JSON as the card's type
  card.classList.add(data.Asin); // Use the 'Asin' from the JSON as the card's unique id
  card.classList.add(data.Price); // Use the 'Price' from the JSON as the card's price for the filter

  // Create the card content
  card.innerHTML = `
      <img class="card__hero" src="${data.Image}"/>
      <div class="card__body">
          <div class="card__header">
              <div class="card__subject">
                  <h1 class="card__title">${data.Title}</h1>
                  <small class="card__desc"><strong>${data.Discount}</strong> ${data.Price}€<br />${data.Rating}</small>
              </div>
              <a class="buy card__buy" href="${data.Link}" target="_blank">
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA0UlEQVR4nO2UvQ3CMBCFnQ42QBTQpmYLCqZASNmCMZBYIB0FHSETsEdEz08JH4p0SFFwFB/4Or72+fxsPz07PjkDiYsFftJoBk2AXAwyZwGQiUFuZZCa5NAEqP45hOYQg01fDr8yj94HYAQ8gBswiN4HYCWzO5M+AHuZXUbvAzAE7sATGPctVucALGTmFLJYnQOwlZm1dR9mIQaJhKylMvsovwKYAqUU5whMQjSNQdl6giJE0xhcW5tcQjSNQX31rht0ahqD+p0LOe3Bk4FXe/MCnTXRBhMpTZ0AAAAASUVORK5CYII=" />
              </a>
          </div>
          <div id="article">
              <p class="card__intro" id="intro">${data.Description}</p>
              <p id="intro">${data.Specs}</p>
          </div>
          <div class="card__expand"></div>
      </div>
      <div class="card__constrict">Moins</div>
  `;

  return card;
}

// Fetch the JSON data
fetch("./Data/data.json")
  .then((response) => response.json())
  .then((dataArray) => {
    const container = document.querySelector(".container");
    dataArray.forEach((data) => {
      const card = createCard(data);
      container.appendChild(card);
    });
  })
  .catch((error) => console.error("Error fetching JSON data:", error));
