const url = 'https://api.themoviedb.org/3/movie/12?api_key=7c4a986b16b3b892bd7111a358d63e05&language=en-US';
const logo = 'https://api.themoviedb.org/3/movie/75780?api_key=7c4a986b16b3b892bd7111a358d63e05&language=en-US'
const path = 'https://image.tmdb.org/t/p/w1920_and_h600_multi_faces'
const latestRelease = 'https://api.themoviedb.org/3/trending/all/day?api_key=7c4a986b16b3b892bd7111a358d63e05'
const pathMovie = 'https://api.themoviedb.org/3/search/movie?api_key=7c4a986b16b3b892bd7111a358d63e05&query='
const inputBar = document.getElementById('form');
const collection = 'https://www.themoviedb.org/collection/';

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

inputBar.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let name = inputBar[0].value;
    const nameCleaned = name.replace(/\s/g, '+');
    let search = pathMovie+nameCleaned;
    console.log(search);

    fetch(search)
    .then(response => response.json())
    .then((data => {
        let id = data.results[0].id;
        let result = collection+id;
        window.location = result;
    }))

    inputBar.reset();
    

})

 function goSearch() { 
    

 };

const updatedBackground = function() {
    fetch(latestRelease)
    .then(response => response.json())
    .then((data) => {
        let randomNumber = getRandomInt(data.results.length);
        let result = data.results[randomNumber].poster_path;
        let ultimatePath = path+result;
        let element = document.getElementById('pictures');
        element.innerHTML = `<img src="${ultimatePath}"/>`;

    } )
}();
 
const pageLogo = function() {
    fetch(logo)
    .then(response => response.json())
    .then((data) => {
        let ultimatePath = path+data.belongs_to_collection.poster_path;
        let updateLogo = document.getElementById('element');
        updateLogo.innerHTML = `<img src="${ultimatePath}"/>`
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

