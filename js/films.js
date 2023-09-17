document.addEventListener('DOMContentLoaded', () => {
    getSpacies(1);

    let links = document.querySelectorAll('.page-link');
    let arrowLeft = document.querySelector('.arrow-left');
    let arrowRight = document.querySelector('.arrow-right');
    let currentActiveLink = document.querySelector('.active');

    links.forEach(link => {
        link.parentElement.addEventListener('click', () => {
            const linkContent = link.textContent;
            const linkContentParseInt = parseInt(link.textContent);

            if (!link.parentElement.classList.contains('active') && !isNaN(linkContentParseInt)) {
                currentActiveLink.classList.remove('active');
                link.parentElement.classList.add('active');
                currentActiveLink = link.parentElement;
            }

            console.log(linkContent);
        });
    });
});


function getSpacies(page) {
    let xml = new XMLHttpRequest();
    let url = `https://swapi.dev/api/films/?page=${page}`;
    xml.open('GET', url);
    xml.responseType = 'json';
    xml.send();
    xml.onload = () => {
        showAllSpacies(xml.response.results);
    };
}

function showAllSpacies(data) {
    let content = document.querySelector('.content');
    content.innerHTML = '';
    data.forEach(film => {
        const filmId = film.url.match(/\/([0-9]*)\/$/)[1];
        const imageUrl = `https://starwars-visualguide.com/assets/img/films/${filmId}.jpg`;

        let str = `<div class="card mb-3">
            <h3 class="card-header">${film.title}</h3>
            <img src="${imageUrl}" class="card-img-top" alt="${film.title}">
        </div>`;
        content.insertAdjacentHTML('beforeend', str);
    });
    showSpacies(data)
}


function showSpacies(data) {
    let blocks = document.querySelectorAll('.content div.card')

    for (let index = 0; index < blocks.length; index++) {
        blocks[index].addEventListener('click', () => {
            showDetails(data[index], blocks[index].children[1].src)
            document.querySelector('.details').classList.add('show')
        })
    }
    document.querySelector(".border-info").addEventListener('click', () => {
        document.querySelector(".details").classList.remove('show')
    })
}


function showDetails(data, url){
    let img = document.querySelector('.details .card-header img')
    let li = document.querySelectorAll('.details .info')
    const {title, created, director, edited, producer} = data

    li[0].textContent = title
    li[1].textContent = created
    li[2].textContent = director
    li[3].textContent = edited
    li[4].textContent = producer

    img.src = url;
}