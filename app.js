import { removeFromFavorites, addToFavorites } from "/favorites.js"

const endpoint = "http://localhost:3000";
let selectedArtist;

window.addEventListener("load", initApp);

function initApp() {
  updateArtistGrid();
  document.querySelector("#form-create").addEventListener("submit", createArtist);
  document.querySelector("#form-update").addEventListener("submit", updateArtist);
}

async function updateArtistGrid() {
  const artists = await readArtists();
  displayArtists(artists);
}

async function readArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();
  return data;
}

function displayArtists(list) {
  document.querySelector("#artist-grid").innerHTML = "";
  for (const artist of list) {
    document.querySelector("#artist-grid").insertAdjacentHTML(
      "beforeend", `
        <article>
          <img src="${artist.image}"></img>
          <h2>${artist.name}</h2>
          <p>${artist.birthdate}</p>
          <p>${artist.activeSince}</p>
          <p>Genres: ${artist.genres.join(', ')}</p>
          <p>Labels: ${artist.labels.join(', ')}</p>
          <p>${artist.shortDescription}</p>
          <div class="btns">
              <button class="btn-update-artist">Update</button>
              <button class="btn-delete-artist">Delete</button>
              <button class="btn-favorite-artist">Fav</button>
              <button class="btn-unfavorite-artist">UnFav</button>
          </div>
        </article>
        `
    );

    document.querySelector("#artist-grid article:last-child .btn-delete-artist").addEventListener("click", () => deleteArtist(artist.id));
    document.querySelector("#artist-grid article:last-child .btn-update-artist").addEventListener("click", () => selectArtist(artist));
    document.querySelector("#artist-grid article:last-child .btn-favorite-artist").addEventListener("click", () => addToFavorites(artist.id));
    document.querySelector("#artist-grid article:last-child .btn-unfavorite-artist").addEventListener("click", () => removeFromFavorites(artist.id));
  }
};


// CRUD functions //
async function createArtist(event) {
  event.preventDefault();

  const name = event.target.name.value;
  const birthdate = event.target.birthdate.value;
  const activeSince = event.target.activeSince.value;
  const genres = event.target.genres.value.split(',').map(item => item.trim());
  const labels = event.target.labels.value.split(',').map(item => item.trim());
  const website = event.target.website.value;
  const image = event.target.image.value;
  const shortDescription = event.target.shortDescription.value;

  const newArtist = {name, birthdate, activeSince, genres, labels, website, image, shortDescription};
  const artistAsJson = JSON.stringify(newArtist);
  const response = await fetch(`${endpoint}/artists`, {
      method: "POST",
      body: artistAsJson,
      headers: {
        "Content-Type": "application/json"
      }
    });
  
  if (response.ok) {
    updateArtistGrid();
    scrollToTop();
  }
};

function selectArtist(artist) {
  selectedArtist = artist;
  const form = document.querySelector("#form-update");
  form.name.value = artist.name;
  form.birthdate.value = artist.birthdate;
  form.activeSince.value = artist.activeSince;
  form.genres.value = artist.genres;
  form.labels.value = artist.labels;
  form.website.value = artist.website;
  form.image.value = artist.image;
  form.shortDescription.value = artist.shortDescription;
  form.scrollIntoView({ behavior: "smooth" });
}

async function updateArtist(event) {
  event.preventDefault();

  const name = event.target.name.value;
  const birthdate = event.target.birthdate.value;
  const activeSince = event.target.activeSince.value;
  const genres = event.target.genres.value.split(',').map(item => item.trim());
  const labels = event.target.labels.value.split(',').map(item => item.trim());
  const website = event.target.website.value;
  const image = event.target.image.value;
  const shortDescription = event.target.shortDescription.value;

  const artistToUpdate = {name, birthdate, activeSince, genres, labels, website, image, shortDescription};
  const artistAsJson = JSON.stringify(artistToUpdate);
  const response = await fetch(`${endpoint}/artists/${selectedArtist.id}`, {
      method: "PUT",
      body: artistAsJson,
      headers: {
        "Content-Type": "application/json"
      }
  });
  if (response.ok) {
    updateArtistGrid();
    scrollToTop();
  }
}

async function deleteArtist(id) {
  const response = await fetch(`${endpoint}/artists/${id}`, {
      method: "DELETE",
  });
  if (response.ok) {
    updateArtistGrid();
  }
}


function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export { updateArtistGrid, endpoint }