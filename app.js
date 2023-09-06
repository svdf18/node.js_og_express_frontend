import { toggleFavorite, getFavoriteArtistIds } from "/favorites.js"
import { scrollToTop } from "/helpers.js";

const endpoint = "http://localhost:3000";
let selectedArtist;
let currentArtistList = "all";

window.addEventListener("load", initApp);

// Init and eventlisteners //

function initApp() {
  updateArtistGrid();
  document.querySelector("#form-create").addEventListener("submit", createArtist);
  document.querySelector("#form-update").addEventListener("submit", updateArtist);
  document.querySelector
    ("#display-all-artists").addEventListener
    ("click", () => {currentArtistList = "all";
    updateArtistGrid();
  });
  document.querySelector
    ("#display-favorite-artists").addEventListener
    ("click", () => {currentArtistList = "favorites";
    updateArtistGrid();
  });
}

// Read and update //

async function updateArtistGrid() {
  const artists = await readArtists();
  displayArtists(artists);
}

async function readArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();
  return data;
}

// Display all artists or favorite artists //

async function displayArtists(list) {
  document.querySelector("#artist-grid").innerHTML = "";

  let filteredList = list;
  let favoriteArtistIds = [];

  if (currentArtistList === "favorites") {
    favoriteArtistIds = await getFavoriteArtistIds();
    filteredList = list.filter(artist => favoriteArtistIds.includes(artist.id));
  }

  for (const artist of filteredList) {
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
              <button class="btn-toggle-favorite-artist">Fav</button>
          </div>
        </article>
      `
    );

    document.querySelector("#artist-grid article:last-child .btn-delete-artist").addEventListener("click", () => deleteArtist(artist.id));
    document.querySelector("#artist-grid article:last-child .btn-update-artist").addEventListener("click", () => selectArtist(artist));
    document.querySelector("#artist-grid article:last-child .btn-toggle-favorite-artist").addEventListener("click", () => toggleFavorite(artist.id));
  }
}



// CRUD FUNCTIONS //

// Create artist //
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

// Select artist //
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

// Update artist //
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

// Delete artist //
async function deleteArtist(id) {
  const response = await fetch(`${endpoint}/artists/${id}`, {
      method: "DELETE",
  });
  if (response.ok) {
    updateArtistGrid();
    scrollToTop();
  }
}

export { updateArtistGrid, endpoint }