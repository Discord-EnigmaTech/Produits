// Function to create a card element
function createCard(data) {
    const ul = document.querySelector('#section1 ul');
    const li = document.createElement('li');
    li.innerHTML = `
        <div class="img-card iCard-style1">
            <div class="card-content">
            <a href="${data.lien}" title="Acheter" target="_blank">
                <div class="card-image">
                    <img src="${data.image}" alt="${data.titre}" />
                </div>
            </a>
                
                <div class="card-text">
                    <div class="card-title">${data.titre}</div>
                    <p>${data.texte}</p>
                </div>

            </div>
            </hr>
            <div class="card-link">
                <a href="${data.lien}" title="Acheter" target="_blank"><span>Acheter</span></a>
            </div>
        </div>
    `;
    ul.appendChild(li);
}

// Fetch data from the JSON file
fetch('./json/produits.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            createCard(item);
        });
    })
    .catch(error => console.error('Error fetching data:', error));