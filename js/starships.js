document.addEventListener('DOMContentLoaded', () => {
    getStarships(1);

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
                getStarships(linkContentParseInt);
                updateArrowStates(linkContentParseInt);
            } else {
                if (linkContent == '«' && !arrowLeft.classList.contains('disabled') && parseInt(currentActiveLink.textContent) > 1) {
                    const previousLink = currentActiveLink.previousElementSibling;
                    if (previousLink) {
                        currentActiveLink.classList.remove('active');
                        previousLink.classList.add('active');
                        getStarships(parseInt(previousLink.textContent));
                        currentActiveLink = previousLink;
                    }
                }

                if (linkContent == '»' && !arrowRight.classList.contains('disabled') && parseInt(currentActiveLink.textContent) < 4) {
                    const nextLink = currentActiveLink.nextElementSibling;
                    if (nextLink) {
                        currentActiveLink.classList.remove('active');
                        nextLink.classList.add('active');
                        getStarships(parseInt(nextLink.textContent));
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

        if (activeLinkIndex == 4) {
            arrowRight.classList.add('disabled');
        } else {
            arrowRight.classList.remove('disabled');
        }
    }
});


function getStarships(page) {
    let xml = new XMLHttpRequest()
    let url = `https://swapi.dev/api/starships?page=${page}`
    xml.open('GET', url)
    xml.responseType = 'json'
    xml.send()
    xml.onload = () => {
        showAllStarships(xml.response.results)
    }
}

function showAllStarships(data) {
    let content = document.querySelector('.content');
    content.innerHTML = '';
    data.forEach(element => {
        const starshipId = element.url.match(/\/([0-9]*)\/$/)[1];
        const imageUrl = `https://starwars-visualguide.com/assets/img/starships/${starshipId}.jpg`;
        const fallbackImageUrl = 'https://starwars-visualguide.com/assets/img/placeholder.jpg';

        let str = `<div class="card mb-3">
            <h3 class="card-header">${element.name}</h3>
            <img src="${imageUrl}" class="card-img-top" alt="${element.name}" onerror="replaceImage(this, '${fallbackImageUrl}')">
        </div>`;
        content.insertAdjacentHTML('beforeend', str);
    });
    showVehicle(data)
}

function replaceImage(imageElement, fallbackUrl) {
    imageElement.src = fallbackUrl;
}


function showVehicle(data) {
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
    const {name, MGLT, cargo_capacity, consumables, cost_in_credits} = data

    li[0].textContent = name
    li[1].textContent = MGLT
    li[2].textContent = cargo_capacity
    li[3].textContent = consumables
    li[4].textContent = cost_in_credits

    img.src = url;
}