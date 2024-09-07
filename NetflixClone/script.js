const API_KEY = '5ef71e1a'; // Your OMDb API key
const BASE_URL = 'http://www.omdbapi.com/';

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('search-input').value;
    fetchMovies(searchTerm);
});

async function fetchMovies(query = 'batman') {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}&type=movie`);
    const data = await response.json();
    if (data.Response === "True") {
        displayMovies(data.Search);
    } else {
        displayError(data.Error);
    }
}

function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = ''; // Clear previous content
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.Title}">
            <div class="movie-title">${movie.Title}</div>
        `;
        movieElement.addEventListener('click', () => fetchMovieDetails(movie.imdbID));
        moviesContainer.appendChild(movieElement);
    });
}

async function fetchMovieDetails(id) {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
    const movie = await response.json();
    displayMovieDetails(movie);
}

function displayMovieDetails(movie) {
    const detailsContainer = document.getElementById('movie-details');
    detailsContainer.innerHTML = `
        <span class="close">&times;</span>
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${movie.Title}">
        <h2>${movie.Title}</h2>
        <p><strong>Release Date:</strong> ${movie.Released}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <p><strong>Rating:</strong> ${movie.imdbRating}</p>
    `;
    detailsContainer.style.display = 'block';
    document.querySelector('.close').addEventListener('click', () => {
        detailsContainer.style.display = 'none';
    });
}

function displayError(error) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = `<div class="error-message">${error}</div>`;
}

fetchMovies(); // Fetch default movies on initial load
