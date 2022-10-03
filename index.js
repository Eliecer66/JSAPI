const url = 'https://api.themoviedb.org/3/movie/12?api_key=7c4a986b16b3b892bd7111a358d63e05&language=en-US';
const logo = 'https://api.themoviedb.org/3/movie/75780?api_key=7c4a986b16b3b892bd7111a358d63e05&language=en-US'
const path = 'https://image.tmdb.org/t/p/w1920_and_h600_multi_faces'
const imageCardPath = 'https://image.tmdb.org/t/p/w185'
const latestRelease = 'https://api.themoviedb.org/3/trending/all/day?api_key=7c4a986b16b3b892bd7111a358d63e05'
const pathMovie = 'https://api.themoviedb.org/3/search/movie?api_key=7c4a986b16b3b892bd7111a358d63e05&query='
const inputBar = document.getElementById('form');
const collection = 'https://www.themoviedb.org/collection/';
const highScore = 70;
const regularScore = 50;
const color = {
    green: '#58FA58',
    blue: '#F3F781',
    red: '#FA5858'
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

inputBar.addEventListener('submit', function(e) {

    e.preventDefault();
    let name = inputBar[0].value;
    const nameCleaned = name.replace(/\s/g, '+');
    let search = pathMovie+nameCleaned;

    fetch(search)
    .then(response => response.json())
    .then((data => {
        renderResults(data.results);
    }))
    inputBar.reset();

})

 const renderResults = function(data) {

    const resultsDiv = document.getElementById('containerResults');
    resultsDiv.style.display = 'flex';

    data.forEach(element => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('movie');
        itemCard.innerHTML = `
            <span>${element.title}</span>
            <span>${element.overview}</span>
        `;
        resultsDiv.appendChild(itemCard);
    })
 };

const updatedBackground = function() {

    fetch(latestRelease)
    .then(response => response.json())
    .then((data) => {
        const randomNumber = getRandomInt(data.results.length);
        const result = data.results[randomNumber].poster_path;
        const imageUrl = path+result;
        const element = document.getElementById('pictures');
        element.style.backgroundImage = "url("+ imageUrl +")";
    } )
}();
 
const pageLogo = function() {
    fetch(logo)
    .then(response => response.json())
    .then((data) => {
        const imageUrl = path+data.belongs_to_collection.poster_path;
        const updateLogo = document.getElementById('element');
        updateLogo.innerHTML = `<img src="${imageUrl}"/>`
    })
};

function clickHandle (event) {
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        
        let element = document.getElementById('message');
        element.innerHTML = `<p>${data.overview}</p>`;
    });
}

// This function renders the cards that are going to be show in the page.
const renderMoviesCards = function(data) {
    
    const divContainer = document.getElementById('listContainer');
    
    data.forEach((element) => {

        const posterPath = element.poster_path;
        const nameInfo = element.name || element.title;
        const releaseInfo = element.first_air_date || element.release_date;
        const scoreInfo = element.vote_average.toFixed(1) * 10;
        const imageUrl = imageCardPath+posterPath;

        const itemCard = document.createElement('div');
        itemCard.classList.add('movieCard');

        itemCard.innerHTML =  `
            <img src= "" class="image"></img>
            <div class="description">
                <p class="movieName">${nameInfo}</p>
                <p class="releaseInfo">${releaseInfo}</p>
                <p class="scoreBox">${scoreInfo+'%'}</p>
            </div>
        `;

        itemCard.children[0].src = imageUrl;
        divContainer.appendChild(itemCard);
    
        const box = itemCard.children[1].children[2];
        paintBoxScore(scoreInfo, box);
    });
}

// This function calls the API and get the response.
const renderTopMovies = function() {

    fetch(latestRelease)
    .then(response => response.json())
    .then((data) => {
        renderMoviesCards(data.results);
    });
}();


// This function paints the average box depending on the score.
function paintBoxScore(value, element) {

    const isAverage = value > regularScore && value < highScore;
    const isHighScore = value > highScore;
    const isBadScore = value <= regularScore;

    if (isHighScore) {
        element.style.backgroundColor = color.green;
    }

    if (isAverage) {
        element.style.backgroundColor = color.blue;
    }

    if (isBadScore) {
        element.style.backgroundColor = color.red;
    }
}