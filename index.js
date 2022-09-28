const url = 'https://api.themoviedb.org/3/movie/12?api_key=7c4a986b16b3b892bd7111a358d63e05&language=en-US';
const logo = 'https://api.themoviedb.org/3/movie/75780?api_key=7c4a986b16b3b892bd7111a358d63e05&language=en-US'
const path = 'https://image.tmdb.org/t/p/w1920_and_h600_multi_faces'
const pathCard = 'https://image.tmdb.org/t/p/w185'
const latestRelease = 'https://api.themoviedb.org/3/trending/all/day?api_key=7c4a986b16b3b892bd7111a358d63e05'
const pathMovie = 'https://api.themoviedb.org/3/search/movie?api_key=7c4a986b16b3b892bd7111a358d63e05&query='
const inputBar = document.getElementById('form');
const collection = 'https://www.themoviedb.org/collection/';
const hightScore = 70;
const regularScore = 50;

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
        let randomNumber = getRandomInt(data.results.length);
        let result = data.results[randomNumber].poster_path;
        let imageUrl = path+result;
        let element = document.getElementById('pictures');
        element.style.backgroundImage = "url("+ imageUrl +")";
    } )
}();
 
const pageLogo = function() {
    fetch(logo)
    .then(response => response.json())
    .then((data) => {
        let imageUrl = path+data.belongs_to_collection.poster_path;
        let updateLogo = document.getElementById('element');
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

const renderTopMovies = function() {

    let cardsList = document.getElementsByClassName('movieCard');

    fetch(latestRelease)
    .then(response => response.json())
    .then((data) => {

        let i = 0;
        card = Object.values(cardsList);
        
        card.forEach(element => {
            let posterPath = data.results[i].poster_path;
            let nameInfo = data.results[i].name || data.results[i].original_title  ;
            let releaseInfo = data.results[i].first_air_date || data.results[i].release_date;
            let scoreInfo = data.results[i].vote_average.toFixed(1) * 10;
            let imageUrl = pathCard+posterPath;

            element.children[0].style.backgroundImage = "url("+ imageUrl +")";
            element.children[1].innerHTML =  `
                <p class="movieName">${nameInfo}</p>
                <p class="releaseInfo">${releaseInfo}</p>
                <p class="scoreBox">${scoreInfo+'%'}</p>
            `;

            i++;
            let box = element.children[1].children[2];
            paintBoxScore(scoreInfo, box);
        });
    });
}();

function paintBoxScore(value, element) {

    if (value > hightScore) {
        element.style.backgroundColor = '#58FA58';
    } else if (value > regularScore && value < hightScore ) {
        element.style.backgroundColor = '#F3F781';
    } else if (value < regularScore) {
        element.style.backgroundColor = '#FA5858';
    }
}