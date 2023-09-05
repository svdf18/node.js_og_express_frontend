import { updateArtistGrid, endpoint } from "/app.js"

const dummyUser = "user123";

async function toggleFavorite(artistId) {
  const userId = dummyUser;

  // Check if the artist is already in favorites
  const isFavorite = await checkFavoriteStatus(userId, artistId);

  if (isFavorite) {
    await removeFromFavorites(artistId);
  } else {
    await addToFavorites(artistId);
  }

  updateArtistGrid();
}

async function checkFavoriteStatus(userId, artistId) {
  const response = await fetch(`${endpoint}/favorites/${userId}`);
  if (response.ok) {
    const favorites = await response.json();
    return favorites.includes(artistId);
  } else {
    // Handle the error, e.g., show a message to the user
    console.error("Error checking favorite status:", response.statusText);
    return false; // Return false on error
  }
}

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

export { removeFromFavorites, addToFavorites, toggleFavorite };