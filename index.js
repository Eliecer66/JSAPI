const url = 'https://api.themoviedb.org/3/movie/12?api_key=7c4a986b16b3b892bd7111a358d63e05&language=en-US';
const logo = 'https://api.themoviedb.org/3/movie/75780?api_key=7c4a986b16b3b892bd7111a358d63e05&language=en-US';
const path = 'https://image.tmdb.org/t/p/w1920_and_h600_multi_faces';
const imageCardPath = 'https://image.tmdb.org/t/p/w185';
const latestDayRelease = 'https://api.themoviedb.org/3/trending/all/day?api_key=7c4a986b16b3b892bd7111a358d63e05&language=en-US&page=1';
const trendingSeries = ' https://api.themoviedb.org/3/trending/tv/week?api_key=7c4a986b16b3b892bd7111a358d63e05&language=en-US&page=1';
const latestWeekRelease = ' https://api.themoviedb.org/3/trending/all/week?api_key=7c4a986b16b3b892bd7111a358d63e05&language=en-US&page=1';
const pathMovie = 'https://api.themoviedb.org/3/search/movie?api_key=7c4a986b16b3b892bd7111a358d63e05&query=';
const inputBar = document.getElementById('form');
const resultsDiv = document.getElementById('containerResults');
const posterPath = 'https://image.tmdb.org/t/p/w154';
const collection = 'https://www.themoviedb.org/collection/';
const highScore = 70;
const regularScore = 50;
const SEARCH = 'search';
const SHOW_LIST = 'showList';
const SUBMIT = 'submit';


function getRandomInt(max) {
    return Math.floor(Math.random() * max); 
 }

// Class that constructs the properties and methods needed to handle movie information.
 class Movie {
    constructor(element) {
        this.posterPath = element.poster_path;
        this.nameInfo = element.name || element.title;
        this.releaseInfo = element.first_air_date || element.release_date;
        this.scoreInfo = element.vote_average.toFixed(1) * 10;
        this.imageUrl = imageCardPath+this.posterPath;
        this.posterUrl = posterPath+this.posterPath;
        this.overview = element.overview;
    }

    showAsList(itemCard) {
        itemCard.classList.add('movieCard');
        itemCard.innerHTML =  `
            <img src="${this.imageUrl}" class="image">
            <div class="description">
                <p class="movieName">${this.nameInfo}</p>
                <p class="releaseInfo">${this.releaseInfo}</p>
                <p class="scoreBox">${this.scoreInfo}<span>%</span></p>
            </div>
        `;
        const box = itemCard.children[1].children[2];
        paintBoxScore(this.scoreInfo, box);
    }

    showAsResult(itemCard) {
        itemCard.classList.add('movie');
        itemCard.innerHTML = `
            <img class="poster" src="${this.posterUrl}">
            <div class="dataMovie">
                <div class="data">
                    <p class="titleSearch">${this.nameInfo}</p>
                    <p class="dateSearch">${this.releaseInfo}</p>
                </div>
                <div class="overview"> ${this.overview}</div>
            </div>
        `;
    }
}

// It is in charged to found the movie.
inputBar.addEventListener(SUBMIT, function(e) {
    e.preventDefault();
    const name = inputBar[0].value;
    const nameCleaned = name.replace(/\s/g, '+');
    const search = pathMovie+nameCleaned;

    fetch(search)
    .then(response => response.json())
    .then((data => {

        if (data.results.length) {
            return renderResults(data.results);
        } 
        renderMessage();
    })) 
    inputBar.reset();
});

// Renders the message to the user about the movie was not found
const renderMessage = function() {
    resultsDiv.classList.add('showContainer');

    resultsDiv.innerHTML = `
        <h2 class="emptyResponse">There are no movies that matched your query.</h2>
    `;
}

// Here is where the results of the searching are shown
const renderResults = function(data) {
    resultsDiv.classList.add('showContainer');
    resultsDiv.innerHTML = '';
    renderMoviesCards(data, 'containerResults', SEARCH);
 };

// It is responsible for render the background of the search bar.
const updatedBackground = function() {
    fetch(latestWeekRelease)
    .then(response => response.json())
    .then((data) => {
        const randomNumber = getRandomInt(data.results.length);
        const result = data.results[randomNumber].backdrop_path;
        const imageUrl = path+result;
        const element = document.getElementById('pictures');
        element.style.backgroundImage = "url("+ imageUrl +")";
    } )
}();
 
// This function loads the page's logo.
const pageLogo = function() {
    fetch(logo)
    .then(response => response.json())
    .then((data) => {
        const imageUrl = path+data.belongs_to_collection.poster_path;
        const updateLogo = document.getElementById('element');
        updateLogo.innerHTML = `<img src="${imageUrl}"/>`
    })
};

// This function renders the cards that are going to be show in the page.
const renderMoviesCards = function(data, divElement, result) {
    const divContainer = document.getElementById(divElement);
    divContainer.innerHTML = '';
    
    data.forEach((element) => {
        let newMovie = new Movie(element);
        const itemCard = document.createElement('div');

        if (result === SEARCH) {
            newMovie.showAsResult(itemCard);
        }

        if (result === SHOW_LIST) {
            newMovie.showAsList(itemCard);
        }

        divContainer.appendChild(itemCard);
    });
}

// This function calls the API and get the response.
const renderTopMovies = function(latestDayRelease, divElement) {
    fetch(latestDayRelease)
    .then(response => response.json())
    .then((data) => {
        renderMoviesCards(data.results, divElement, SHOW_LIST);
    });
};

// The call to the functions to load the list of movies and tv shows
renderTopMovies(latestDayRelease, 'listContainer', SHOW_LIST);
renderTopMovies(trendingSeries, 'secondListContainer', SHOW_LIST);


// This function paints the average box depending on the score.
function paintBoxScore(value, element) {
    const isAverage = value > regularScore && value < highScore;
    const isHighScore = value => highScore;
    const isBadScore = value <= regularScore;

    if (isHighScore) {
        element.classList.add('goodScore');
    }
    
    if (isAverage) {
        element.classList.add('regularScore');
    }
    
    if (isBadScore) {
        element.classList.add('badScore');
    }
}

// This function can change the status of the topMovies list
const newSelected = function(selected) {
    const element = document.getElementById('selector');
    const optionsA = document.getElementById('firstOption');
    const optionsB = document.getElementById('secondOption');

    if (selected === 'b') {
        renderTopMovies(latestWeekRelease, 'listContainer', SHOW_LIST);
        if (!element.classList.contains('selectorRightMove')) {
            element.classList.add('selectorRightMove');
            optionsA.classList.replace('firstOptionMove', 'secondOptionMove');
            optionsB.classList.replace('secondOptionMove', 'firstOptionMove');
            return;
        }

        element.classList.replace('selectorLeftMove','selectorRightMove');
        optionsA.classList.replace('firstOptionMove', 'secondOptionMove');
        optionsB.classList.replace('secondOptionMove', 'firstOptionMove');
    }
    
    if (selected === 'a') {
        renderTopMovies(latestDayRelease, 'listContainer', SHOW_LIST);
        element.classList.add('selectorLeftMove');
        optionsA.classList.replace('secondOptionMove', 'firstOptionMove');
        optionsB.classList.replace('firstOptionMove', 'secondOptionMove');
    }
}