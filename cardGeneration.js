function createCard(data) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.id = data.Id;
  card.classList.add(data.Asin);
  card.classList.add(data.Price);

  let certificationHTML = "";
  if (data.Id === "Alim") {
    certificationHTML = `
      <div class="certification">
        <img src="./Data/Certifications/${data.Certification}.svg" alt="Certification SVG">
      </div>
    `;
  }

  // Create the card content
  card.innerHTML = `
    <a class="card__close">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAACXBIWXMAAAsTAAALEwEAmpwYAAABAklEQVR4nO2XwQqCQBBAPZVo1/rQiqyQPqoO1iEE+6S6vxCsRE1n1l2w8F13GR/jzO6O542M/CvAFIiBPRAYxgiAA7DO45mKTIATH27AzEDkWopxAXytiA8k1EmBUBgjLPZXSVRCwK4hiFioReTFViMTtQRqFRKI5Gy0/zrVCglFUnUzUC++Jt5Frd2vBvkHFk5FlKl/dKyLu9BWhr6R9c6IJSH7IoZC7kReAHPg3iGSr889l6DLTP/usSTiToh+3WRPiKGcM8gykjk/gZGLuL2bGNKtDWy1IkqheEgvveWQ3sBTsUxpOjhang7O6umgMjetitmpz9wUFXVoNjeNjPwCTzzAIGbIxOxuAAAAAElFTkSuQmCC">
    </a>
    <img class="card__hero" src="${data.Image}"/>
    ${certificationHTML}
    <div class="card__body">
      <div class="card__header">
        <div class="card__subject">
          <h1 class="card__title">${data.Title}</h1>
          <small class="card__desc"><strong>${data.Discount}</strong> ${data.Price}€<br />${data.Rating}</small>
        </div>
        <a class="card__buy" href="${data.Link}" target="_blank">
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
fetch("./Data/Data.json")
  .then((response) => response.json())
  .then((dataArray) => {
    const container = document.querySelector(".container");
    dataArray.forEach((data) => {
      const card = createCard(data);
      container.appendChild(card);
    });
  })
  .catch((error) => console.error("Error fetching JSON data:", error));
