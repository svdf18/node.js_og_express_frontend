import { updateArtistGrid, endpoint } from "/app.js"

const dummyUser = "user123";

// Add artist to user favorites //
async function addToFavorites(artistId) {
  const userId = dummyUser;

  const requestData = { userId, artistId };
  const response = await fetch(`${endpoint}/favorites/${userId}`, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
  });

  updateArtistGrid();
}

// Remove artist from user favorite //
async function removeFromFavorites(artistId) {
  const userId = dummyUser;

  const requestData = { userId, artistId };
  const response = await fetch(`${endpoint}/favorites/${userId}`, {
      method: "DELETE",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
  });

  updateArtistGrid();
}

export { removeFromFavorites, addToFavorites };