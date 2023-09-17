document.addEventListener('DOMContentLoaded', () => {
    getFilms(1);

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

            if (!isNaN(linkContentParseInt)) {
                getFilms(linkContentParseInt);
                updateArrowStates(linkContentParseInt);
            } else {
                if (linkContent == '«' && !arrowLeft.classList.contains('disabled') && parseInt(currentActiveLink.textContent) > 1) {
                    const previousLink = currentActiveLink.previousElementSibling;
                    if (previousLink) {
                        currentActiveLink.classList.remove('active');
                        previousLink.classList.add('active');
                        getFilms(parseInt(previousLink.textContent));
                        currentActiveLink = previousLink;
                    }
                }

                if (linkContent == '»' && !arrowRight.classList.contains('disabled') && parseInt(currentActiveLink.textContent) < 5) {
                    const nextLink = currentActiveLink.nextElementSibling;
                    if (nextLink) {
                        currentActiveLink.classList.remove('active');
                        nextLink.classList.add('active');
                        getFilms(parseInt(nextLink.textContent));
                        currentActiveLink = nextLink;
                    }
                }

                updateArrowStates(parseInt(currentActiveLink.textContent));
            }
        });
    });

    function updateArrowStates(activeLinkIndex) {
        if (activeLinkIndex > 1) {
            arrowLeft.classList.remove('disabled');
        } else {
            arrowLeft.classList.add('disabled');
        }

        if (activeLinkIndex == 5) {
            arrowRight.classList.add('disabled');
        } else {
            arrowRight.classList.remove('disabled');
        }
    }
});


function getFilms(page) {
    let xml = new XMLHttpRequest()
    let url = `https://swapi.dev/api/planets/?page=${page}`
    xml.open('GET', url)
    xml.responseType = 'json'
    xml.send()
    xml.onload = () => {
        showAllPlanets(xml.response.results)
    }
}

function showAllPlanets(data) {
    let content = document.querySelector('.content');
    content.innerHTML = '';
    data.forEach(planet => {
        const planetId = planet.url.match(/\/([0-9]*)\/$/)[1];
        const imageUrl = `https://starwars-visualguide.com/assets/img/planets/${planetId}.jpg`;
        const fallbackImageUrl = 'https://starwars-visualguide.com/assets/img/placeholder.jpg';

        let str = `<div class="card mb-3">
            <h3 class="card-header">${planet.name}</h3>
            <img src="${imageUrl}" class="card-img-top" alt="${planet.name}" onerror="replaceImage(this, '${fallbackImageUrl}')">
        </div>`;
        content.insertAdjacentHTML('beforeend', str);
    });
    showPlanets(data)
}

function replaceImage(imageElement, fallbackUrl) {
    imageElement.src = fallbackUrl;
}

function showPlanets(data) {
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
    const {name , created, diameter, gravity, climate} = data

    li[0].textContent = name
    li[1].textContent = created
    li[2].textContent = diameter
    li[3].textContent = gravity
    li[4].textContent = climate

    img.src = url;
}